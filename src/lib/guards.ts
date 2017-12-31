import { NavigationGuard, RouteRecord } from 'vue-router';
import { User } from '../store/auth';
import { store } from '../store';
import { BehaviorSubject } from './observe';

const user = new BehaviorSubject<User>(null);
store.watch(store => store.auth.user, value => user.next(value || null), { immediate: true });

interface GuardDecision {
  allowed: boolean;
  deniedReason?: string;
}

const allowed: GuardDecision = { allowed: true };

interface Guard {
  decide(route: RouteRecord): GuardDecision | Promise<GuardDecision>;
}

class HasAnyRole implements Guard {
  private hasAnyRole(user: User, roles: string[]): boolean {
    for (const role of roles) {
      if (user.roles[role]) {
        return true;
      }
    }

    return false;
  }

  decide(route: RouteRecord): GuardDecision | Promise<GuardDecision> {
    if (route.meta.anyRole) {
      const roles: string[] = route.meta.anyRole;

      return new Promise((resolve, reject) => {
        user.when('value', u => {
          if (u) {
            if (this.hasAnyRole(u, roles)) {
              resolve(allowed);
            } else {
              resolve({ allowed: false, deniedReason: `Must have any role of [${roles.join(' or ')}]` });
            }

            return true;
          }
        });
      });
    }

    return allowed;
  }
}

const guards: Guard[] = [new HasAnyRole()];

export const checkGuard: NavigationGuard = async (to, from, next) => {
  for (const route of to.matched) {
    const results = await Promise.all(guards.map(guard => guard.decide(route)));

    if (results.some(r => !r.allowed)) {
      const reasons = results.filter(r => !r.allowed).map(r => r.deniedReason);
      console.warn('denied navigation to %s:', to.fullPath, reasons);
      next(false);
      return;
    }
  }

  next();
};

const prefix = 'drivr/';

const Names = {
  Car: {
    added: prefix + 'cars/added',
    changed: prefix + 'cars/changed',
    removed: prefix + 'cars/removed',
    clear: prefix + 'cars/clear',
  },
  Refuel: {
    added: prefix + 'refuels/added',
    changed: prefix + 'refuels/changed',
    clear: prefix + 'refuels/clear',
  },
  User: {
    login: prefix + 'user/login',
    logout: prefix + 'user/logout',
  }
};

export default Names;

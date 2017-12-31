export type Observer<T> = (value: T) => void;

export type Mapper<T, R> = (value: T) => R;

export class Subject<T> {
  private observers: { [type: string]: Observer<T | null>[] } = {};

  next(value: T | null) {
    this.emit('value', value);
  }

  private emit(type: string, value: T | null) {
    (this.observers[type] || []).forEach(observer => observer(value));
  }

  on(type: string, observer: Observer<T | null>) {
    (this.observers[type] = this.observers[type] || []).push(observer);
  }

  once(type: string, observer: Observer<T | null>) {
    const delegate: Observer<T | null> = value => {
      observer(value);
      this.off(type, delegate);
    };

    this.on(type, delegate);
  }

  when(type: string, observer: Mapper<T | null, boolean | undefined>) {
    const delegate: Observer<T | null> = value => {
      if (observer(value)) this.off(type, delegate);
    };

    this.on(type, delegate);
  }

  off(type: string, observer: Observer<T | null>) {
    const observers = this.observers[type];
    if (observers) {
      const index = observers.indexOf(observer);
      if (index >= 0) observers.splice(index, 1);
    }
  }
}

export class BehaviorSubject<T> extends Subject<T> {
  private value: T | null;

  constructor(initialValue: T | null) {
    super();
    this.value = initialValue;
  }

  next(value: T | null) {
    this.value = value;
    super.next(value);
  }

  on(type: string, observer: Observer<T | null>) {
    observer(this.value);
    super.on(type, observer);
  }

  once(type: string, observer: Observer<T | null>) {
    observer(this.value);
  }
}

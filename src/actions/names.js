const prefix = 'drivr/';

const Names = {
  Car: {
    added: prefix + 'cars/added',
    changed: prefix + 'cars/changed',
    removed: prefix + 'cars/removed',
  },
  Refuel: {
    added: prefix + 'refuels/added',
    changed: prefix + 'refuels/changed',
    removed: prefix + 'refuels/removed',
  },
};

export default Names;

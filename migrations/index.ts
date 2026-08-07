import * as migration_20260807_060807_initial from './20260807_060807_initial';

export const migrations = [
  {
    up: migration_20260807_060807_initial.up,
    down: migration_20260807_060807_initial.down,
    name: '20260807_060807_initial'
  },
];

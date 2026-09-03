import * as migration_20260903_191830_initial from './20260903_191830_initial';

export const migrations = [
  {
    up: migration_20260903_191830_initial.up,
    down: migration_20260903_191830_initial.down,
    name: '20260903_191830_initial'
  },
];

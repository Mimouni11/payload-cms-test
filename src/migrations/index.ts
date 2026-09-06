import * as migration_20260905_194904_initial from './20260905_194904_initial';
import * as migration_20260906_173444_promote_services_to_collection from './20260906_173444_promote_services_to_collection';

export const migrations = [
  {
    up: migration_20260905_194904_initial.up,
    down: migration_20260905_194904_initial.down,
    name: '20260905_194904_initial',
  },
  {
    up: migration_20260906_173444_promote_services_to_collection.up,
    down: migration_20260906_173444_promote_services_to_collection.down,
    name: '20260906_173444_promote_services_to_collection'
  },
];

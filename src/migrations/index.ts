import * as migration_20260905_194904_initial from './20260905_194904_initial';
import * as migration_20260906_173444_promote_services_to_collection from './20260906_173444_promote_services_to_collection';
import * as migration_20260906_175641_add_projects from './20260906_175641_add_projects';
import * as migration_20260907_192425_add_footer_global from './20260907_192425_add_footer_global';
import * as migration_20260908_180522_add_site_info from './20260908_180522_add_site_info';
import * as migration_20260908_184129_add_clients from './20260908_184129_add_clients';

export const migrations = [
  {
    up: migration_20260905_194904_initial.up,
    down: migration_20260905_194904_initial.down,
    name: '20260905_194904_initial',
  },
  {
    up: migration_20260906_173444_promote_services_to_collection.up,
    down: migration_20260906_173444_promote_services_to_collection.down,
    name: '20260906_173444_promote_services_to_collection',
  },
  {
    up: migration_20260906_175641_add_projects.up,
    down: migration_20260906_175641_add_projects.down,
    name: '20260906_175641_add_projects',
  },
  {
    up: migration_20260907_192425_add_footer_global.up,
    down: migration_20260907_192425_add_footer_global.down,
    name: '20260907_192425_add_footer_global',
  },
  {
    up: migration_20260908_180522_add_site_info.up,
    down: migration_20260908_180522_add_site_info.down,
    name: '20260908_180522_add_site_info',
  },
  {
    up: migration_20260908_184129_add_clients.up,
    down: migration_20260908_184129_add_clients.down,
    name: '20260908_184129_add_clients'
  },
];

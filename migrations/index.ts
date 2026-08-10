import * as migration_20260807_060807_initial from './20260807_060807_initial';
import * as migration_20260808_222547_add_team_member_founder from './20260808_222547_add_team_member_founder';
import * as migration_20260810_064457_add_services from './20260810_064457_add_services';
import * as migration_20260810_165710_add_testimonials from './20260810_165710_add_testimonials';

export const migrations = [
  {
    up: migration_20260807_060807_initial.up,
    down: migration_20260807_060807_initial.down,
    name: '20260807_060807_initial',
  },
  {
    up: migration_20260808_222547_add_team_member_founder.up,
    down: migration_20260808_222547_add_team_member_founder.down,
    name: '20260808_222547_add_team_member_founder',
  },
  {
    up: migration_20260810_064457_add_services.up,
    down: migration_20260810_064457_add_services.down,
    name: '20260810_064457_add_services',
  },
  {
    up: migration_20260810_165710_add_testimonials.up,
    down: migration_20260810_165710_add_testimonials.down,
    name: '20260810_165710_add_testimonials'
  },
];

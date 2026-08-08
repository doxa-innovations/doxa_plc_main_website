import * as migration_20260807_060807_initial from './20260807_060807_initial';
import * as migration_20260808_222547_add_team_member_founder from './20260808_222547_add_team_member_founder';

export const migrations = [
  {
    up: migration_20260807_060807_initial.up,
    down: migration_20260807_060807_initial.down,
    name: '20260807_060807_initial',
  },
  {
    up: migration_20260808_222547_add_team_member_founder.up,
    down: migration_20260808_222547_add_team_member_founder.down,
    name: '20260808_222547_add_team_member_founder'
  },
];

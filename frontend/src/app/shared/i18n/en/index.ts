import { APP_EN } from './app';
import { LEGAL_EN } from './legal';
import { AUTH_EN } from './auth';
import { PROJECTS_EN } from './projects';
import { TASKS_EN } from './tasks';
import { SHARED_EN } from './shared';
import { UiDictionary } from '../';

export const EN_DICTIONARY: UiDictionary = {
  ...APP_EN,
  ...LEGAL_EN,
  ...AUTH_EN,
  ...PROJECTS_EN,
  ...TASKS_EN,
  ...SHARED_EN,
};

import { APP_EN } from './app';
import { AUTH_EN } from './auth';
import { PROJECTS_EN } from './projects';
import { TASKS_EN } from './tasks';
import { SHARED_EN } from './shared';

export type UiDictionary = Record<string, string>;

export const EN_DICTIONARY: UiDictionary = {
  ...APP_EN,
  ...AUTH_EN,
  ...PROJECTS_EN,
  ...TASKS_EN,
  ...SHARED_EN,
};

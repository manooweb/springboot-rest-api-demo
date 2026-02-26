import { EN_DICTIONARY } from './en';
import { FR_DICTIONARY } from './fr';

export type UiLang = 'en' | 'fr';
export type UiDictionary = Record<string, string>;

export const UI_DICTIONARIES: Record<UiLang, UiDictionary> = {
  en: EN_DICTIONARY,
  fr: FR_DICTIONARY,
};

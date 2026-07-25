import { inject, Injectable } from '@angular/core';
import { LocaleId } from '../core/models/locale.model';
import { EN_DICTIONARY } from '../i18n/dictionaries/en';
import { RU_DICTIONARY } from '../i18n/dictionaries/ru';
import { I18nKey } from '../i18n/i18n.keys';
import { UiStore } from '../state/ui.store';

const DICTIONARIES: Record<LocaleId, Readonly<Record<I18nKey, string>>> = {
  ru: RU_DICTIONARY,
  en: EN_DICTIONARY,
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly ui = inject(UiStore);

  /** Single source of truth: UiStore.locale */
  readonly locale = this.ui.locale;

  t(key: string, params?: Record<string, string | number>): string {
    const dictionary = DICTIONARIES[this.locale()] as Readonly<Record<string, string>>;
    let template = dictionary[key];
    if (template === undefined) {
      template = key;
    }
    if (!params) {
      return template;
    }
    return template.replace(/\{([^{}]+)\}/g, (match, name: string) => {
      if (Object.prototype.hasOwnProperty.call(params, name)) {
        return String(params[name]);
      }
      return match;
    });
  }

  setLocale(locale: LocaleId): void {
    this.ui.setLocale(locale);
  }

  toggleLocale(): void {
    this.ui.toggleLocale();
  }
}

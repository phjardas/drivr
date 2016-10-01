import { updateIntl } from 'react-intl-redux';
import { addLocaleData } from 'react-intl';

export const locales = {
  de: {
    label: 'Deutsch',
    loadData: next => require.ensure([], require => {
      const data = require('react-intl/locale-data/de');
      const { messages } = require('./de');
      next(null, { data, messages });
    }, 'intl-de'),
  },
  en: {
    label: 'English',
    loadData: next => require.ensure([], require => {
      const data = require('react-intl/locale-data/en');
      const { messages } = require('./en');
      next(null, { data, messages });
    }, 'intl-en'),
  },
};

export function setLocale(locale) {
  return dispatch => {
    locales[locale].loadData((err, { data, messages }) => {
      if (err) throw err;
      addLocaleData(data);
      dispatch(updateIntl({ locale, messages }));
    });
  };
}

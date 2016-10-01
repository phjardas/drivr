import { updateIntl } from 'react-intl-redux';
import { addLocaleData } from 'react-intl';

function loadData(locale, next) {
  switch (locale) {
    case 'en':
      return require.ensure([], require => {
        const data = require('react-intl/locale-data/en');
        const { messages } = require('./en');
        next(null, { data, messages });
      }, 'intl-en');
    case 'de':
      return require.ensure([], require => {
        const data = require('react-intl/locale-data/de');
        const { messages } = require('./de');
        next(null, { data, messages });
      }, 'intl-de');
    default:
      throw new Error('Unsupported locale: ' + locale);
  }
}

export function setLocale(locale) {
  return dispatch => {
    loadData(locale, (err, { data, messages }) => {
      if (err) throw err;
      addLocaleData(data);
      dispatch(updateIntl({ locale, messages }));
    });
  };
}

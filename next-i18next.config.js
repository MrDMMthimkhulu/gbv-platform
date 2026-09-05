const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'af', 'nr', 'xh', 'zu', 'nso', 'st', 'tn', 'ss', 've', 'ts'],
  },
  localePath: path.resolve('./public/locales'),
};

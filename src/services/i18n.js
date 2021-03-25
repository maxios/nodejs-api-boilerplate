import path from 'path';
import i18next from 'i18next';
import middleware from 'i18next-http-middleware';
import Backend from 'i18next-node-fs-backend';

export const startI18next = () =>
  i18next
    .use(middleware.LanguageDetector)
    .use(Backend)
    .init({
      backend: {
        loadPath: path.resolve(__dirname, '../locales/{{lng}}/{{ns}}.json')
      },
      detection: {
        order: ['header', 'querystring', 'cookie'],
        lookupQuerystring: 'lng',
        lookupCookie: 'i18next',
        lookupHeader: 'Accept-Language',
        lookupFromPathIndex: 0,
      },
      debug: false,
      saveMissing: true,
      fallbackLng: ['en']
    }).then(() => {
      // initialized and ready to go!
      console.log('i18next initialized')
    });

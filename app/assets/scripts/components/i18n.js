i18n = require('i18next-client')

var enGB = require("../../../locales/en-GB.json");

/*

References:
http://blog.arkency.com/2015/03/use-your-gettext-translations-in-your-react-components/
http://jsfiddle.net/Philmod/eFz9R/
https://alicoding.com/localizing-react-app-using-react-router-with-react-intl/

*/

var resources = {
  "en-GB": {
    translation: enGB
  }
}

i18n.init({
  lng: "en-GB",
  lngWhiteList: ['en-GB', 'es-MX'],
  fallbackLng: 'en-GB',
  resStore: resources
})

module.exports = i18n
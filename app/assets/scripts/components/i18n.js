i18n = require('i18next-client')

var enGB = require("../../../locales/en-GB.json");
var esMX = require("../../../locales/es-MX.json");

/*

References:
http://blog.arkency.com/2015/03/use-your-gettext-translations-in-your-react-components/
http://jsfiddle.net/Philmod/eFz9R/
https://alicoding.com/localizing-react-app-using-react-router-with-react-intl/

*/

var resources = {
  "en-GB": {
    translation: enGB
  },
  "es-MX": {
    translation: esMX
  }
}

i18n.init({
  lng: "es-MX",
  lngWhiteList: ['es-MX'],
  fallbackLng: 'es-MX',
  resStore: resources
})

module.exports = i18n
// tasscrape-lib <https://github.com/msikma/tasscrape>
// © MIT license

const {getLatestPublished} = require('./scrape/latest')
const {getPublicationDetails, getPublicationDetailsFromID, getPublicationSource} = require('./scrape/publication')

module.exports = {
  getLatestPublished,
  getPublicationDetails,
  getPublicationDetailsFromID,
  getPublicationSource
}

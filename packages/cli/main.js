// tasscrape <https://github.com/msikma/tasscrape>
// © MIT license

const {getLatestPublished, getPublicationDetailsFromID} = require('tasscrape-lib')
const {formatAsJSON, tryCatch} = require('./util')

/**
 * Runs the main command line script.
 */
const main = async (args, {pkgData, baseDir}) => {
  if (args.actionGetLatestPublished) {
    const res = await tryCatch(getLatestPublished)
    console.log(formatAsJSON(res))
    process.exit(!!res.error)
  }
  else if (args.actionGetDetails) {
    const res = await tryCatch(getPublicationDetailsFromID, [args.actionGetDetails])
    console.log(formatAsJSON(res))
    process.exit(!!res.error)
  }
  else {
    console.error('tasscrape.js: error: No action chosen.')
    process.exit(1)
  }
}

module.exports = {
  main
}

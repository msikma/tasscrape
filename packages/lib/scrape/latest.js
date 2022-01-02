// tasscrape-lib <https://github.com/msikma/tasscrape>
// © MIT license

const Parser = require('rss-parser')
const {publicationsFeed, getItemID} = require('../urls')

/** RSS parser objectwith standard settings. */
const rssParser = new Parser()

/**
 * Returns the latest published movies.
 */
const getLatestPublished = async () => {
  const feed = await rssParser.parseURL(publicationsFeed())
  const {title, pubDate, feedUrl, link, items} = feed
  return {
    title,
    url: link,
    pubDate,
    feedUrl,
    items: items.map(item => ({...item, _tasvideosID: getItemID(item.link)}))
  }
}

module.exports = {
  getLatestPublished
}

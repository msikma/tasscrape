// tasscrape-lib <https://github.com/msikma/tasscrape>
// © MIT license

/** Base URL for the TASVideos website. */
const BASE_URL = 'https://tasvideos.org'

/**
 * Flips the prefix of a publication or submission ID.
 * 
 * For example, this turns '1917M' into 'M1917'. Used for the wiki.
 */
const flipPrefix = id => {
  return id.replace(/^([0-9]+)([a-z])$/i, '$2$1')
}

/**
 * Retrieves an ID from an item URL.
 * 
 * For example, 'https://tasvideos.org/1917M' will yield '1917M'.
 */
const getItemID = url => {
  const matches = url.match(new RegExp(`${BASE_URL}/(([0-9])+[a-z]{1})(/|$)`, 'i'))
  if (!matches) return null
  return matches[1].trim()
}

/** Creates a TASVideos URL. */
const makeURL = (url, params = {}, useBaseURL = true, baseURL = BASE_URL) => {
  const obj = new URL(`${useBaseURL ? baseURL : ''}${url}`)
  for (const [k, v] of Object.entries(params)) {
    obj.searchParams.set(k, v)
  }
  return obj.toString()
}

/** Creates a TASVideos URL, but omits adding the base URL if it is a fully qualified URL. */
const ensureQualifiedURL = (url, params = {}, baseURL = BASE_URL) => {
  return makeURL(url, params, !url.startsWith('http'), baseURL)
}

/** URL to the latest publications RSS feed. */
const publicationsFeed = () => makeURL('/Publications.rss')

/** URL pointing to the media image for a publication or submission. */
const mediaImage = (id, ext = 'png') => makeURL(`/media/${id}.${ext}`)

/** URL containing the details for a specific publication or submission. */
const itemPage = id => makeURL(`/${id}`)

/** URL pointing to the wiki content of a publication or submission. */
const wikiPublicationContent = id => makeURL(`/Wiki/ViewSource`, {path: `InternalSystem/PublicationContent/${flipPrefix(id)}`})

module.exports = {
  ensureQualifiedURL,
  getItemID,
  itemPage,
  makeURL,
  mediaImage,
  publicationsFeed,
  wikiPublicationContent,
  BASE_URL
}

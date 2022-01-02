// tasscrape-lib <https://github.com/msikma/tasscrape>
// © MIT license

const fetch = require('node-fetch')

// Headers sent by default, similar to what a regular browser would send.
const stdHeaders = {
  'Accept-Language': 'en-US,en;q=0.5',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Cache-Control': 'max-age=0',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'same-origin',
  'Sec-GPC': '1',
  'DNT': '1',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:95.0) Gecko/20100101 Firefox/95.0'
}

/**
 * Retrieves a URL and returns the result.
 */
const requestURL = async (url, {post = false, headers = stdHeaders} = {}) => {
  const postData = post ? {method: 'POST', body: post} : {}
  return fetch(url, {headers, ...postData})
}

/**
 * Downloads a file and returns as buffer.
 */
const requestFileAsBuffer = async (url, {headers = stdHeaders} = {}) => {
  const res = await fetch(url, {headers})
  if (!res.ok) return false
  const buffer = await res.buffer()
  return buffer
}

module.exports = {
  requestURL,
  requestFileAsBuffer
}

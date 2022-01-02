// tasscrape-lib <https://github.com/msikma/tasscrape>
// © MIT license

const {NodeHtmlMarkdown} = require('node-html-markdown')
const {ensureQualifiedURL} = require('../urls')

/**
 * Converts an HTML string into Markdown.
 */
const htmlToMarkdown = html => {
  const converted = NodeHtmlMarkdown.translate(html)
  return converted.replace(/\n---\n/g, '\n━━━━\n')
}

/**
 * Ensures all link hrefs in a Markdown section are absolute URLs.
 */
const ensureQualifiedMarkdownURLs = ($, $description) => {
  $('a', $description).each((_, item) => {
    const $item = $(item)
    $item.attr('href', ensureQualifiedURL($item.attr('href')))
  })
  return $description
}

module.exports = {
  htmlToMarkdown,
  ensureQualifiedMarkdownURLs
}

// tasscrape-lib <https://github.com/msikma/tasscrape>
// © MIT license

const cheerio = require('cheerio')
const {mediaImage, wikiPublicationContent, ensureQualifiedURL, itemPage} = require('../urls')
const {isWhitespace} = require('../util')
const {requestURL} = require('../fetch')
const {htmlToMarkdown, ensureQualifiedMarkdownURLs} = require('./util')

/** Map of publication tags. */
const publicationFlagMap = {
  isNotableImprovement: 'NotableImprovements',
  isFastestCompletion: 'FastestCompletion',
  isConsoleVerified: 'ConsoleVerifiedMovies',
  isRecommendedForNewcomers: 'NewcomerCorner',
  hasCommentary: 'Commentaries'
}

/** Map of publication classes. */
const publicationClassMap = {
  isMoon: 'images/moon.png',
  isStar: 'images/star.png'
}

/**
 * Converts a "Published on" line to a Date object.
 */
const parsePublishedLine = line => {
  if (!line) return null
  const matches = line.match(/Published on(.+?)$/)
  if (!matches) return null
  const items = matches[1].trim().split('/').map(n => parseInt(n))
  const date = new Date('1970-01-01')
  date.setUTCFullYear(items[2])
  date.setUTCDate(items[1])
  date.setUTCMonth(items[0] - 1)
  return date.toISOString().slice(0, 10)
}

/**
 * Retrieves the player name and completion time from the title.
 */
const parsePlayerAndTime = title => {
  const matches = title.match(/by(.+?)in(.+?)( |$)/)
  if (!matches) return [null, null]
  return [matches[1].trim(), matches[2].trim()]
}


/**
 * Retrieves item details from a Cheerio object of an item HTML page.
 */
const scrapePublicationDetails = ($, url) => {
  const $card = $('.container .card')
  const $header = $('.card-header h4 > a', $card)
  const id = $header.attr('href').replace(/^\/(.+?)/, '$1')
  const title = $header.text().trim()
  const [player, time] = parsePlayerAndTime(title)
  const image = mediaImage(id)
  const startTagList = $('.card-header .float-start img', $card).get().map(img => $(img).attr('srcset')).filter(n => n)
  const startTagBools = toTagMap(startTagList, publicationClassMap)
  const endTagList = $('.card-header .float-end a', $card).get().map(a => $(a).attr('href').trim()).filter(n => n)
  const endTagBools = toTagMap(endTagList, publicationFlagMap)
  const awards = $('.card-body a[href^="/Awards"]', $card).get().map(a => $(a).attr('title').trim()).filter(n => n)

  const $leftCol = $('.bg-cardsecondary > .col-auto', $card)
  const $rightCol = $('.bg-cardsecondary > .col-md', $card)

  const $description = $('article.wiki', $rightCol)
  const descriptionHTML = ensureQualifiedMarkdownURLs($, $description).html()
  const descriptionMarkdown = htmlToMarkdown(descriptionHTML)

  const publishedLine = $('small', $rightCol).get().map(small => $(small).text().trim()).find(small => small.toLowerCase().startsWith('published on'))
  const published = parsePublishedLine(publishedLine)

  const $dataSection = $('.card-body .row:last-child', $card)
  const keyValueSections = Object.fromEntries($('.col-auto > small', $dataSection).get().flatMap(getKeyValueSections($)))
  const emulator = keyValueSections.emulator_version?.[0]

  const buttons = $('.btn', $leftCol).get().map(a => {
    const $a = $(a)
    return {
      href: $a.attr('href').trim(),
      text: $a.text()
    }
  })
  const youtubeLink = buttons.find($btn => $btn.text.toLowerCase().includes('watch') && ($btn.href.toLowerCase().includes('youtube.com') || $btn.href.toLowerCase().includes('youtu.be')))
  const authorNotesLink = buttons.find($btn => $btn.text.toLowerCase().includes('author notes'))
  const forumLink = buttons.find($btn => $btn.text.toLowerCase().includes('discuss'))

  const torrent = keyValueSections.av_files.find(item => item.href.includes('.torrent') && !item.title.toLowerCase().includes('compatibility'))

  return {
    id,
    title,
    url,
    submission: ensureQualifiedURL(authorNotesLink.href),
    description: descriptionMarkdown,
    descriptionHTML: descriptionHTML,
    published,
    player,
    time,
    image,
    awards,
    genres: keyValueSections.genres,
    tags: keyValueSections.tags,
    game: keyValueSections.game[0],
    emulator: emulator ? emulator.replace(/_/g, ' ') : null,
    torrent,
    links: {
      youtube: ensureQualifiedURL(youtubeLink.href),
      forum: ensureQualifiedURL(forumLink.href)
    },
    classes: startTagBools,
    flags: endTagBools
  }
}

/**
 * Converts a list of tags to a tag map.
 */
const toTagMap = (tagList, tagMap) => {
  const map = Object.entries(tagMap).map(([target, tag]) => [target, !!tagList.find(t => t.includes(tag))])
  return Object.fromEntries(map)
}

/**
 * Returns information extracted from a series of key/value sections.
 */
const getKeyValueSections = $ => kv => {
  const items = {}
  const item = {}
  const $kv = $(kv)
  const nodes = $kv.contents()
  for (const node of nodes) {
    const isTextNode = node.type === 'text'
    const title = isTextNode ? node.data.trim() : null

    if (isTextNode) {
      if (isWhitespace(title)) {
        continue
      }
      item.title = title.replace(/[^a-z ]/ig, '').trim().toLowerCase().replace(/ /g, '_')
    }

    if (!isTextNode) {
      if (!item.title) {
        for (const [key, value] of getKeyValueSections($)(node)) {
          items[key] = value
        }
        continue
      }
      else if (item.title !== 'emulator_version') {
        items[item.title] = $('a', $kv).get().map(a => {
          const $a = $(a)
          return {
            href: ensureQualifiedURL($a.attr('href').trim()),
            title: $a.text().trim()
          }
        })
      }
      else if (item.title === 'emulator_version') {
        items[item.title] = [$($('span', $kv).get()[0]).text().trim()]
      }
    }
  }
  return Object.entries(items)
}

/**
 * Retrieves the source text of a wiki page.
 */
const scrapeSourceText = $ => {
  const $container = $('.container:nth-child(3)')
  $('> div:nth-child(1), > div:nth-child(2), > hr, > footer', $container).remove()
  return $.text($container).trim()
}

/**
 * Returns the wiki source code for a single item.
 */
const getPublicationSource = async item => {
  const res = await requestURL(wikiPublicationContent(item._tasvideosID))
  const $ = cheerio.load(await res.text())
  return scrapeSourceText(source$)
}

/**
 * Returns additional information about a single item.
 * 
 * An item has the following structure:
 * 
 *   {
 *     _tasvideosID: '4565M',
 *     title: 'SNES Prince of Persia 2: The Shadow and the Flame by Challenger in 07:59.84',
 *     link: 'https://tasvideos.org/4565M',
 *     content: '<div><article class="wiki"><div class="p">The SNES port Prince of Persia 2 is generally regarded [..]',
 *     categories: [
 *       'Uses death to save time',
 *       'Takes damage to save time',
 *       'Heavy glitch abuse'
 *     ]
 *   }
 * 
 * After retrieving details, the following data will be added:
 */
const getPublicationDetailsFromID = async id => {
  const url = itemPage(id)
  const res = await requestURL(url)
  const $ = cheerio.load(await res.text())
  if (id.endsWith('M')) {
    return scrapePublicationDetails($, url)
  }
  else if (id.endsWith('S')) {
    throw new Error('Submission pages are not implemented yet.')
  }
  else if (id.endsWith('G')) {
    throw new Error('Game pages are not implemented yet.')
  }
  else {
    throw new Error(`Unknown ID type ("${id}"). IDs must be a number followed by one of {G,M,S}, e.g. "1234M".`)
  }
}

/**
 * Returns additional information about a single item.
 * 
 * An item has the following structure:
 * 
 *   {
 *     _tasvideosID: '4565M',
 *     title: 'SNES Prince of Persia 2: The Shadow and the Flame by Challenger in 07:59.84',
 *     link: 'https://tasvideos.org/4565M',
 *     content: '<div><article class="wiki"><div class="p">The SNES port Prince of Persia 2 is generally regarded [..]',
 *     categories: [
 *       'Uses death to save time',
 *       'Takes damage to save time',
 *       'Heavy glitch abuse'
 *     ]
 *   }
 * 
 * After retrieving details, the following data will be added:
 */
const getPublicationDetails = async item => {
  const details = await getPublicationDetailsFromID(item._tasvideosID)
  return {
    ...item,
    details
  }
}

module.exports = {
  getPublicationSource,
  getPublicationDetails,
  getPublicationDetailsFromID
}

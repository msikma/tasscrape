#!/usr/bin/env node

// tasscrape <https://github.com/msikma/tasscrape>
// © MIT license

const path = require('path')
const {ArgumentParser} = require('argparse')
const {readJSON} = require('./util')

const pkgPath = path.resolve(`${__dirname}/../../`)
const pkgData = readJSON(`${pkgPath}/package.json`)

const parser = new ArgumentParser({
  description: `Command-line utility for scraping basic information from the TASVideos website.`,
  add_help: true
})
parser.add_argument('-v', '--version', {action: 'version', version: pkgData.version})
parser.add_argument('--get-published', {help: 'Retrieves the latest published movies.', dest: 'actionGetLatestPublished', action: 'store_true'})
parser.add_argument('--get-details', {help: 'Retrieves extended details for an item.', dest: 'actionGetDetails', metavar: 'ID'})

require('./main.js').main({...parser.parse_args()}, {pkgData, baseDir: pkgPath})

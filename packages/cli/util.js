// tasscrape <https://github.com/msikma/tasscrape>
// © MIT license

const fs = require('fs')

/**
 * Reads a JSON file synchronously and returns the results as a parsed object.
 */
const readJSON = filepath => {
  const content = fs.readFileSync(filepath, 'utf8')
  return JSON.parse(content)
}

/**
 * Returns a stringified JSON version of an object.
 */
const formatAsJSON = obj => {
  return JSON.stringify(obj, null, 2)
}

/**
 * Returns the result of an async function, or the error in case it throws.
 */
const tryCatch = async (fn, args = []) => {
  try {
    const res = await fn(...args)
    return {res, error: null}
  }
  catch (error) {
    console.error(error)
    return {res: null, error: `${error}`}
  }
}

module.exports = {
  formatAsJSON,
  readJSON,
  tryCatch
}

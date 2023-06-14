import fs from 'fs/promises'
import path from 'path'
import {
    WebsiteEvent,
    WebsiteSpeaker,
    WebsiteSponsor,
    WebsiteTalk
} from './website-types.js'

const IMAGE_BASE = '../public'
const JSON_BASE = '../app/data'

const IMAGE_DIRS = {
  speakers: path.join(IMAGE_BASE, 'images/speakers'),
  sponsors: path.join(IMAGE_BASE, 'images/sponsors')
}

const JSON_FILES = {
  events: path.join(JSON_BASE, 'events.json'),
  speakers: path.join(JSON_BASE, 'speakers.json'),
  talks: path.join(JSON_BASE, 'talks.json'),
  sponsors: path.join(JSON_BASE, 'sponsors.json')
}

const parseJSONFile = async (filePath: string): Promise<any> => {
  const textBuffer = await fs.readFile(filePath)
  return JSON.parse(String(textBuffer))
}

export const getWebsiteEvents = async (): Promise<WebsiteEvent[]> => {
  return parseJSONFile(JSON_FILES['events'])
}

export const getWebsiteSpeakers = async (): Promise<WebsiteSpeaker[]> => {
  return parseJSONFile(JSON_FILES['speakers'])
}
export const getWebsiteTalks = async (): Promise<WebsiteTalk[]> => {
    return parseJSONFile(JSON_FILES['talks'])
}
export const getWebsiteSponsors = async (): Promise<WebsiteSponsor[]> => {
    return parseJSONFile(JSON_FILES['sponsors'])
}

const sleep = async ms => new Promise(resolve => setTimeout(resolve, ms))
/** check if if file exists. Stolen from
* https://futurestud.io/tutorials/node-js-check-if-a-file-exists
*/
const exists = async (path: string) => {  
    try {
        await fs.access(path)
        return true
    } catch {
        return false
    }
} 

export const exportImages = async (imageObjects, type) => {

  for (let imageObj of imageObjects) {
    // need to prevent getting rate-limited
    await sleep(250)
    if (imageObj.imageUri && imageObj.filename) {
      const imageUri = imageObj.image
      const filePath = path.join(IMAGE_DIRS[type], imageObj.filename)
      const imageExists = await exists(filePath)
      if (!imageExists) {
          console.log('exporting', filePath)
          await downloadFile(imageUri, filePath)
      } else {
          console.log(`${filePath} exists and was not re-exported`)
      }
    }
  }
}

export const exportData = async (jsData, type) => {
  console.log('exporting', JSON_FILES[type])

  const json = JSON.stringify(jsData, null, 4)
  await fs.writeFile(JSON_FILES[type], json)
}

import Fs from 'fs'
import Https from 'https'

/**
 * Download a file from the given `url` into the `targetFile`.
 * Shamelessly stolen from https://futurestud.io/tutorials/node-js-how-to-download-a-file
 *
 * @param {String} url
 * @param {String} targetFile
 *
 * @returns {Promise<void>}
 */
async function downloadFile(url, targetFile) {
  return await new Promise((resolve, reject) => {
    Https.get(url, response => {
      const code = response.statusCode ?? 0

      if (code >= 400) {
        return reject(new Error(response.statusMessage))
      }

      // handle redirects
      if (code > 300 && code < 400 && !!response.headers.location) {
        return resolve(downloadFile(response.headers.location, targetFile))
      }

      // save the file to disk
      const fileWriter = Fs.createWriteStream(targetFile).on('finish', () => {
        resolve({})
      })

      response.pipe(fileWriter)
    }).on('error', error => {
      reject(error)
    })
  })
}

/* repository for website data access */
import path from 'path'
import fs from 'fs/promises'
import { WebsiteEvent } from './website-types.js'
const DATA_PATH = '../app/data/'
const EVENTS_PATH = path.join(DATA_PATH, 'events.json')
const TALKS_PATH = path.join(DATA_PATH, 'talks.json')
const SPEAKERS_PATH = path.join(DATA_PATH, 'speakers.json')
const SPONSORS_PATH = path.join(DATA_PATH, 'sponsors.json')


const parseJSONFile = async (filePath: string): Promise<any> => {
  const textBuffer = await fs.readFile(filePath)
  return JSON.parse(String(textBuffer))
}

export const getWebsiteEvents = async (): Promise<WebsiteEvent[]> => {
  return parseJSONFile(EVENTS_PATH)
}


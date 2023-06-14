import * as dotenv from 'dotenv'
import Airtable from 'airtable'
import {
  getAirtableEvents,
  getAirtableSpeakers,
  getAirtableSponsors
} from './src/repos/airtable.js'
import { 
  getWebsiteEvents, 
  getWebsiteSpeakers,
  getWebsiteSponsors,
  getWebsiteTalks
} from './src/repos/website.js'
import { getTargetEvent } from './src/repos/user-input.js'
import { 
    mapAirtableEventsToWebsiteEvents,
    makeWebsiteEvent,
    reconcileEvents
} from './src/events.js'
import { reconcileSpeakers } from './src/speakers.js'
import { reconcileSponsors } from './src/sponsors.js'
import { exportImages, exportData } from './src/repos/website.js'

dotenv.config()

Airtable.configure({
  apiKey: process.env.AIRTABLE_TOKEN,
  endpointUrl: 'https://api.airtable.com'
})
const airtableBase = Airtable.base(process.env.BASE_ID)

;(async () => {
  // get all the airtable data we'll need
  const airtableEvents = await getAirtableEvents(airtableBase)
  const airtableSpeakers = await getAirtableSpeakers(airtableBase)
  const airtableSponsors = await getAirtableSponsors(airtableBase)
  // get the events that are in the website json data
  const websiteEvents = await getWebsiteEvents()
  const websiteSpeakers = await getWebsiteSpeakers()
  const websiteTalks = await getWebsiteTalks()
  const websiteSponsors = await getWebsiteSponsors()

  // associate all the airtable events with the website events
  const eventMap = mapAirtableEventsToWebsiteEvents(airtableEvents, websiteEvents)
  // prompt user for which event they want to make/modify
  let targetEvent = await getTargetEvent(eventMap)
  // check if event exists already
  if (!targetEvent.website) {
      targetEvent.website = makeWebsiteEvent(targetEvent.airtable)
  }

  const { 
      newPhotos,
  } = reconcileSpeakers(targetEvent, airtableSpeakers, websiteSpeakers, websiteTalks)
  
  // check sponsors
  const {
      newLogos
  } = reconcileSponsors(targetEvent, airtableSponsors, websiteSponsors)

  reconcileEvents(targetEvent, websiteEvents)
      
  await exportImages(newPhotos, 'speakers')
  await exportData(websiteSpeakers, 'speakers')

  await exportData(websiteTalks, 'talks')
  await exportData(websiteSponsors, 'sponsors')
  await exportImages(newLogos, 'sponsors')
  await exportData(websiteEvents, 'events')

})()

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
    reconcileEvents,
    sortEvents
} from './src/events.js'
import { reconcileSpeakers, sortSpeakers } from './src/speakers.js'
import { reconcileSponsors, sortSponsors } from './src/sponsors.js'
import { exportImages, exportData } from './src/repos/website.js'
import { sortTalks } from './src/talks.js'

dotenv.config()

Airtable.configure({
  apiKey: process.env.AIRTABLE_TOKEN,
  endpointUrl: 'https://api.airtable.com'
})
const airtableBase = Airtable.base(process.env.BASE_ID)

;(async () => {
  // load the airtable data we'll need
  const airtableEvents = await getAirtableEvents(airtableBase)
  const airtableSpeakers = await getAirtableSpeakers(airtableBase)
  const airtableSponsors = await getAirtableSponsors(airtableBase)
  // load all the data that is in the website json
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
      
  await exportData(sortSpeakers(websiteSpeakers), 'speakers')
  await exportImages(newPhotos, 'speakers')
  await exportData(sortTalks(websiteTalks), 'talks')

  await exportData(sortSponsors(websiteSponsors), 'sponsors')
  await exportImages(newLogos, 'sponsors')

  await exportData(sortEvents(websiteEvents), 'events')

})()

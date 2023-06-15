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
import { confirmUpdate, getTargetEvent } from './src/repos/user-input.js'
import {
  mapAirtableEventsToWebsiteEvents,
  makeWebsiteEvent,
  reconcileEvents
} from './src/events.js'
import { reconcileSpeakers } from './src/speakers.js'
import { reconcileSponsors } from './src/sponsors.js'
import { reconcileTalks } from './src/talks.js'
import { exportImages, exportData } from './src/repos/website.js'

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
  // this is kind of bad because it will miss events that are in
  // the website but not in airtable. It's not all that bad because
  // the eventmap isn't used for writing the actual json output, it's
  // only used to prompt the user for which event they want to modify
  const eventMap = mapAirtableEventsToWebsiteEvents(
    airtableEvents,
    websiteEvents
  )

  let targetEvent = await getTargetEvent(eventMap)
  if (!targetEvent.website) {
    targetEvent.website = makeWebsiteEvent(targetEvent.airtable)
  }

  const { newPhotos, updatedSpeakers } = reconcileSpeakers(
    targetEvent,
    airtableSpeakers,
    websiteSpeakers
  )

  const updatedTalks = reconcileTalks(
    targetEvent,
    airtableSpeakers,
    websiteTalks
  )

  const { newLogos, updatedSponsors } = reconcileSponsors(
    targetEvent,
    airtableSponsors,
    websiteSponsors
  )

  reconcileEvents(targetEvent, websiteEvents)

  const confirmation = await confirmUpdate(
    updatedSpeakers,
    updatedTalks,
    updatedSponsors
  )
  if (confirmation) {
    await exportData(websiteSpeakers, 'speakers')
    await exportImages(newPhotos, 'speakers')
    await exportData(websiteTalks, 'talks')

    await exportData(websiteSponsors, 'sponsors')
    await exportImages(newLogos, 'sponsors')

    await exportData(websiteEvents, 'events')
    console.log('finished update, have a nice day :)')
  } else {
    console.log('aborting update, have a nice day :)')
  }
})()

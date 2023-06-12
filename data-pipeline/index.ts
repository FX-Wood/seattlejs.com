import * as dotenv from 'dotenv'
import Airtable from 'airtable'
import {
  getAirtableEvents,
  getAirtableSpeakers,
  getAirtableSponsors
} from './src/airtable.js'
import { eventExists, mapAirtableEventsToWebsiteEvents } from './src/events.js'
import mapSpeakers from './src/speakers.js'
import mapTalks from './src/talks.js'
import mapSponsors from './src/sponsors.js'
import { exportImages, exportData } from './src/exporters.js'
import { getTargetEvent } from './src/cli.js'
import { getWebsiteEvents } from './src/website-data.js'

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

  // associate all the airtable events with the website events
  const eventMap = mapAirtableEventsToWebsiteEvents(airtableEvents, websiteEvents)
  console.log('heyyyyy')
  // prompt user for which event they want to make/modify
  const targetEvent = await getTargetEvent(eventMap)
  console.log('target event')
  console.log(targetEvent)
  // check if event exists already
  if (targetEvent.website) {
    // check talks
    
    // check speakers

    console.log('yahoo')
  } else {
    console.log('wahoo')
  }
  
  // // check if speakers exist already
  // // handle speaker objects
  // const { speakersData, speakersImages } = mapSpeakers(airtableSpeakers)
  // await exportImages(speakersImages, 'speakers')
  // await exportData(speakersData, 'speakers')

  // // add relations to events from talks and sponsors
  // const events = mapEvents(airtableEvents)
  // const { talksData, eventsTalksMap } = mapTalks(airtableSpeakers, events)
  // await exportData(talksData, 'talks')
  // for (let event in eventsTalksMap) {
  //   events[event].talks = eventsTalksMap[event] || []
  // }
  // const { sponsorsData, sponsorsLogos, eventsSponsorsMap } =
  //   mapSponsors(airtableSponsors)
  // await exportData(sponsorsData, 'sponsors')
  // await exportImages(sponsorsLogos, 'sponsors')

  // for (let event in eventsSponsorsMap) {
  //   events[event].sponsors = eventsSponsorsMap[event] || []
  // }
  // await exportData(Object.values(events), 'events')
})()

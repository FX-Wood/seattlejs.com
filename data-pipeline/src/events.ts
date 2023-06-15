import { makeEventId } from './normalizers.js'
import { Record, FieldSet } from 'airtable'
import {
  WebsiteEvent,
  WebsiteAirtableMap,
  WebsiteAirtablePair
} from './repos/website-types.js'

/** mutates the events json data to include any event updates */
export const reconcileEvents = (
  event: WebsiteAirtablePair,
  websiteEvents: WebsiteEvent[]
): void => {
  const existingEventIndex = websiteEvents.findIndex(
    webEvent => webEvent.id == event.website.id
  )
  if (existingEventIndex > 0) {
    // the event exists, need to replace it with the updated one,
    // which is a clone with some (potentially) updated fields
    websiteEvents[existingEventIndex] = event.website
  } else {
    websiteEvents.push(event.website)
  }
}

export const makeWebsiteEvent = (
  airtableEvent: Record<FieldSet>
): WebsiteEvent => {
  const name = (airtableEvent.get('Name') as string) || ''
  const date = (airtableEvent.get('Date') as string) || ''
  const description = (airtableEvent.get('Description') as string) || ''
  const id = makeEventId(name)
  const event: WebsiteEvent = {
    id: id,
    title: name,
    date: date,
    sponsors: [],
    talks: [],
    description: description
  }
  return event
}

/** returns an object where the key is the event id (like "june-2023")
 * and the value is an object with the corresponding airtable and website events */
export const mapAirtableEventsToWebsiteEvents = (
  airtableEvents: Record<FieldSet>[],
  websiteEvents: WebsiteEvent[]
): WebsiteAirtableMap => {
  const result: WebsiteAirtableMap = {}
  for (let event of airtableEvents) {
    const name = event.get('Name')
    const id = makeEventId(name)
    const match = websiteEvents.find(e => e.id == id)
    result[id] = {
      website: match,
      airtable: event
    }
  }
  return result
}

export const sortEvents = events => {
  const sorted = events.sort((a, b) => {
    //TODO: don't make date objects in a sort function
    //because it's really slow
    return new Date(a.date) > new Date(b.date) ? 1 : -1
  })
  return sorted
}

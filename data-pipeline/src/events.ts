import { makeEventId } from './normalizers.js'
import { Record, FieldSet } from 'airtable'
import fs from 'fs/promises'

const eventsShape = {
  id: '',
  title: '',
  date: '',
  sponsors: [],
  talks: [],
  description: ''
}

const eventInFuture = eventDate => {
  return new Date(eventDate) > new Date()
}

export const sortEvents = (events) => {
    const sorted = events.sort((a, b) => {
        // don't make date objects in a sort function
        return new Date(a.date) > new Date(b.date) ? -1 : 1
    })
    return sorted
}

/** Tests if an airtable event exists in the website json */
export const eventExists = async (airtableEvent: Record<FieldSet>): Promise<boolean> => {
    let exists = false
    const targetEventDate = new Date(String(airtableEvent.get('Date')))
    const targetEventMonth = targetEventDate.toLocaleString('en-US', {month:'long'})
    const existingEventsJSON: Buffer = await fs.readFile('../../app/data/events.json')
    const existingEvents = JSON.parse(existingEventsJSON.toString())
    for (let event of existingEvents) {
        if (targetEventMonth.toLowerCase() in event.id.toLowerCase()) {
            exists = true
        }
    }
    return exists
}


export default airtableEvents => {
  const eventsData = {}
  for (let event of airtableEvents) {
    const data = { ...eventsShape }
    const name = event.get('Name')
    const date = event.get('Date')
    const description = event.get('Description') || ''
    const id = makeEventId(name)
    data.id = id
    data.title = name
    data.date = date
    data.description = description
    eventsData[event.id] = data
    // the website doesn't support having events later than the current one
    // stop going through the (sorted) events when we get to the next one
    if (eventInFuture(date)) {
      break
    }
  }
  return eventsData
}


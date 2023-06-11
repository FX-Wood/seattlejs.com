import { makeEventId } from './normalizers.js'
import { Record, FieldSet } from 'airtable'
import { WebsiteEvent } from './website-types.js'

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
export const eventExists = (airtableEvent: Record<FieldSet>, existingEvents: WebsiteEvent[]): boolean => {
    let exists = false
    const targetEventDate = new Date(String(airtableEvent.get('Date')))
    const targetEventMonth = targetEventDate.toLocaleString('en-US', {month:'long'}).toLowerCase()
    for (let event of existingEvents) {
      if (event.id.toLowerCase().includes(targetEventMonth)) {
          exists = true
      }
    }
    return exists
}

export default airtableEvents => {
  const eventsData = {}
  for (let event of airtableEvents) {
    const name = event.get('Name')
    const date = event.get('Date')
    const description = event.get('Description') || ''
    const id = makeEventId(name)
    const data: WebsiteEvent = {
      id: id,
      title: name,
      date: date,
      description: description
    }
    eventsData[event.id] = data
    
    // the website doesn't support having events later than the current one
    // stop going through the (sorted) events when we get to the next one
    if (eventInFuture(date)) {
      break
    }
  }
  return eventsData
}


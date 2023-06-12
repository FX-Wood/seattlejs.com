import { makeEventId } from './normalizers.js'
import { Record, FieldSet } from 'airtable'
import { WebsiteEvent, WebsiteAirtableMap } from './repos/website-types.js'

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

/** returns an object where the key is the event id (like "june-2023") 
* and the value is an object with the corresponding airtable and website events */
export const mapAirtableEventsToWebsiteEvents = (airtableEvents: Record<FieldSet>[],
                                                websiteEvents: WebsiteEvent[],
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

                                             
export default airtableEvents => {
  const eventsData = {}
  for (let event of airtableEvents) {
    const name = event.get('Name')
    const date = event.get('Date')
    const description = event.get('Description') || ''
    const id = makeEventId(name)
    const data= {
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


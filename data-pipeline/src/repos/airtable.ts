import fs from 'fs/promises'

export const getAirtableEvents = async airtableBase => {
  const eventsId = process.env.EVENTS_TABLE_ID
  const events = []
  await airtableBase(eventsId)
    // grid view omits RSVPs, which is a very verbose field
    .select({ view: 'Grid view', sort: [{ field: 'Date', direction: 'asc' }] })
    .eachPage(function page(records, fetchNextPage) {
      records.forEach(r => {
        events.push(r)
      })
      fetchNextPage()
    })
  return events
}

export const getAirtableSpeakers = async airtableBase => {
  const speakersId = process.env.SPEAKERS_TABLE_ID
  const speakers = []
  await airtableBase(speakersId)
    .select()
    .eachPage(function page(records, fetchNextPage) {
      records.forEach(r => {
        speakers.push(r)
      })
      fetchNextPage()
    })
  return speakers
}

export const getAirtableSponsors = async airtableBase => {
  const sponsorsId = process.env.SPONSORS_TABLE_ID
  const sponsors = []
  await airtableBase(sponsorsId)
    .select()
    .eachPage(function page(records, fetchNextPage) {
      records.forEach(r => {
        sponsors.push(r)
      })
      fetchNextPage()
    })
  return sponsors
}

export const captureAirtableObject = async (airtableObject, exportPath) => {
  // stolen from https://oprearocks.medium.com/serializing-object-methods-using-es6-template-strings-and-eval-c77c894651f0
  let replacer = (key, value) => {
    // if we get a function give us the code for that function
    if (typeof value === 'function') {
      return value.toString()
    }
    return value
  }

  const jsonData = JSON.stringify(airtableObject, replacer, 2)
  await fs.writeFile(exportPath, jsonData)
}

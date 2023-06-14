import { Record, FieldSet } from 'airtable'
import {
  makeSpeakerId,
  makeTalkId,
  makeEventId,
  normalizeTalkType
} from './normalizers.js'
import { WebsiteTalk, WebsiteTalkType } from './repos/website-types.js'

export const makeWebsiteTalk = (airtableSpeaker: Record<FieldSet>,
                             airtableEvent: Record<FieldSet>):WebsiteTalk => {
  const talk = {} as WebsiteTalk
  const speakerId = makeSpeakerId(airtableSpeaker.get('Full Name') as string)
  const eventId = makeEventId(airtableEvent.get('Name') as string)
  const id = makeTalkId(speakerId, eventId)
  let talkType = normalizeTalkType(airtableSpeaker.get('Talk Type') as string || '')
  talk.id = id
  talk.speaker_id = speakerId
  talk.event_id = eventId
  talk.title = airtableSpeaker.get('Talk Title') as string || ''
  talk.abstract = airtableSpeaker.get('Talk Blurb') as string || ''
  talk.topics = airtableSpeaker.get('Topics') as string[]
  talk.type = talkType
  return talk
}

export const sortTalks = (talks) => {
    return talks.sort((a,b) => {

        if (a.event_id !== b.event_id) {
            return new Date(a.event_id) > new Date(b.event_id) ? 1 : -1
        }
        if (a.type !== b.type) {
            return a.type === 'regular' ? 1 : -1
        }
        // preserve the order we put the talks in if 
        // they are from the same event and are the same
        // type
        return 0
    })
}


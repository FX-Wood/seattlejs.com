import { Record, FieldSet } from 'airtable'
import {
  normalizeTwitterHandle,
  makeSpeakerId,
  getFileExtension
} from './normalizers.js'
import {
    AirtablePhoto,
    WebsiteAirtablePair,
    WebsiteSpeaker,
    WebsiteTalk
} from './repos/website-types.js'
import { makeWebsiteTalk } from './talks.js'

/** mutate event, speaker, and talk objects and get new photos.
* @return event, speaker, and talk objects with relevant mutations, any new speaker photos
*/
export const reconcileSpeakers = (event: WebsiteAirtablePair,
                                  airtableSpeakers: Record<FieldSet>[],
                                  websiteSpeakers: WebsiteSpeaker[],
                                  websiteTalks: WebsiteTalk[]
                                 ): { event: WebsiteAirtablePair,
                                      websiteSpeakers: WebsiteSpeaker[],
                                      websiteTalks: WebsiteTalk[],
                                      newPhotos: AirtablePhoto[]
                                 } => {
  const newSpeakers = []
  const newPhotos = []
  const newTalks = []
  // get the airtable speakers for the target event by their ID
  const airtableEventSpeakers = []
  for (let speakerId of event.airtable.get('Speakers') as string[]) {
    // cartesian product runtime (O(a * b)), naughty naughty
    airtableEventSpeakers.push(airtableSpeakers.find(speaker => speakerId == speaker.id))
  }
  for (let speaker of airtableEventSpeakers) {
    // make speaker object and get photo uri
    const { speaker: newSpeaker, speakerPhoto: newPhoto } = makeWebsiteSpeaker(speaker)
    // this is kind of a hack, I'd rather put this in the controlling
    // code, but it will work for now. It's somewhat okay because airtable
    // only has a speaker model, and the talks live on the speaker model there.
    const newTalk = makeWebsiteTalk(speaker, event.airtable)
    newSpeakers.push(newSpeaker)
    // assume that if the speaker json doesn't exist then the photo doesn't exist
    newPhotos.push(newPhoto)
    newTalks.push(newTalk)
    // add the new things to the event object
  }
  for (let [i, newSpeaker] of newSpeakers.entries()) {
      if (websiteSpeakers.find(webSpeaker => webSpeaker.id == newSpeaker.id)) {
          newPhotos.splice(i,1)
      } else {
          websiteSpeakers.push(newSpeaker)
      }
  }
  for (let newTalk of newTalks) {
      // check if talk exists in events json
      if (!event.website.talks.includes(newTalk.id)) {
          // if it doesn't add it
          event.website.talks.push(newTalk.id)
      }
      // check if talk exists in talks json
      if (!websiteTalks.find(webTalk => webTalk.id == newTalk.id)) {
          websiteTalks.push(newTalk)
      }

  }
  return { event, websiteSpeakers, websiteTalks, newPhotos }
}

/** make a website speaker from an airtable speaker */
const makeWebsiteSpeaker = (airtableSpeaker: Record<FieldSet>
                        ): { speaker: WebsiteSpeaker, speakerPhoto: AirtablePhoto } => {
    const speaker = {} as WebsiteSpeaker
    const name = airtableSpeaker.get('Full Name')
    const id = makeSpeakerId(name as string)
    const twitter = normalizeTwitterHandle(airtableSpeaker.get('Twitter'))
    speaker.id = id
    speaker.name = name as string
    speaker.company = airtableSpeaker.get('Company') as string
    speaker.twitter = twitter
    speaker.pronouns = airtableSpeaker.get('Pronouns') as string

    let speakerPhoto = {} as AirtablePhoto;
    const photoObj = airtableSpeaker.get('Photo')
    // some speakers don't have photos
    if (typeof photoObj != 'undefined') {
      speakerPhoto.imageUri = photoObj[0].url
      const fileExtension = getFileExtension(photoObj[0].filename)
      const fileName = `${id}.${fileExtension}`
      speakerPhoto.filename = fileName
      speaker.photo = speakerPhoto.filename
    }
    return { speaker, speakerPhoto }
}

export const sortSpeakers = (speakers) => {
    // heaven forbid there should be the same speaker twice
    return speakers.sort((a, b) => a.name > b.name ? 1 : -1)
}

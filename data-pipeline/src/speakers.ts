import { Record, FieldSet } from 'airtable'
import {
  normalizeTwitterHandle,
  makeSpeakerId,
  getFileExtension
} from './normalizers.js'
import { 
    SpeakerPhoto,
    WebsiteAirtablePair,
    WebsiteSpeaker,
    WebsiteTalk
} from './repos/website-types.js'
import { makeWebsiteTalk } from './talks.js'

/** check existing website data against airtable and return any new
* speakers and/or talks
*/
export const reconcileSpeakers = (event: WebsiteAirtablePair,
                                  airtableSpeakers: Record<FieldSet>[],
                                  websiteSpeakers: WebsiteSpeaker[]
                                 ): { newSpeakers: WebsiteSpeaker[],
                                      newPhotos: SpeakerPhoto[],
                                      newTalks: WebsiteTalk[]
                                 } => {
  const returnObject = {
      newSpeakers: [],
      newPhotos: [],
      newTalks: []
  }
  // get the airtable speakers for the target event by their ID
  const airtableEventSpeakers = []
  for (let speakerId of event.airtable.get('Speakers') as string[]) {
    airtableEventSpeakers.push(airtableSpeakers.find(speaker => speakerId == speaker.id))
  }
  for (let speaker of airtableEventSpeakers) {
    const id = makeSpeakerId(speaker.get('Full Name'))
    const websiteSpeaker = websiteSpeakers.find(webSpeaker => webSpeaker.id == id)
    if (!websiteSpeaker) {
        // make speaker object and get photo uri
        const { speaker: newSpeaker, speakerPhoto: newPhoto } = makeWebsiteSpeaker(speaker)
        // this is kind of a hack, I'd rather put this in the controlling
        // code, but it will work for now. It's somewhat okay because airtable
        // only has a speaker model, and the talks live on the speaker model there.
        const newTalk = makeWebsiteTalk(speaker, event.airtable)
        returnObject.newSpeakers.push(newSpeaker)
        returnObject.newPhotos.push(newPhoto)
        returnObject.newTalks.push(newTalk)
    }
  }
  return returnObject
}

/** make a website speaker from an airtable speaker */
const makeWebsiteSpeaker = (airtableSpeaker: Record<FieldSet>
                        ): { speaker: WebsiteSpeaker, speakerPhoto: SpeakerPhoto } => {
    const speaker = {} as WebsiteSpeaker
    const name = airtableSpeaker.get('Full Name')
    const id = makeSpeakerId(name as string)
    const twitter = normalizeTwitterHandle(airtableSpeaker.get('Twitter'))
    speaker.id = id
    speaker.name = name as string
    speaker.company = airtableSpeaker.get('Company') as string
    speaker.twitter = twitter
    speaker.pronouns = airtableSpeaker.get('Pronouns') as string

    let speakerPhoto = {} as SpeakerPhoto;
    const photoObj = airtableSpeaker.get('Photo')
    // some speakers don't have photos
    if (typeof photoObj != 'undefined') {
      speakerPhoto.imageUri = photoObj[0].url
      const fileExtension = getFileExtension(photoObj[0].filename)
      const fileName = `${id}.${fileExtension}`
      speakerPhoto.filename = fileName
    }
    speaker.photo = speakerPhoto.filename
    return { speaker, speakerPhoto }
}

export const sortSpeakers = (speakers) => {
    // heaven forbid there should be the same speaker twice
    return speakers.sort((a, b) => a.name > b.name ? 1 : -1)
}

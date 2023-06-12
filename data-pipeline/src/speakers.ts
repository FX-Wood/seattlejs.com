import { Record, FieldSet } from 'airtable'
import {
  normalizeTwitterHandle,
  makeSpeakerId,
  getFileExtension
} from './normalizers.js'
import { SpeakerPhoto, WebsiteAirtablePair, WebsiteSpeaker } from './repos/website-types.js'

export const reconcileSpeakers = (event: WebsiteAirtablePair,
                                  airtableSpeakers: Record<FieldSet>[],
                                  websiteSpeakers: WebsiteSpeaker[]
                                 ) => {
  // get the airtable speakers for the event by their ID
  const airtableEventSpeakers = []
  for (let speakerId of event.airtable.get('Speakers') as string[]) {
    airtableEventSpeakers.push(airtableSpeakers.find(speaker => speakerId == speaker.id))
  }
  for (let speaker of airtableEventSpeakers) {
    const id = makeSpeakerId(speaker.get('Full Name'))
    const websiteSpeaker = websiteSpeakers.find(webSpeaker => webSpeaker.id == id)
    if (!websiteSpeaker) {
        // make speaker object
        const { speaker: newSpeaker, speakerPhoto: newPhoto } = makeWebsiteSpeaker(speaker)
        // download photo
        console.log(newPhoto)
    }
  }

  // check if they exist on website
  // if they don't, add them
}

export const sortSpeakers = (speakers) => {
    // heaven forbid there should be the same speaker twice
    return speakers.sort((a, b) => a.name > b.name ? 1 : -1)
}

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
    return { speaker, speakerPhoto }
}
export default airtableSpeakers => {
  const speakersData = []
  const speakersImages = []
  for (let airtableSpeaker of airtableSpeakers) {
    const { speaker, speakerPhoto } = makeWebsiteSpeaker(airtableSpeaker)
    if (speakerPhoto.imageUri === '' || typeof speakerPhoto.imageUri === 'undefined') {
      console.log(`There was a problem with ${speaker.name}'s image`)
    } else {
      speakersImages.push(speakerPhoto)
    }
    speakersData.push(speaker)
  }
  return { speakersData, speakersImages }
}


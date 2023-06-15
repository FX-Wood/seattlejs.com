import { Record, FieldSet } from 'airtable'
import {
  normalizeTwitterHandle,
  makeSpeakerId,
  getFileExtension
} from './normalizers.js'
import {
  AirtablePhoto,
  WebsiteAirtablePair,
  WebsiteSpeaker
} from './repos/website-types.js'

/** mutate event and speaker objects in place and get new speaker photos.
 * @return copies of updated speaker and talk objects and any new speaker photos
 */
export const reconcileSpeakers = (
  event: WebsiteAirtablePair,
  airtableSpeakers: Record<FieldSet>[],
  websiteSpeakers: WebsiteSpeaker[]
): {
  updatedSpeakers: WebsiteSpeaker[]
  newPhotos: AirtablePhoto[]
} => {
  const newSpeakers = []
  const newPhotos = []
  // get the speakers for the passed event
  const airtableEventSpeakers = getEventSpeakers(
    event.airtable,
    airtableSpeakers
  )
  for (let speaker of airtableEventSpeakers) {
    // make speaker object and get photo uri
    const { speaker: newSpeaker, speakerPhoto: newPhoto } =
      makeWebsiteSpeaker(speaker)
    newSpeakers.push(newSpeaker)
    newPhotos.push(newPhoto)
  }
  const updatedSpeakers: WebsiteSpeaker[] = []
  for (let [i, newSpeaker] of newSpeakers.entries()) {
    if (websiteSpeakers.find(webSpeaker => webSpeaker.id == newSpeaker.id)) {
      newPhotos.splice(i, 1)
    } else {
      websiteSpeakers.push(newSpeaker)
      updatedSpeakers.push(newSpeaker)
    }
  }
  return { updatedSpeakers, newPhotos }
}

/** make a website speaker from an airtable speaker */
const makeWebsiteSpeaker = (
  airtableSpeaker: Record<FieldSet>
): { speaker: WebsiteSpeaker; speakerPhoto: AirtablePhoto } => {
  const speaker = {} as WebsiteSpeaker
  const name = airtableSpeaker.get('Full Name')
  const id = makeSpeakerId(name as string)
  const twitter = normalizeTwitterHandle(airtableSpeaker.get('Twitter'))
  speaker.id = id
  speaker.name = name as string
  speaker.company = airtableSpeaker.get('Company') as string
  speaker.twitter = twitter
  speaker.pronouns = airtableSpeaker.get('Pronouns') as string

  let speakerPhoto = {} as AirtablePhoto
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

/** given an airtable event (which only has speaker ids), return the full speaker
 * objects
 */
export const getEventSpeakers = (
  airtableEvent,
  airtableSpeakers
): Record<FieldSet>[] => {
  const speakerRecords = []
  for (let speakerId of airtableEvent.get('Speakers') as string[]) {
    // cartesian product runtime (O(a * b)), naughty naughty
    speakerRecords.push(
      airtableSpeakers.find(speaker => speakerId == speaker.id)
    )
  }
  return speakerRecords
}

export const sortSpeakers = speakers => {
  // heaven forbid there should be the same speaker twice
  return speakers.sort((a, b) => (a.name > b.name ? 1 : -1))
}

import { Record, FieldSet } from 'airtable'
import {
  normalizeTwitterHandle,
  makeSpeakerId,
  getFileExtension
} from './normalizers.js'
import { WebsiteAirtablePair, WebsiteSpeaker } from './repos/website-types.js'

export const reconcileSpeakers = (event: WebsiteAirtablePair,
                                  airtableSpeakers: Record<FieldSet>[],
                                  websiteSpeakers: WebsiteSpeaker[]
                                 ) => {
  // make new website speakers
  const newSpeakers = []
  for (let speakerId of event.airtable.get('Speakers') as string[]) {
    newSpeakers.push(airtableSpeakers.find(speaker => speakerId == speaker.id))
  }
  for (let speaker of newSpeakers) {
    const id = makeSpeakerId(speaker.get('Full Name'))
    const existingSpeaker = websiteSpeakers.find(webSpeaker => webSpeaker.id == id)
    console.log(existingSpeaker)
  }
  // check if they exist on website
  // if they don't, add them
}

export const sortSpeakers = (speakers) => {
    // heaven forbid there should be the same speaker twice
    return speakers.sort((a, b) => a.name > b.name ? 1 : -1)
}

export default airtableSpeakers => {
  const speakerShape = {
    id: '',
    name: '',
    company: '',
    photo: '',
    twitter: ''
  }
  const photoShape = {
    image: '',
    filename: ''
  }
  const speakersData = []
  const speakersImages = []
  for (let speaker of airtableSpeakers) {
    const data = { ...speakerShape }
    const photo = { ...photoShape }
    const name = speaker.get('Full Name')
    const id = makeSpeakerId(name)
    data.name = name
    data.id = id
    data.company = speaker.get('Company')
    const twitter = normalizeTwitterHandle(speaker.get('Twitter'))
    data.twitter = twitter
    const photoObj = speaker.get('Photo')
    // some speakers don't have photos
    if (typeof photoObj != 'undefined') {
      photo.image = photoObj[0].url
      const fileExtension = getFileExtension(photoObj[0].filename)
      const fileName = `${id}.${fileExtension}`
      photo.filename = fileName
      data.photo = fileName
    }
    if (photo.image === '' || typeof photo.image === 'undefined') {
      console.log(`There was a problem with ${name}'s image`)
    } else {
      speakersImages.push(photo)
    }
    speakersData.push(data)
  }
  return { speakersData, speakersImages }
}


import { Record, FieldSet } from 'airtable'

export type WebsiteEvent = {
  id: string
  title: string
  date: string
  sponsors: string[]
  talks: string[]
  description: string
}

/** single relationship between a website event and an
 * airtable event
 */
type WebsiteAirtablePair = {
  website: WebsiteEvent | undefined
  airtable: Record<FieldSet>
}

/** dictionary of website/airtable pairs where the website ID
 * is the key and the event object pairs are the value
 * for example:
 * { "june-2023": {
 *     website: {...}
 *     airtable: {...}
 *   },
 *   "july-2023": {
 *   ...
 * }
 */
type WebsiteAirtableMap = {
  [id: string]: WebsiteAirtablePair
}

export type WebsiteTalk = {
  id: string
  speaker_id: string
  event_id: string
  title: string
  abstract: string
  topics: string[]
  type: 'lightning' | 'regular'
}

export type WebsiteSpeaker = {
  id: string
  name: string
  company: string
  photo: string
  pronouns: string
  twitter?: string
}

export type AirtablePhoto = {
  imageUri: string
  filename: string
}

export type WebsiteSponsor = {
  id: string
  url: string
  image: string
  copy: string
}

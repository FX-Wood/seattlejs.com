import { Record, FieldSet } from "airtable"

export type WebsiteEvent = {
  id: string,
  title: string,
  date: string,
  speakers: string[]
  sponsors: string[],
  talks: string[],
  description: string
}

export type WebsiteTalk = {
  id: string,
  speaker_id: string,
  event_id: string,
  title: string,
  abstract: string,
  topics: string[],
  type: 'lightning' | 'regular'
}

export type WebsiteSpeaker = {
  id: string,
  name: string,
  company: string,
  photo: string,
  pronouns: string,
  twitter?: string
}

export type SpeakerPhoto = {
    imageUri: string,
    filename: string
}

type WebsiteAirtablePair = {
  website: WebsiteEvent | undefined,
  airtable: Record<FieldSet>
}

/*
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

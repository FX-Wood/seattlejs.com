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


type WebsiteAirtablePair = {
  website: WebsiteEvent,
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

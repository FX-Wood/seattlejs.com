import { FieldSet, Record } from 'airtable'
import {
  WebsiteSponsor,
  AirtablePhoto,
  WebsiteAirtablePair
} from './repos/website-types.js'
import { normalizeSponsorName, getFileExtension } from './normalizers.js'

/** mutates event and sponsor object by adding missing sponsors.
 * does not clobber any data, only adds.
 * @returns sponsor json data and event json data with any relevant mutations,
 *          and any new logos
 */
export const reconcileSponsors = (
  event: WebsiteAirtablePair,
  airtableSponsors: Record<FieldSet>[],
  websiteSponsors: WebsiteSponsor[]
): {
  newLogos: AirtablePhoto[]
  updatedSponsors: WebsiteSponsor[]
} => {
  const newSponsors: WebsiteSponsor[] = []
  const newLogos: AirtablePhoto[] = []
  // get airtable ids of event sponsors
  const airtableEventSponsorIds = event.airtable.get('Sponsors') as string[]
  const airtableEventSponsors = []
  // if airtable lists any sponsors, get full objects from each id
  if (airtableEventSponsorIds) {
    for (let airtableId of airtableEventSponsorIds) {
      airtableEventSponsors.push(
        airtableSponsors.find(sponsor => sponsor.id == airtableId)
      )
    }
  }
  // check if sponsors exist already
  for (let sponsor of airtableEventSponsors) {
    const { sponsor: newSponsor, logo: newLogo } = makeWebsiteSponsor(sponsor)
    newSponsors.push(newSponsor)
    // assume that if the sponsor json doesn't exist the photo doesn't exist
    newLogos.push(newLogo)
  }
  const updatedSponsors: WebsiteSponsor[] = []
  for (let [i, newSponsor] of newSponsors.entries()) {
    // check event json
    if (!event.website.sponsors.includes(newSponsor.id)) {
      event.website.sponsors.push(newSponsor.id)
      updatedSponsors.push(newSponsor)
    }
    // check sponsor json
    if (websiteSponsors.find(webSponsor => webSponsor.id == newSponsor.id)) {
      newLogos.splice(i, 1)
    } else {
      websiteSponsors.push(newSponsor)
    }
  }
  return { newLogos, updatedSponsors }
}

const makeWebsiteSponsor = (
  airtableSponsor: Record<FieldSet>
): {
  sponsor: WebsiteSponsor
  logo: AirtablePhoto
} => {
  const name = normalizeSponsorName(airtableSponsor.get('Name') as string)
  const sponsor = {} as WebsiteSponsor
  sponsor.id = name
  sponsor.url = airtableSponsor.get('Website') as string
  sponsor.copy = airtableSponsor.get('Web Copy') as string
  const logoObj = airtableSponsor.get('Logo')
  const logo = {} as AirtablePhoto
  if (typeof logoObj != 'undefined') {
    logo.imageUri = logoObj[0].url
    const fileExtension = getFileExtension(logoObj[0].filename)
    const fileName = `${name}.${fileExtension}`
    logo.filename = fileName
    sponsor.image = fileName
  }
  return { sponsor, logo }
}

export const sortSponsors = sponsors => {
  return sponsors.sort((a, b) => (a.name > b.name ? 1 : -1))
}

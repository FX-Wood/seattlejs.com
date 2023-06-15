import slugify from './slugify-import-shim.js'
export const makeEventId = eventName => {
  if (typeof eventName === 'undefined') {
    return ''
  }
  return eventName.replace('SeattleJS ', '').toLowerCase().replaceAll(' ', '-')
}

export const makeTalkId = (speakerId, eventId) => {
  return speakerId + '-' + eventId
}

export const makeSpeakerId = (speakerName: string): string => {
  return slugify(speakerName, { lower: true, locale: 'en-us' })
}

export const normalizeTalkTitle = talkName => {
  return talkName
}

export const normalizeTalkAbstract = talkAbstract => {
  return talkAbstract
}

export const normalizeTwitterHandle = rawTwitter => {
  if (typeof rawTwitter === 'undefined') {
    return ''
  }
  let clean = rawTwitter.trim()
  if (clean[0] === '@') {
    clean = clean.slice(1)
  }
  return clean
}

export const normalizeSponsorName = sponsorName => {
  if (typeof sponsorName === 'undefined') {
    return ''
  }
  return (
    sponsorName
      .trim()
      .toLowerCase()
      // handle things like 'Customer.io'
      .replaceAll('.', '-')
      .replaceAll(' ', '-')
      .replace(/[^a-z0-9-]/g, '')
      // handle things like 'Shopify / Remix'
      .replaceAll('--', '-')
  )
}

export const getFileExtension = fileName => {
  if (typeof fileName === 'undefined') {
    return ''
  }
  let temp = fileName.trim().toLowerCase().split('.').slice(-1)[0]
  if (temp === 'jpeg') {
    temp = 'jpg'
  }
  return temp
}

export const normalizeTalkType = (
  talkType: string
): 'regular' | 'lightning' => {
  if (talkType.toLowerCase().includes('regular')) {
    return 'regular'
  }
  return 'lightning'
}

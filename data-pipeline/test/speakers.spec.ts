import { strict as assert } from 'node:assert'
import _ from 'lodash'
import { reconcileSpeakers } from '../src/speakers.js'
import {
  targetEvent,
  airtableSpeakers,
  websiteSpeakers,
  websiteTalks
} from './june-2023-sample-data.js'

describe('reconcileSpeakers', function () {
  describe('should handle adding a new speaker to existing speakers', function () {
    const te = _.cloneDeep(targetEvent)
    // take cristina out for reconciliation
    const webSpeakers = websiteSpeakers.filter(
      speaker => !speaker.id.includes('cristina')
    )
    const webTalks = websiteTalks.filter(talk => !talk.id.includes('cristina'))
    te.website.talks.filter(talk => talk.includes('cristina'))
    console.log(te.website.talks)
    console.log(webSpeakers.map(s => s.name))
    console.log(webTalks.map(s => s.id))

    // revmove a speaker from the website
    const result = reconcileSpeakers(
      te,
      airtableSpeakers,
      webSpeakers,
      webTalks
    )
  })
})

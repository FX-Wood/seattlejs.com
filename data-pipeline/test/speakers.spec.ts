import { strict as assert } from 'node:assert'
// in June 2023, @types/lodash has an infinite loop when compiling with tsc
import { reconcileSpeakers } from '../src/speakers.js'
import {
  targetEvent,
  airtableSpeakers,
  websiteSpeakers,
} from './june-2023-sample-data.js'

describe('reconcileSpeakers', function () {
  describe('should handle adding speakers when none exist', function () {
      const webSpeakers = []
      const { updatedSpeakers } = reconcileSpeakers(
          targetEvent,
          airtableSpeakers,
          webSpeakers,
      )
      it('returns the right number of speakers', function () {
          assert(updatedSpeakers.length === 3, `returned ${updatedSpeakers.length} instead of 3`)
      })
      it('returns the correct speakers', function () {
          const correctSpeakerIds = [
                'cristina-rodriguez',
                'aiden-bai',
                'dm-liao'
        ]
        for (let correctSpeaker of correctSpeakerIds) {
            assert(
                updatedSpeakers.find(updatedSpeaker => updatedSpeaker.id == correctSpeaker),
                `${correctSpeaker} not found in ${updatedSpeakers}`
            )
        }
      })
  })
  describe('should handle adding a new speaker to existing speakers', function () {
    // take cristina out of speakers json
    const webSpeakers = websiteSpeakers.filter(
      speaker => !speaker.id.includes('cristina')
    )
    const { updatedSpeakers } = reconcileSpeakers(
      targetEvent,
      airtableSpeakers,
      webSpeakers,
    )
    it('returns the right number of speakers', function () {
        assert(updatedSpeakers.length === 1, `returned ${updatedSpeakers.length} instead of 1`)
    })
    it('returns the correct speaker', function () {
        assert(updatedSpeakers.find(speaker => speaker.id.includes('cristina')), "reconcileSpeakers() didn't return missing speaker")
    })
  })
})

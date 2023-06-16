import { strict as assert } from 'node:assert'
// in June 2023, @types/lodash has an infinite loop when compiling with tsc
import _ from 'lodash'
import {
  targetEvent,
  airtableSpeakers,
  websiteTalks,
} from './june-2023-sample-data.js'
import { reconcileTalks } from '../src/talks.js'

const correctTalkIds = [
    'cristina-rodriguez-june-2023',
    'aiden-bai-june-2023',
    'dm-liao-june-2023'
]

describe('reconcileTalks', function () {
    describe('should handle adding talks when none exist', function () {
        const te = _.cloneDeep(targetEvent)
        te.website.talks = []
        const emptyWebTalks = []
        const updatedTalks = reconcileTalks(te, airtableSpeakers, emptyWebTalks)
        it('should return the right talks', function () {
            const updatedTalkIds = updatedTalks.map(talk => talk.id)
            assert(updatedTalkIds.every(id => correctTalkIds.includes(id)),`updated talks: ${updatedTalkIds} don't match expected talks: ${correctTalkIds}`)
          assert(updatedTalks.length === 3, `returned ${updatedTalks.length} instead of 3`)
        })
        it('should update the event json', function () {
            assert(te.website.talks.length === 3, `event has ${te.website.talks.length} instead of 3`)
            assert(te.website.talks.every(id => correctTalkIds.includes(id)), `correct talks: ${correctTalkIds} doesn't match event talks: ${te.website.talks}`)
        })
    })
    describe('should handle adding new talks to an existing event', function () {
        const te = _.cloneDeep(targetEvent)
        // remove aiden from event json
        te.website.talks = te.website.talks.filter(talkId => !talkId.includes('aiden'))
        // remove aiden from talks json
        const webTalks = websiteTalks.filter(talk => !talk.id.includes('aiden'))
        
        const updatedTalks = reconcileTalks(te, airtableSpeakers, webTalks)
        const correctTalkId = 'aiden-bai-june-2023'
        it('should return the right talks', function () {
            const updatedTalkIds = updatedTalks.map(talk => talk.id)
            assert(updatedTalkIds[0] === correctTalkId,`updated talks: ${updatedTalkIds} don't match expected talks: ${correctTalkIds}`)
          assert(updatedTalks.length === 1, `returned ${updatedTalks.length} instead of 3`)
        })
        it('should update the event json', function () {
            assert(te.website.talks.length === 3, `event has ${te.website.talks.length} instead of 3`)
            assert(te.website.talks.every(id => correctTalkIds.includes(id)), `correct talks: ${correctTalkIds} doesn't match event talks: ${te.website.talks}`)
        })
    })
})

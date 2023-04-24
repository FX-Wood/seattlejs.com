import eventsData from '../../app/data/events.json' assert { type: 'json' }
import speakerData from '../../app/data/speakers.json' assert { type: 'json' }
import talksData from '../../app/data/talks.json' assert { type: 'json' }
import sponsorsData from '../../app/data/sponsors.json' assert { type: 'json' }

import { sortSpeakers } from './speakers.js'
import { sortEvents } from './events.js'
import { sortTalks } from './talks.js'
import { sortSponsors } from './sponsors.js'

import { exportData } from './exporters.js'

function main() {
    const sortedSpeakers = sortSpeakers(speakerData)
    const sortedTalks = sortTalks(talksData)
    const sortedSponsors = sortSponsors(sponsorsData)

    exportData(sortedSpeakers, "speakers")
    exportData(sortedTalks, "talks")
    exportData(sortedSponsors, "sponsors")
}
main()


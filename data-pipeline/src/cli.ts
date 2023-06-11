import prompts from 'prompts'
import fs from 'fs/promises'
import { Record, FieldSet } from 'airtable'

const MONTHS_PRIOR_LIMIT = 1
const MONTHS_IN_FUTURE_LIMIT = 4
const EVENTS_JSON_FILE_LOCATION = '../../app/data/events.json'

const getDateMonthsAgo = (monthsPrior: number): Date => {
    const d = new Date()
    d.setMonth(d.getMonth() - monthsPrior)
    return d
}

const getDateMonthsInFuture = (monthsInFuture: number): Date => {
    const d = new Date()
    d.setMonth(d.getMonth() + monthsInFuture)
    return d
}

interface Choice {
    title: string,
    value: Record<FieldSet>
}

export const getTargetEvent = async (airtableEvents: Record<FieldSet>[]): Promise<Record<FieldSet>> => {
    // reduce number of events to limit, taking most recent
    const someMonthsAgo = getDateMonthsAgo(MONTHS_PRIOR_LIMIT)
    const someMonthsInFuture = getDateMonthsInFuture(MONTHS_IN_FUTURE_LIMIT)
    const recentEvents = []
    for (let event of airtableEvents) {
        const eventDate = new Date(String(event.get('Date')))
        if (eventDate > someMonthsAgo && eventDate < someMonthsInFuture) {
            recentEvents.push(event)
        }
    }
    // prompt user which one they want
    const choices: Choice[] = recentEvents.map(ev => ({ title: ev.get('Name'), value: ev }))
    const choice = await prompts({
       type: 'select',
       name: 'eventChoice',
       message: 'Which event would you like to update?',
       choices: choices
    })
    // return selected event
    console.log(choice)
    return choice.eventChoice.value
}


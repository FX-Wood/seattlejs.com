import prompts from 'prompts'
import { WebsiteAirtableMap, WebsiteAirtablePair } from './website-types.js'

const MONTHS_PRIOR_LIMIT = 1
const MONTHS_IN_FUTURE_LIMIT = 4

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

export const getTargetEvent = async (events: WebsiteAirtableMap): Promise<WebsiteAirtablePair> => {
    // reduce number of events to limit, taking most recent
    const someMonthsAgo = getDateMonthsAgo(MONTHS_PRIOR_LIMIT)
    const someMonthsInFuture = getDateMonthsInFuture(MONTHS_IN_FUTURE_LIMIT)
    const choices: { title: string, value: WebsiteAirtablePair }[] = []
    for (let event in events) {
        const eventDate = new Date(String(event))
        if (eventDate > someMonthsAgo && eventDate < someMonthsInFuture) {
            choices.push({
                title: String(events[event].airtable.get('Name')),
                value: events[event]
            })
        }
    }
    // prompt user which one they want
    const choice = await prompts({
       type: 'select',
       name: 'eventChoice',
       message: 'Which event would you like to update?',
       choices: choices
    })
    // return selected event
    return choice.eventChoice
}


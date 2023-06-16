import { Record, FieldSet } from 'airtable'
import { MockRecord } from './MockAirtableRecord.js'

export const websiteEvent = {
  id: 'june-2023',
  title: 'SeattleJS June 2023',
  date: '2023-06-14',
  sponsors: ['courier'],
  talks: [
    'cristina-rodriguez-june-2023',
    'aiden-bai-june-2023',
    'dm-liao-june-2023'
  ],
  description:
    "Join your fellow web devs for an evening of talks, networking and fun! Tickets are only $5 but go up to $10 the day of, so don't delay!"
}

export const airtableEvent = new MockRecord({
  id: 'recHF8UdRhXHAvJXu',
  createdTime: '2023-04-12T15:00:26.000Z',
  fields: {
    Name: 'SeattleJS June 2023',
    Status: 'In progress',
    Date: '2023-06-14',
    Speakers: ['recbhSGWch5dDegOi', 'recXq9YUCKdbCpKQ1', 'recuwWoaReblfj4GE'],
    'Tito Event Slug': 'seattlejs-june-2023',
    Sponsors: ['rec6gfSHHcJTXuEBb']
  }
}) as unknown as Record<FieldSet>

export const targetEvent = {
  website: websiteEvent,
  airtable: airtableEvent as Record<FieldSet>
}

export const websiteSpeakers = [
  {
    id: 'dm-liao',
    name: 'DM Liao',
    company: 'n/a',
    photo: 'dm-liao.jpg',
    url: 'https://amorphic.space',
    pronouns: 'they/them/theirs'
  },
  {
    id: 'cristina-rodriguez',
    name: 'Cristina Rodriguez',
    company: 'Techtonica.org',
    photo: 'cristina-rodriguez.jpg',
    twitter: 'yosola',
    pronouns: 'she/her/ella',
    url: 'https://www.linkedin.com/in/crissrodriguez/'
  },
  {
    "id": "aiden-bai",
    "name": "Aiden Bai",
    "company": "Dimension.dev",
    "photo": "aiden-bai.jpg",
    "twitter": "aidenybai",
    "pronouns": "he/him/his",
    "url": "https://aidenybai.com"
  }
]

const dm = new MockRecord({
  id: 'recXq9YUCKdbCpKQ1',
  createdTime: '2023-03-09T07:14:26.000Z',
  fields: {
    'Full Name': 'DM Liao',
    Photo: [
      {
        id: 'attjbZnamqcF33T7M',
        width: 400,
        height: 400,
        url: 'https://v5.airtableusercontent.com/v1/18/18/1686787200000/hqMcLv_wZzavNr3HbkeZ4Q/Y1DpTuMwdBY0VXSCgB_C4YdU819-qq4ZSAWMW3kLYua2kHvTxXhYWGgHPm5mQHDBenhP0B2dlju-vjts6uw8sny12DXluecsvX4z0s7-sRA/zdk7yGQ9JoSJGRbZ5uo2Eaij88NXvKtMUL45SbFwCLw',
        filename: 'tsyBZs-z_400x400.jpg',
        size: 15928,
        type: 'image/jpeg',
        thumbnails: {
          small: {
            url: 'https://v5.airtableusercontent.com/v1/18/18/1686787200000/TZ0O9IJ5ipDyAr10Xnn_rg/nrL66B9pRuTKnbtASMFY1Q2OrjbBZG8_iIOM0rDscMjbyuqtQ0ucYoGb9rQhwjUHtqi-rsYNBkn-B5IUEdvHiA/whKER42NJb7QDLP22C9mTkDH91XaYlOtRPhPkJxIZJI',
            width: 36,
            height: 36
          },
          large: {
            url: 'https://v5.airtableusercontent.com/v1/18/18/1686787200000/jpQJm4Kmyam8lL460UlWdw/fKtV7w298J_C_sy_kCvu9SyfyqY3nxwP0llnGCl0ZEImXjzyvn1orU_D7j6rmiYEm-pzG772Sj3mL9O4CzosuA/Sh_2qHYy3_D8aHxUQ2HFNVgIIs2W1cjhnZb6Nb_699g',
            width: 400,
            height: 400
          },
          full: {
            url: 'https://v5.airtableusercontent.com/v1/18/18/1686787200000/TKjTHv9lLOzBG5Q4AzH4jg/u8iRo4schJugbkB8RQTFY_R-5ISICjf3HlRa5fccKVOsoUHtIi7s-9-zXhlyLpeUvOak7QSd5eTy141yXmxlwQ/rN_GVKj5BamCXuKJaPurGOxJM4qBxY6nfA14jcSVgOg',
            width: 3000,
            height: 3000
          }
        }
      }
    ],
    Status: 'Accepted',
    Email: 'dl.amorphous@gmail.com',
    'Talk Title':
      'Using the web to make interactive fanfiction (working title)',
    Website: 'https://amorphic.space',
    Company:
      'Not really applicable to this...(also sorry for the non-photo, I have like no photos of myself right now)',
    Topics:
      'preactjs, inkjs, immutable data, text parsing, interactive fiction',
    Pronouns: 'they/them/theirs',
    'Talk Blurb':
      "Over the pandemic, people developed a wide variety of hobbies to fill the time, and for me, that was writing a ridiculous amount of fanfiction. One of the most ambitious pieces was an interactive, choice-based and animated story written using Ink and 'set' with Preact and InkJS, and this talk goes through some of the creative and technical decisions I made to get them to play nicely with each other.",
    Events: ['recHF8UdRhXHAvJXu'],
    'Talk Type': 'Regular Talk (30 min max)',
    'Sponsor?': 'No',
    Created: '2023-03-09T07:14:26.000Z',
    'Date (from Events)': ['2023-06-14']
  }
}) as unknown as Record<FieldSet>

const cristina = new MockRecord({
  id: 'recuwWoaReblfj4GE',
  createdTime: '2023-05-15T20:31:30.000Z',
  fields: {
    'Full Name': 'Cristina Rodriguez',
    Photo: [
      {
        id: 'attgAjHqsDj6n5kxt',
        width: 2048,
        height: 2560,
        url: 'https://v5.airtableusercontent.com/v1/18/18/1686787200000/mQwnJXKNueN0J3Vyq-Zkpw/SI1DkgPkz2y7vEblmwDW1DzURaY7I6ehow5BKerXkuAcp6JKz7Qo3nAt4dgswQty9tRjrvIaWB6yEGHFdwUfAxlwhw_3BpUMlE-XlQdKo1hM47ZZOBbMqaV0XgBuP8VM/9AF_E7PagCGBdHn4txLZ7YspMN9Og_49gqXfw6PxHrU',
        filename: 'CristinaRodriguezHeadshoot.jpg',
        size: 1369910,
        type: 'image/jpeg',
        thumbnails: {
          small: {
            url: 'https://v5.airtableusercontent.com/v1/18/18/1686787200000/9-NPH1o6pCVj7GaXT3Z3lg/aFDYQ8bn0k96tV9Bl1whHIFUlQgxyIKuz4yIrOd69-wamr3D0vTPAqIe-XuaN3bSqi9ADQucdeCrdqRrTw-ejQ/TpdUrahnYGpX_ALwqg1KoP7QjkH1jDoABwHprZjROpg',
            width: 29,
            height: 36
          },
          large: {
            url: 'https://v5.airtableusercontent.com/v1/18/18/1686787200000/7ZMXddMgWTrGdvw1RU9zPg/QlF6WCUt7oA6DUjd99hXcI7CoSU9qwqyhKHukmTmqEyotQOCnkkUZOg-LbKzOxiLOdwJMidupnb0Qhf7RadQZA/DdaifR1LzHr3RNYvwxMpiuPybdPneFMYuwXZLT_kVVE',
            width: 512,
            height: 640
          },
          full: {
            url: 'https://v5.airtableusercontent.com/v1/18/18/1686787200000/go5rH47jhPau1-doLVXYgQ/1FO6E-A0d0orJeD9lZd---6zXRjIks9iBt1xWmmmz2gdLKaBOtou10VOx_P5Iiq5TMsnfxZm1iU6SJucGhwbHg/S_-ouYoYkAdCtxraotBo9HDdD30UTFQzb-1bW7WHoko',
            width: 3000,
            height: 3000
          }
        }
      }
    ],
    Status: 'Accepted',
    Email: 'yosola@gmail.com',
    'Talk Title': 'Overcoming Blank Page Syndrome with your Template',
    Twitter: '@yosola',
    Website: 'https://www.linkedin.com/in/crissrodriguez/',
    Company: 'Techtonica.org',
    Topics: 'Javascript, templates, projects, front-end, backend, react, vite',
    Pronouns: 'she/her/ella',
    'Talk Blurb':
      'How many times have you thought of a great idea for a project but were not quite sure how to start coding that project? Using templates can help beginning engineers overcome the overwhelm and fear that can come with starting projects. The goal of this talk is to share with everyone who is self-learning to code that templates and automation are their friends, especially for that tedious work of your initial setup. There is no need to start every project from scratch.',
    Events: ['recHF8UdRhXHAvJXu'],
    'Talk Type': 'Lightning Talk (5 - 10 max)',
    'Sponsor?': 'No',
    Created: '2023-05-15T20:31:30.000Z',
    'Date (from Events)': ['2023-06-14']
  }
}) as unknown as Record<FieldSet>

const aiden = new MockRecord({
  id: 'recbhSGWch5dDegOi',
  createdTime: '2023-03-10T16:48:53.000Z',
  fields: {
    'Full Name': 'Aiden Bai',
    Photo: [
      {
        id: 'attkWUCP0dtjXonyI',
        width: 350,
        height: 350,
        url: 'https://v5.airtableusercontent.com/v1/18/18/1686787200000/_fK3b8ntS9Ee9EEcnJI7Qw/Kje-zRqBuD_EbO08ZGyrLzIjM8MVOVn-bF7gh220Jq_JNS9-xond2cOItB1niPR4aQ7J3sfUr3HVOhjlXijbX9OcIl_YbeBF1RmM0MnyxGuz0jbX4wSHiwHEhNQ-KKMC/zXhNQfj57B4to_RDUxH1dE_RwYjbXaqtRYnM67IsuTg',
        filename: 'Hack_Club_Assemble_LTNJ_00039.JPG',
        size: 28414,
        type: 'image/jpeg',
        thumbnails: {
          small: {
            url: 'https://v5.airtableusercontent.com/v1/18/18/1686787200000/ScdmJ3pX3xPpvHHG2poeCQ/buMMQZaes_0GrsLGG039A_w-_Y8G9kPo0MMn4_E7hxncHojDHD5ZlQmXu8mdrhVPrqu4gXZHLphbEutIkmISNQ/Xj6alQoYEWhTbVuHl_zG7J6iVxAMyhP1oBQ96r9co84',
            width: 36,
            height: 36
          },
          large: {
            url: 'https://v5.airtableusercontent.com/v1/18/18/1686787200000/OyBYFir5RCoUmXLrerajCw/IJxL05ZnFwHqVCSW8QtZDq05te88xCJbEVeOM-ZnJxkG1MytZnlD97eNkSdNHZt2PVPy77lIBKyf5_NhHhh9Rw/g9y0J65kOjqdJfuv6jzmQ2BjsTgo9_31QmIiEn9O4nQ',
            width: 350,
            height: 350
          },
          full: {
            url: 'https://v5.airtableusercontent.com/v1/18/18/1686787200000/EbnsU8qQ5FL_O28SF8lzTg/46ToC26-DkK3RFAnBuBOMEdm7OON5xs4KSnB5OkfEQgOdHfNrwEIgG_Sslzzt2nNNIQE5KqUUkUXkK7xKRaU_g/ju-WrrzJXPTJMuFlim3TAoFSW5Ri5FoD-ejdbhe_SLU',
            width: 3000,
            height: 3000
          }
        }
      }
    ],
    Status: 'Accepted',
    Email: 'aiden.bai05@gmail.com',
    'Talk Title': 'Speeding up React with Million.js',
    Twitter: 'aidenybai',
    Website: 'https://aidenybai.com',
    Company: ' Dimension.dev',
    Topics:
      'reactjs, millionjs, nextjs, performance, rendering, javascript, typescript',
    Pronouns: 'he/him/his',
    'Talk Blurb': 'Up to 70% faster React Components with Million.js.',
    Events: ['recHF8UdRhXHAvJXu'],
    'Talk Type': 'Lightning Talk (5 - 10 max)',
    'Sponsor?': 'No'
  }
}) as unknown as Record<FieldSet>

export const airtableSpeakers = [dm, cristina, aiden]

const dmTalk = {
  id: 'dm-liao-june-2023',
  speaker_id: 'dm-liao',
  event_id: 'june-2023',
  title: 'Using the web to make interactive fanfiction (working title)',
  abstract:
    "Over the pandemic, people developed a wide variety of hobbies to fill the time, and for me, that was writing a ridiculous amount of fanfiction. One of the most ambitious pieces was an interactive, choice-based and animated story written using Ink and 'set' with Preact and InkJS, and this talk goes through some of the creative and technical decisions I made to get them to play nicely with each other.",
  topics: [
    'preactjs',
    'inkjs',
    'immutable data',
    'text parsing',
    'interactive fiction'
  ],
  type: 'regular' as 'lightning' | 'regular'
}

const cristinaTalk = {
  id: 'cristina-rodriguez-june-2023',
  speaker_id: 'cristina-rodriguez',
  event_id: 'june-2023',
  title: 'Overcoming Blank Page Syndrome with your Template',
  abstract:
    'How many times have you thought of a great idea for a project but were not quite sure how to start coding that project? Using templates can help beginning engineers overcome the overwhelm and fear that can come with starting projects. The goal of this talk is to share with everyone who is self-learning to code that templates and automation are their friends, especially for that tedious work of your initial setup. There is no need to start every project from scratch.',
  topics: [
    'Javascript',
    'templates',
    'projects',
    'front-end',
    'backend',
    'react',
    'vite'
  ],
  type: 'lightning' as 'lightning' | 'regular'
}

const aidenTalk = {
  id: 'aiden-bai-june-2023',
  speaker_id: 'aiden-bai',
  event_id: 'june-2023',
  title: 'Speeding up React with Million.js',
  abstract: 'Up to 70% faster React Components with Million.js.',
  topics: [
    'reactjs',
    'millionjs',
    'nextjs',
    'performance',
    'rendering',
    'javascript',
    'typescript'
  ],
  type: 'lightning' as 'lightning' | 'regular'
}

export const websiteTalks = [dmTalk, cristinaTalk, aidenTalk]

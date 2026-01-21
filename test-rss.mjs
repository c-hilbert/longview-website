import { XMLParser } from 'fast-xml-parser'

const response = await fetch('https://lexfridman.com/feed/podcast/')
const xmlContent = await response.text()

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
})

const parsed = parser.parse(xmlContent)

const items = parsed.rss?.channel?.item
if (!items) {
  console.log('No items found')
  process.exit(1)
}

const itemArray = Array.isArray(items) ? items : [items]
console.log(`Found ${itemArray.length} episodes`)

const first = itemArray[0]
console.log('\nFirst episode:')
console.log('Title:', first.title)
console.log('GUID:', first.guid)
console.log('Enclosure:', first.enclosure)
console.log('Duration:', first['itunes:duration'])

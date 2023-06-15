/** stolen from https://dev.to/ankittanna/how-to-create-a-type-for-complex-json-object-in-typescript-d81 */
type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>

export class MockRecord {
  public id: string
  public rawJson: JSONValue
  public fields: JSONValue

  /** get the raw json for an airtable record by logging its "_rawJson" field */
  constructor(airtableRecordJson: JSONValue) {
    this.id = airtableRecordJson['id']
    this.rawJson = airtableRecordJson
    this.fields = airtableRecordJson['fields']
  }

  get(field: string) {
    return this.fields[field]
  }
}

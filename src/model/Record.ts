const EntrySchema = {
  bsonType: "object",
  title: "record",
  properties: {
    type: {
      bsonType: "string",
      maxLength: 12,
    },
    host: {
      bsonType: "string",
      maxLength: 12,
    },
    target: {
      bsonType: "string",
      maxLength: 128,
    },
    ttl: {
      bsonType: "number",
      maxLength: 12,
    },
  }
}

const RecordSchema = {
  /** Configure the collection's schema.
   * https://docs.mongodb.com/manual/core/schema-validation/
   */
  bsonType: "object",

  required: [ 
    "name", "pubkey", "status", "purchased", "expires", "receipt" 
  ],
  
  properties: {
    name: {
      bsonType: "string",
      maxLength: 32,
      description: "Must be a string and is required."
    },
    pubkey: {
      bsonType: "string",
      maxLength: 64,
      description: "Must be a string and is required."
    },
    sig: {
      bsonType: [ "string" ]
    },
    records: {
      bsonType: [ "array" ],
      uniqueItems: true,
      items: EntrySchema
    },
    relays: {
      bsonType: [ "string" ]
    },
    status: {
      bsonType: [ "string" ]
    },
    purchased: {
      bsonType: [ "number" ],
    },
    expires: {
      bsonType: [ "number" ]
    },
    receipt: {
      bsonType: [ "string" ]
    }
  }
}

export const RecordModel = {
  // Name of the collection.
  name: 'records',

  indexes: [
    /** Configure the collection's indexes.
     * https://docs.mongodb.com/manual/reference/command/createIndexes
     */
    {
      name: "_lookup_",
      key: { name: 1, pubkey: 1, purchased: -1, expires: -1, invoice: 1 },
      unique: true
    }
  ],
  options: {
    validator: { $jsonSchema: RecordSchema },
    validationLevel: "strict",
    validationAction: "error"
  }
}

const RecordSchema = {
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

const AccountSchema = {
  /** Configure the collection's schema.
   * https://docs.mongodb.com/manual/core/schema-validation/
   */
  bsonType: "object",

  required: [ 
    "ordinal", "pointer", "pubkey", "sig", "status", 
    "purchased", "expires", "receipt" 
  ],
  
  properties: {
    ordinal: {
      bsonType: "number",
      description: "Must be a number and is required."
    },
    pointer: {
      bsonType: "string",
      maxLength: 100,
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
      items: RecordSchema
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

export const AccountModel = {
  // Name of the collection.
  name: 'accounts',

  indexes: [
    /** Configure the collection's indexes.
     * https://docs.mongodb.com/manual/reference/command/createIndexes
     */
    {
      name: "_idx_",
      key: { ordinal: 1, pubkey: 1, invoice: 1 },
      unique: true
    },
    {
      name: "_timestamp_",
      key: { purchased: -1, expires: -1 },
      unique: false
    }
  ],
  options: {
    validator: { $jsonSchema: AccountSchema },
    validationLevel: "strict",
    validationAction: "error"
  }
}

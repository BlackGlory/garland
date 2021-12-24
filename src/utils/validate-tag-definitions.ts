import Ajv from 'ajv/dist/2020.js'

const ajv = new Ajv()
const schema = {
  $ref: '#/$defs/path'
, $defs: {
    path: {
      type: 'object'
    , additionalProperties: {
        oneOf: [
          { $ref: '#/$defs/path' }
        , { $ref: '#/$defs/tags' }
        ]
      }
    }
  , tags: {
      type: 'array' 
    , items: { type: 'string' }
    }
  }
}

export function validateTagDefinitions(data: unknown): void {
  const valid = ajv.validate(schema, data)
  if (!valid) throw new Error(ajv.errorsText())
}

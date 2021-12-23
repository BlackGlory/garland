import Ajv from 'ajv/dist/2020.js'

const ajv = new Ajv()
const schema = {
  type: 'object'
, additionalProperties: { $ref: '#/$defs/path' }
, $defs: {
    path: {
      oneOf: [
        {
          type: 'object'
        , properties: {
            $condition: { type: 'string' }
          }
        , additionalProperties: { $ref: '#/$defs/path' }
        }
      , { type: 'null' }
      ]
    }
  }
}

export function validateBlueprint(data: unknown): void {
  const valid = ajv.validate(schema, data)
  if (!valid) throw new Error(ajv.errorsText())
}

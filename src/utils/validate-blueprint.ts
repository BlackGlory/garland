import Ajv from 'ajv/dist/2020.js'
import { IBlueprint } from './types.js'

const ajv = new Ajv.default()
const schema = {
  $ref: '#/$defs/path'
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

export function validateBlueprint(data: unknown): asserts data is IBlueprint {
  const valid = ajv.validate(schema, data)
  if (!valid) throw new Error(ajv.errorsText())
}

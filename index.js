const jp = require('jsonpath')

module.exports.templateTags = [
  {
    name: 'jsonpathpp',
    displayName: 'JSONPath++',
    liveDisplayName: ([path]) => JSON.stringify(path.value).replace(/"/g, ''),
    description: 'extract values from JSON-like environment variables',
    args: [
      {
        displayName: 'JSONPath',
        type: 'string',
        description: 'JSON path to specific value',
        placeholder: 'key1[3].key2..key3'
      }
    ],
    run: async ({ context }, path) => {
      const parser = obj => {
        if (typeof obj === 'string') {
          try {
            return parser(JSON.parse(obj))
          } catch {
            return obj
          }
        }
        if (typeof obj === 'object') {
          if (Array.isArray(obj)) {
            return obj.map(parser)
          }
          return Object.entries(obj).reduce(
            (acc, [key, value]) => {
              acc[key] = parser(value)
              return acc
            }, {}
          )
        }
        return obj
      }
      const vv = jp.query(parser(context), path) || []
      if (vv.length > 1) {
        return JSON.stringify(vv, null, 2)
      }
      const [v] = vv
      return typeof v === 'object' ? JSON.stringify(v, null, 2) : v
    }
  }
]

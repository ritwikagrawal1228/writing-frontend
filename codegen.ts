import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'src/graphql/schema/*.graphql',
  documents: 'src/graphql/query/*.graphql',
  generates: {
    'src/graphql/client/': {
      preset: 'client',
      plugins: [],
    },
    './graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
}

export default config

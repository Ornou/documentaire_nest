import { GraphQLScalarType } from 'graphql';

// Définition du type pour les fichiers uploadés
export type FileUpload = {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => NodeJS.ReadableStream;
};

// Définition du scalar Upload
export const Upload = new GraphQLScalarType({
  name: 'Upload',
  description: 'The `Upload` scalar type represents a file upload.',
  parseValue: (value) => value,
  serialize: (value) => value,
  parseLiteral(ast) {
    throw new Error('Upload scalar literal unsupported');
  },
});

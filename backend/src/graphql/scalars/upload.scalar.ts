import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

type FileUpload = {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => NodeJS.ReadableStream;
};

type FileUploadValue = FileUpload | string;

@Scalar('Upload')
export class UploadScalar implements CustomScalar<FileUploadValue, string> {
  description = 'Upload custom scalar type';

  parseValue(value: FileUploadValue): string {
    if (typeof value === 'string') {
      return value;
    }
    return value.filename;
  }

  serialize(value: FileUploadValue): string {
    if (typeof value === 'string') {
      return value;
    }
    return value.filename;
  }

  parseLiteral(ast: ValueNode): string {
    if (ast.kind === Kind.STRING) {
      return ast.value;
    }
    throw new Error('Upload value must be a string');
  }
}

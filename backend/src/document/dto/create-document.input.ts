import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateDocumentInput {
  @Field(() => String)
  title: string;
  @Field(() => String)
  description: string;
  @Field({ nullable: true })
  fileUrl?: string;
}

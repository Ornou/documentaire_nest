import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateDocumentInput {
  @Field(() => String)
  title: string;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field({ nullable: true })
  fileUrl?: string;
}

import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Document {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  fileUrl?: string;

  @Field(() => Int)
  userId: number;
}

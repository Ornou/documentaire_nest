/* eslint-disable prettier/prettier */
import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
  @Field(() => String, { description: 'Name of the user' })
  name: string;
  @Field(() => String, { description: 'Email of the user' })
  email: string;
  @Field(() => String, { description: 'Password of the user' })
  password: string;

}

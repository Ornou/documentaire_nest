import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {
  constructor(private users: CreateUserInput) {}

   async register(username: string, email: string, password: string) {
    // Logic to register a user
    // This could involve saving the user to a database, sending a confirmation email, etc.
    return {
      username,
      email,
      password,
    };
  }
}

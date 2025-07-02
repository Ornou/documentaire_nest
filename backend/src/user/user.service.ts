import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserInput: CreateUserInput) {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserInput.email }
    });

    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

    return this.prisma.user.create({ data: createUserInput });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async update(id: number, updateUserInput: UpdateUserInput) {
    return this.prisma.user.update({ where: { id }, data: updateUserInput });
  }

  async remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}

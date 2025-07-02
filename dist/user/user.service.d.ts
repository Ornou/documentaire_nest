import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserInput: CreateUserInput): Promise<{
        id: number;
        name: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role | null;
    }>;
    findAll(): Promise<{
        id: number;
        name: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role | null;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role | null;
    }>;
    findByEmail(email: string): Promise<{
        id: number;
        name: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role | null;
    } | null>;
    update(id: number, updateUserInput: UpdateUserInput): Promise<{
        id: number;
        name: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role | null;
    }>;
}

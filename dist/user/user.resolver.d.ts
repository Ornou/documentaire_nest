import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
export declare class UserResolver {
    private readonly userService;
    constructor(userService: UserService);
    createUser(createUserInput: CreateUserInput): Promise<{
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
    updateUser(updateUserInput: UpdateUserInput): Promise<{
        id: number;
        name: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role | null;
    }>;
    removeUser(id: number): Promise<{
        id: number;
        name: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role | null;
    }>;
}

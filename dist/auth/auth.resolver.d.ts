import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
export declare class AuthResolver {
    private readonly authService;
    private readonly userService;
    constructor(authService: AuthService, userService: UserService);
    register(registerInput: RegisterInput): Promise<{
        user: {
            id: number;
            name: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role | null;
        };
        access_token: string;
    }>;
    login(loginInput: LoginInput): Promise<{
        user: any;
        access_token: string;
    }>;
}

import { CreateDocumentInput } from './dto/create-document.input';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Queue } from 'bullmq';
import { UpdateDocumentInput } from './dto/update-document.input';
export declare class DocumentService {
    private prisma;
    private configService;
    private jwtService;
    private documentQueue;
    constructor(prisma: PrismaService, configService: ConfigService, jwtService: JwtService, documentQueue: Queue);
    create(createDocumentInput: CreateDocumentInput, userId: number, file?: Express.Multer.File): Promise<{
        title: string;
        description: string;
        fileUrl: string | null;
        id: number;
        userId: number;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    findAll(): Promise<({
        user: {
            id: number;
            name: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role | null;
        };
    } & {
        title: string;
        description: string;
        fileUrl: string | null;
        id: number;
        userId: number;
        createdAt: Date | null;
        updatedAt: Date | null;
    })[]>;
    findOne(id: number): Promise<{
        user: {
            id: number;
            name: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role | null;
        };
    } & {
        title: string;
        description: string;
        fileUrl: string | null;
        id: number;
        userId: number;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    update(id: number, updateDocumentInput: UpdateDocumentInput, userId: number): Promise<{
        title: string;
        description: string;
        fileUrl: string | null;
        id: number;
        userId: number;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    remove(id: number, userId: number): Promise<{
        title: string;
        description: string;
        fileUrl: string | null;
        id: number;
        userId: number;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
}

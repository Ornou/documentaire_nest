import { DocumentService } from './document.service';
import { CreateDocumentInput } from './dto/create-document.input';
import { UpdateDocumentInput } from './dto/update-document.input';
export declare class DocumentResolver {
    private readonly documentService;
    constructor(documentService: DocumentService);
    createDocument(createDocumentInput: CreateDocumentInput, user: any): Promise<{
        title: string;
        description: string;
        fileUrl: string | null;
        id: number;
        userId: number;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    findAllDocuments(): Promise<({
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
    findOneDocument(id: number): Promise<{
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
    updateDocument(id: number, updateDocumentInput: UpdateDocumentInput, user: any): Promise<{
        title: string;
        description: string;
        fileUrl: string | null;
        id: number;
        userId: number;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    removeDocument(id: number, user: any): Promise<{
        title: string;
        description: string;
        fileUrl: string | null;
        id: number;
        userId: number;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
}

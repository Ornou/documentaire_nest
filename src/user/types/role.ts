export interface Role {
    name: string;
    description?: string;
    permissions: string[];
    createdAt: Date;
    updatedAt: Date;
}
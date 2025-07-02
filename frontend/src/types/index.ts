export interface User {
  id: number;
  name: string;
  email: string;
  role?: "user" | "admin";
}

export interface Document {
  id: number;
  title: string;
  description: string;
  fileUrl?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthPayload {
  access_token: string;
  user: User;
}

// GraphQL Input Types
export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface CreateDocumentInput {
  title: string;
  description: string;
  fileUrl?: string;
}

export interface UpdateDocumentInput {
  title?: string;
  description?: string;
  fileUrl?: string;
}

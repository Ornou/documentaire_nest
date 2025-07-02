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

export interface AuthResponse {
  access_token: string;
  user: User;
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

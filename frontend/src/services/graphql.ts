import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  gql,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Cookies from "js-cookie";

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:3000/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = Cookies.get("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Authentication Mutations
export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      access_token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($registerInput: RegisterInput!) {
    register(registerInput: $registerInput) {
      access_token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

// GraphQL Queries and Mutations
export const GET_ALL_DOCUMENTS = gql`
  query GetAllDocuments {
    findAllDocuments {
      id
      title
      description
      fileUrl
      userId
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_DOCUMENT = gql`
  mutation CreateDocument($createDocumentInput: CreateDocumentInput!) {
    createDocument(createDocumentInput: $createDocumentInput) {
      id
      title
      description
      fileUrl
      userId
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_DOCUMENT = gql`
  mutation UpdateDocument(
    $id: Int!
    $updateDocumentInput: UpdateDocumentInput!
  ) {
    updateDocument(id: $id, updateDocumentInput: $updateDocumentInput) {
      id
      title
      description
      fileUrl
      userId
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_DOCUMENT = gql`
  mutation RemoveDocument($id: Int!) {
    removeDocument(id: $id) {
      id
    }
  }
`;

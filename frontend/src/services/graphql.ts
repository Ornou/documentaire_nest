import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Cookies from "js-cookie";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const uploadLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:3000/graphql",
  credentials: "include",
  headers: {
    "Apollo-Require-Preflight": "true",
  },
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
  link: authLink.concat(uploadLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          findAllDocuments: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
    query: {
      fetchPolicy: "cache-first",
    },
  },
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
  query FindAllDocuments {
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
    $title: String!
    $description: String
    $file: Upload
  ) {
    updateDocumentWithFile(
      id: $id
      title: $title
      description: $description
      file: $file
    ) {
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
      title
      description
      fileUrl
      userId
      createdAt
      updatedAt
    }
  }
`;

export const UPLOAD_DOCUMENT = gql`
  mutation UploadDocument(
    $title: String!
    $description: String
    $file: Upload
  ) {
    uploadDocument(title: $title, description: $description, file: $file) {
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

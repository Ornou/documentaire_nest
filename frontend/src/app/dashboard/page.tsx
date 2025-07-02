"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import { client, GET_ALL_DOCUMENTS, DELETE_DOCUMENT } from "@/services/graphql";
import {
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { ApolloError } from "@apollo/client";
import DocumentModal from "@/components/DocumentModal";
import ConfirmModal from "@/components/ConfirmModal";

interface Document {
  id: number;
  title: string;
  description: string;
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Modal states
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Dropdown states
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push("/auth/login");
      return;
    }

    fetchDocuments();
  }, [router]);

  useEffect(() => {
    // Filter documents based on search term
    const filtered = documents.filter(
      (doc) =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDocuments(filtered);
  }, [documents, searchTerm]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      console.log("=== FETCHING DOCUMENTS ===");
      console.log("Token exists:", !!authService.getToken());
      console.log(
        "GraphQL URL:",
        process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:3000/graphql"
      );

      const result = await client.query({
        query: GET_ALL_DOCUMENTS,
        fetchPolicy: "network-only", // Force fresh data from server
        errorPolicy: "all",
      });

      console.log("Raw GraphQL result:", result);
      console.log("Documents data:", result.data);
      console.log("Documents array:", result.data?.findAllDocuments);

      if (result.errors) {
        console.error("GraphQL errors in result:", result.errors);
      }

      const documents = result.data?.findAllDocuments || [];
      console.log("Setting documents:", documents.length);
      setDocuments(documents);
    } catch (error: any) {
      console.error("=== ERROR FETCHING DOCUMENTS ===");
      console.error("Full error:", error);
      console.error("Error name:", error?.constructor?.name);
      console.error("Error message:", error?.message);

      if (error instanceof ApolloError) {
        console.error("Apollo GraphQL errors:", error.graphQLErrors);
        console.error("Apollo Network error:", error.networkError);
        console.error("Apollo Error message:", error.message);

        // Check for auth errors
        const hasAuthError = error.graphQLErrors?.some(
          (err) =>
            err.message.includes("Unauthorized") ||
            err.message.includes("Invalid token") ||
            err.extensions?.code === "UNAUTHENTICATED"
        );

        if (hasAuthError) {
          console.log("Authentication error detected, redirecting to login");
          authService.logout();
          router.push("/auth/login");
          return;
        }
      }

      // Set empty array on error to prevent UI issues
      setDocuments([]);
    } finally {
      setLoading(false);
      console.log("=== FETCH COMPLETE ===");
    }
  };

  const handleLogout = () => {
    authService.logout();
    router.push("/auth/login");
  };

  const handleUploadClick = () => {
    setModalMode("create");
    setSelectedDocument(null);
    setIsDocumentModalOpen(true);
  };

  const handleEditClick = (document: Document) => {
    setModalMode("edit");
    setSelectedDocument(document);
    setIsDocumentModalOpen(true);
    setOpenDropdown(null);
  };

  const handleDeleteClick = (document: Document) => {
    setSelectedDocument(document);
    setIsConfirmModalOpen(true);
    setOpenDropdown(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDocument) return;

    setDeleteLoading(true);
    try {
      await client.mutate({
        mutation: DELETE_DOCUMENT,
        variables: {
          id: selectedDocument.id,
        },
        errorPolicy: "all",
        refetchQueries: ["FindAllDocuments"],
      });

      // Remove from local state
      setDocuments((prev) =>
        prev.filter((doc) => doc.id !== selectedDocument.id)
      );
      setIsConfirmModalOpen(false);
      setSelectedDocument(null);
    } catch (err: any) {
      console.error("Delete error:", err);
      console.error("Delete error details:", {
        name: err.name,
        message: err.message,
        graphQLErrors: err.graphQLErrors,
        networkError: err.networkError,
        extraInfo: err.extraInfo,
      });

      if (err instanceof ApolloError) {
        if (err.networkError) {
          console.error("Delete network error details:", err.networkError);
          // @ts-ignore
          if (err.networkError.result) {
            // @ts-ignore
            console.error(
              "Delete network error result:",
              err.networkError.result
            );
          }
        }
      }
      // You might want to show an error toast here
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDocumentSuccess = () => {
    fetchDocuments(); // Refresh the list
  };

  const toggleDropdown = (docId: number) => {
    setOpenDropdown(openDropdown === docId ? null : docId);
  };

  const getFileIcon = (filename: string) => {
    const extension = filename?.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "pdf":
        return (
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case "doc":
      case "docx":
        return (
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case "xls":
      case "xlsx":
        return (
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return (
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-purple-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                DocManager
              </h1>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchDocuments}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Controls */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded ${
                  viewMode === "grid" ? "bg-white shadow-sm" : ""
                }`}
              >
                <Squares2X2Icon
                  className={`h-4 w-4 ${
                    viewMode === "grid" ? "text-gray-900" : "text-gray-500"
                  }`}
                />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded ${
                  viewMode === "list" ? "bg-white shadow-sm" : ""
                }`}
              >
                <ListBulletIcon
                  className={`h-4 w-4 ${
                    viewMode === "list" ? "text-gray-900" : "text-gray-500"
                  }`}
                />
              </button>
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUploadClick}
              className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Upload</span>
            </button>
          </div>
        </div>

        {/* Document Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            {filteredDocuments.length} document
            {filteredDocuments.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Documents Grid/List */}
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No documents found
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by uploading your first document.
            </p>
            <button
              onClick={handleUploadClick}
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Upload Document
            </button>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="document-card relative group">
                {viewMode === "grid" ? (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      {getFileIcon(doc.title)}
                      <div className="flex items-center space-x-2">
                        <div className="text-xs text-gray-500">
                          {formatDate(doc.createdAt)}
                        </div>
                        {/* Actions Dropdown */}
                        <div className="relative">
                          <button
                            onClick={() => toggleDropdown(doc.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded"
                          >
                            <EllipsisVerticalIcon className="w-4 h-4" />
                          </button>
                          {openDropdown === doc.id && (
                            <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10 border">
                              <button
                                onClick={() => handleEditClick(doc)}
                                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <PencilIcon className="w-4 h-4 mr-2" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteClick(doc)}
                                className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <TrashIcon className="w-4 h-4 mr-2" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                      {doc.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {doc.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Document</span>
                      <span>{formatFileSize(1500000)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center space-x-4">
                    {getFileIcon(doc.title)}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {doc.title}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {doc.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-900">
                        {formatFileSize(1500000)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(doc.createdAt)}
                      </div>
                    </div>
                    {/* List Actions */}
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(doc.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      >
                        <EllipsisVerticalIcon className="w-4 h-4" />
                      </button>
                      {openDropdown === doc.id && (
                        <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10 border">
                          <button
                            onClick={() => handleEditClick(doc)}
                            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <PencilIcon className="w-4 h-4 mr-2" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(doc)}
                            className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <TrashIcon className="w-4 h-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Document Modal */}
      <DocumentModal
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
        onSuccess={handleDocumentSuccess}
        document={selectedDocument}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Document"
        message={`Are you sure you want to delete "${selectedDocument?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={deleteLoading}
      />

      {/* Click outside to close dropdowns */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </div>
  );
}

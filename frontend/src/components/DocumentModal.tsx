"use client";

import React, { useState, useEffect } from "react";
import { XMarkIcon, DocumentArrowUpIcon } from "@heroicons/react/24/outline";
import {
  client,
  CREATE_DOCUMENT,
  UPDATE_DOCUMENT,
  UPLOAD_DOCUMENT,
} from "@/services/graphql";
import { ApolloError } from "@apollo/client";

interface Document {
  id: number;
  title: string;
  description: string;
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  document?: Document | null;
  mode: "create" | "edit";
}

export default function DocumentModal({
  isOpen,
  onClose,
  onSuccess,
  document,
  mode,
}: DocumentModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fileUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Ajouté pour gérer le fichier
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize form data when modal opens or document changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && document) {
        setFormData({
          title: document.title,
          description: document.description,
          fileUrl: document.fileUrl || "",
        });
      } else {
        setFormData({
          title: "",
          description: "",
          fileUrl: "",
        });
      }
      setError("");
    }
  }, [isOpen, mode, document]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "create") {
        const variables: any = {
          title: formData.title,
          description: formData.description || undefined,
        };

        // Only include file in variables if it exists
        if (selectedFile) {
          variables.file = selectedFile;
        }

        await client.mutate({
          mutation: UPLOAD_DOCUMENT,
          variables,
          errorPolicy: "all",
          refetchQueries: ["FindAllDocuments"],
        });
      } else if (mode === "edit" && document) {
        const variables: any = {
          id: document.id,
          title: formData.title,
          description: formData.description || undefined,
        };

        // Si un nouveau fichier est sélectionné, l'ajouter aux variables
        if (selectedFile) {
          variables.file = selectedFile;
        } else if (!formData.fileUrl && document.fileUrl) {
          // Si le fichier a été supprimé (fileUrl est vide mais il y avait un fichier avant)
          variables.file = null;
        }

        await client.mutate({
          mutation: UPDATE_DOCUMENT,
          variables,
          errorPolicy: "all",
          refetchQueries: ["FindAllDocuments"],
        });
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Document operation error:", err);
      console.error("Error details:", {
        name: err.name,
        message: err.message,
        graphQLErrors: err.graphQLErrors,
        networkError: err.networkError,
        extraInfo: err.extraInfo,
      });

      if (err instanceof ApolloError) {
        if (err.networkError) {
          console.error("Network error details:", err.networkError);
          // @ts-ignore
          if (err.networkError.result) {
            // @ts-ignore
            console.error("Network error result:", err.networkError.result);
          }
        }

        const errorMessage =
          err.graphQLErrors?.[0]?.message ||
          err.networkError?.message ||
          err.message ||
          "Operation failed";
        setError(errorMessage);
      } else {
        setError("Operation failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFormData((prev) => ({
        ...prev,
        fileUrl: file.name,
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                <DocumentArrowUpIcon className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                {mode === "create" ? "Upload Document" : "Edit Document"}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter document title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter document description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                required
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File{" "}
                {mode === "create"
                  ? "(Optional)"
                  : "(Optional - Leave empty to keep current)"}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-400 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  name="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <DocumentArrowUpIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    {formData.fileUrl
                      ? formData.fileUrl
                      : "Click to select a file"}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    PDF, DOC, XLS, Images up to 10MB
                  </span>
                </label>
              </div>
            </div>

            {/* Current File Info (Edit mode) */}
            {mode === "edit" && document?.fileUrl && (
              <div className="bg-gray-50 p-3 rounded-lg flex items-center space-x-4">
                <div>
                  <p className="text-sm text-gray-600">
                    Current file:{" "}
                    <span className="font-medium">{document.fileUrl}</span>
                  </p>
                  {/* File preview for images */}
                  {/\.(jpg|jpeg|png|gif)$/i.test(document.fileUrl) && (
                    <img
                      src={
                        document.fileUrl.startsWith("http")
                          ? document.fileUrl
                          : `/uploads/${document.fileUrl}`
                      }
                      alt="Preview"
                      className="mt-2 max-h-32 rounded border"
                    />
                  )}
                </div>
                <a
  href={document.fileUrl.startsWith('http') ? document.fileUrl : `http://localhost:3000${document.fileUrl}`}
  download
  target="_blank"
  rel="noopener noreferrer"
  className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
>
  Download
</a>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Saving..."
                  : mode === "create"
                  ? "Upload"
                  : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

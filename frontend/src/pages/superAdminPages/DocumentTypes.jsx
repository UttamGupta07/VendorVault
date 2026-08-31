import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  FileText,
  X,
  Loader2,
} from "lucide-react";

import axiosInstance from "../../api/axiosInstance";

const DocumentTypes = () => {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // ==========================================
  // FETCH DOCUMENT TYPES
  // ==========================================

  const fetchDocumentTypes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get("/api/document-types ");

      setDocumentTypes(response.data.documentTypes || []);
    } catch (err) {
      console.error("Failed to fetch document types:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load document types"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // OPEN CREATE MODAL
  // ==========================================

  const openCreateModal = () => {
    setEditingDocument(null);

    setFormData({
      name: "",
      description: "",
    });

    setShowModal(true);
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const openEditModal = (document) => {
    setEditingDocument(document);

    setFormData({
      name: document.name || "",
      description: document.description || "",
    });

    setShowModal(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    if (submitting) return;

    setShowModal(false);
    setEditingDocument(null);

    setFormData({
      name: "",
      description: "",
    });
  };

  // ==========================================
  // CREATE / UPDATE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      if (editingDocument) {
        // UPDATE
        await axiosInstance.put(
          `/api/document-types/${editingDocument._id}`,
          {
            name: formData.name.trim(),
            description: formData.description.trim(),
          }
        );
      } else {
        // CREATE
        await axiosInstance.post("/api/document-types", {
          name: formData.name.trim(),
          description: formData.description.trim(),
        });
      }

      closeModal();

      await fetchDocumentTypes();
    } catch (err) {
      console.error("Document type save error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to save document type"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // TOGGLE ACTIVE STATUS
  // ==========================================

  const toggleStatus = async (document) => {
    try {
      setError("");

      await axiosInstance.put(
        `/document-types/${document._id}`,
        {
          isActive: !document.isActive,
        }
      );

      await fetchDocumentTypes();
    } catch (err) {
      console.error("Status update error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update document status"
      );
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (document) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${document.name}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await axiosInstance.delete(
        `/api/document-types/${document._id}`
      );

      await fetchDocumentTypes();
    } catch (err) {
      console.error("Delete document type error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete document type"
      );
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredDocuments = documentTypes.filter((document) => {
    const searchValue = search.toLowerCase();

    return (
      document.name?.toLowerCase().includes(searchValue) ||
      document.description?.toLowerCase().includes(searchValue)
    );
  });

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* HEADER */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Document Types
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage the documents that can be required for vendors.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Document Type
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-5 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>

          <button
            onClick={() => setError("")}
            className="text-red-500 hover:text-red-700"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* STAT CARD */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Documents
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {documentTypes.length}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3">
              <FileText className="text-blue-600" size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Active Documents
          </p>

          <p className="mt-1 text-2xl font-bold text-green-600">
            {
              documentTypes.filter(
                (document) => document.isActive
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Inactive Documents
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-500">
            {
              documentTypes.filter(
                (document) => !document.isActive
              ).length
            }
          </p>
        </div>
      </div>

      {/* SEARCH */}

      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search document types..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* TABLE */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Document
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Description
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Created
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center"
                  >
                    <FileText
                      size={40}
                      className="mx-auto mb-3 text-gray-300"
                    />

                    <p className="text-sm font-medium text-gray-600">
                      No document types found
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Create a document type to get started.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((document) => (
                  <tr
                    key={document._id}
                    className="transition hover:bg-gray-50"
                  >
                    {/* DOCUMENT */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-blue-50 p-2">
                          <FileText
                            size={18}
                            className="text-blue-600"
                          />
                        </div>

                        <div>
                          <p className="font-medium text-gray-900">
                            {document.name}
                          </p>

                          <p className="text-xs text-gray-400">
                            ID: {document._id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* DESCRIPTION */}

                    <td className="max-w-xs px-6 py-4">
                      <p className="truncate text-sm text-gray-600">
                        {document.description || "No description"}
                      </p>
                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          toggleStatus(document)
                        }
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          document.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {document.isActive
                          ? "Active"
                          : "Inactive"}
                      </button>
                    </td>

                    {/* CREATED */}

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {document.createdAt
                        ? new Date(
                            document.createdAt
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    {/* ACTIONS */}

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            openEditModal(document)
                          }
                          className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                          title="Edit"
                        >
                          <Edit size={17} />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(document)
                          }
                          className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingDocument
                    ? "Edit Document Type"
                    : "Create Document Type"}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {editingDocument
                    ? "Update the document type details."
                    : "Add a new document type for your vendors."}
                </p>
              </div>

              <button
                onClick={closeModal}
                disabled={submitting}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              {/* NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Document Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. GST Certificate"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe this document type..."
                  rows={4}
                  className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting && (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  {editingDocument
                    ? "Update Document"
                    : "Create Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentTypes;
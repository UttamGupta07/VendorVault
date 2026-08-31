import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Settings,
  X,
  Loader2,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import axiosInstance from "../../api/axiosInstance";

const ServiceTypes = () => {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [expandedService, setExpandedService] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    requiredDocuments: [],
  });

  // =====================================================
  // FETCH SERVICE TYPES
  // =====================================================

  const fetchServiceTypes = async () => {
    try {
      const response = await axiosInstance.get("/api/service-types");

      setServiceTypes(response.data.serviceTypes || []);
    } catch (err) {
      console.error("Fetch service types error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load service types"
      );
    }
  };

  // =====================================================
  // FETCH DOCUMENT TYPES
  // =====================================================

  const fetchDocumentTypes = async () => {
    try {
      const response = await axiosInstance.get("/api/document-types");

      setDocumentTypes(
        (response.data.documentTypes || []).filter(
          (document) => document.isActive
        )
      );
    } catch (err) {
      console.error("Fetch document types error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load document types"
      );
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        await Promise.all([
          fetchServiceTypes(),
          fetchDocumentTypes(),
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // =====================================================
  // FORM INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // OPEN CREATE MODAL
  // =====================================================

  const openCreateModal = () => {
    setEditingService(null);

    setFormData({
      name: "",
      description: "",
      requiredDocuments: [],
    });

    setError("");
    setShowModal(true);
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const openEditModal = (service) => {
    setEditingService(service);

    const documents =
      service.requiredDocuments?.map((item) => ({
        documentTypeId:
          item.documentTypeId?._id ||
          item.documentTypeId,

        isRequired:
          item.isRequired !== undefined
            ? item.isRequired
            : true,

        expiryRequired:
          item.expiryRequired !== undefined
            ? item.expiryRequired
            : false,

        reminderDays:
          item.reminderDays || [30, 15, 7],
      })) || [];

    setFormData({
      name: service.name || "",
      description: service.description || "",
      requiredDocuments: documents,
    });

    setError("");
    setShowModal(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {
    if (submitting) return;

    setShowModal(false);
    setEditingService(null);

    setFormData({
      name: "",
      description: "",
      requiredDocuments: [],
    });
  };

  // =====================================================
  // ADD DOCUMENT
  // =====================================================

  const addDocument = (documentTypeId) => {
    if (!documentTypeId) return;

    const alreadyExists =
      formData.requiredDocuments.some(
        (doc) => doc.documentTypeId === documentTypeId
      );

    if (alreadyExists) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      requiredDocuments: [
        ...prev.requiredDocuments,
        {
          documentTypeId,
          isRequired: true,
          expiryRequired: false,
          reminderDays: [30, 15, 7],
        },
      ],
    }));
  };

  // =====================================================
  // REMOVE DOCUMENT
  // =====================================================

  const removeDocument = (documentTypeId) => {
    setFormData((prev) => ({
      ...prev,
      requiredDocuments:
        prev.requiredDocuments.filter(
          (doc) =>
            doc.documentTypeId !== documentTypeId
        ),
    }));
  };

  // =====================================================
  // UPDATE DOCUMENT CONFIG
  // =====================================================

  const updateDocumentConfig = (
    documentTypeId,
    field,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      requiredDocuments:
        prev.requiredDocuments.map((doc) =>
          doc.documentTypeId === documentTypeId
            ? {
                ...doc,
                [field]: value,
              }
            : doc
        ),
    }));
  };

  // =====================================================
  // UPDATE REMINDER DAYS
  // =====================================================

  const updateReminderDays = (
    documentTypeId,
    value
  ) => {
    const days = value
      .split(",")
      .map((day) => Number(day.trim()))
      .filter(
        (day) => !isNaN(day) && day > 0
      );

    updateDocumentConfig(
      documentTypeId,
      "reminderDays",
      days
    );
  };

  // =====================================================
  // CREATE / UPDATE SERVICE TYPE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Service type name is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        requiredDocuments:
          formData.requiredDocuments,
      };

      if (editingService) {
        await axiosInstance.put(
          `/api/service-types/${editingService._id}`,
          payload
        );
      } else {
        await axiosInstance.post(
          "/api/service-types",
          payload
        );
      }

      closeModal();

      await fetchServiceTypes();
    } catch (err) {
      console.error("Save service type error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to save service type"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // TOGGLE STATUS
  // =====================================================

  const toggleStatus = async (service) => {
    try {
      setError("");

      await axiosInstance.put(
        `/api/service-types/${service._id}`,
        {
          isActive: !service.isActive,
        }
      );

      await fetchServiceTypes();
    } catch (err) {
      console.error("Status update error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update service type status"
      );
    }
  };

  // =====================================================
  // DELETE SERVICE TYPE
  // =====================================================

  const handleDelete = async (service) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${service.name}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await axiosInstance.delete(
        `/api/service-types/${service._id}`
      );

      await fetchServiceTypes();
    } catch (err) {
      console.error("Delete service type error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete service type"
      );
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredServices = serviceTypes.filter(
    (service) => {
      const value = search.toLowerCase();

      return (
        service.name
          ?.toLowerCase()
          .includes(value) ||
        service.description
          ?.toLowerCase()
          .includes(value)
      );
    }
  );

  // =====================================================
  // GET DOCUMENT NAME
  // =====================================================

  const getDocumentName = (documentId) => {
    const document = documentTypes.find(
      (doc) => doc._id === documentId
    );

    return document?.name || "Unknown Document";
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2
          className="animate-spin text-blue-600"
          size={32}
        />
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* HEADER */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Service Types
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Define services and the documents required
            for each service.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Service Type
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

      {/* STATS */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Service Types
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            {serviceTypes.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Active
          </p>

          <p className="mt-1 text-2xl font-bold text-green-600">
            {
              serviceTypes.filter(
                (service) => service.isActive
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Inactive
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-500">
            {
              serviceTypes.filter(
                (service) => !service.isActive
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
            placeholder="Search service types..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* SERVICE TYPE TABLE */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Service Type
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Required Documents
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
              {filteredServices.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center"
                  >
                    <Settings
                      size={40}
                      className="mx-auto mb-3 text-gray-300"
                    />

                    <p className="text-sm font-medium text-gray-600">
                      No service types found
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Create a service type to get started.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <React.Fragment key={service._id}>
                    <tr className="transition hover:bg-gray-50">
                      {/* SERVICE */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-blue-50 p-2">
                            <Settings
                              size={18}
                              className="text-blue-600"
                            />
                          </div>

                          <div>
                            <p className="font-medium text-gray-900">
                              {service.name}
                            </p>

                            <p className="max-w-xs truncate text-xs text-gray-400">
                              {service.description ||
                                "No description"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* DOCUMENT COUNT */}

                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            setExpandedService(
                              expandedService ===
                                service._id
                                ? null
                                : service._id
                            )
                          }
                          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                        >
                          <FileText size={16} />

                          {service.requiredDocuments
                            ?.length || 0}{" "}
                          documents

                          {expandedService ===
                          service._id ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </button>
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            toggleStatus(service)
                          }
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            service.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {service.isActive
                            ? "Active"
                            : "Inactive"}
                        </button>
                      </td>

                      {/* CREATED */}

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {service.createdAt
                          ? new Date(
                              service.createdAt
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              openEditModal(service)
                            }
                            className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                            title="Edit"
                          >
                            <Edit size={17} />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(service)
                            }
                            className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* EXPANDED DOCUMENTS */}

                    {expandedService ===
                      service._id && (
                      <tr>
                        <td
                          colSpan="5"
                          className="bg-gray-50 px-6 py-5"
                        >
                          <div className="rounded-lg border border-gray-200 bg-white p-4">
                            <h3 className="mb-3 text-sm font-semibold text-gray-900">
                              Required Documents
                            </h3>

                            {service.requiredDocuments
                              ?.length > 0 ? (
                              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {service.requiredDocuments.map(
                                  (doc) => (
                                    <div
                                      key={
                                        doc._id ||
                                        doc.documentTypeId?._id
                                      }
                                      className="rounded-lg border border-gray-200 p-3"
                                    >
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="flex gap-2">
                                          <FileText
                                            size={17}
                                            className="mt-0.5 text-blue-600"
                                          />

                                          <div>
                                            <p className="text-sm font-medium text-gray-900">
                                              {doc
                                                .documentTypeId
                                                ?.name ||
                                                getDocumentName(
                                                  doc.documentTypeId
                                                )}
                                            </p>

                                            <div className="mt-2 flex flex-wrap gap-1">
                                              {doc.isRequired && (
                                                <span className="rounded bg-red-50 px-2 py-0.5 text-[10px] text-red-600">
                                                  Required
                                                </span>
                                              )}

                                              {doc.expiryRequired && (
                                                <span className="rounded bg-orange-50 px-2 py-0.5 text-[10px] text-orange-600">
                                                  Expiry
                                                  tracked
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {doc.expiryRequired &&
                                        doc.reminderDays
                                          ?.length >
                                          0 && (
                                          <p className="mt-2 text-xs text-gray-500">
                                            Reminders:{" "}
                                            {doc.reminderDays.join(
                                              ", "
                                            )}{" "}
                                            days before
                                            expiry
                                          </p>
                                        )}
                                    </div>
                                  )
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">
                                No documents configured.
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =================================================
          CREATE / EDIT MODAL
          ================================================= */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-xl">
            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingService
                    ? "Edit Service Type"
                    : "Create Service Type"}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Configure the documents required for
                  this service.
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
              className="space-y-6 p-6"
            >
              {/* NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Service Type Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Security Services"
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
                  placeholder="Describe this service..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* DOCUMENT SELECT */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Required Documents
                  </label>

                  <span className="text-xs text-gray-400">
                    {
                      formData.requiredDocuments
                        .length
                    }{" "}
                    selected
                  </span>
                </div>

                {documentTypes.length === 0 ? (
                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                    <p className="text-sm font-medium text-yellow-800">
                      No active document types available.
                    </p>

                    <p className="mt-1 text-xs text-yellow-700">
                      Create a Document Type first before
                      creating a service type.
                    </p>
                  </div>
                ) : (
                  <select
                    value=""
                    onChange={(e) =>
                      addDocument(e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">
                      + Add a document
                    </option>

                    {documentTypes
                      .filter(
                        (document) =>
                          !formData.requiredDocuments.some(
                            (selected) =>
                              selected.documentTypeId ===
                              document._id
                          )
                      )
                      .map((document) => (
                        <option
                          key={document._id}
                          value={document._id}
                        >
                          {document.name}
                        </option>
                      ))}
                  </select>
                )}
              </div>

              {/* SELECTED DOCUMENTS */}

              {formData.requiredDocuments.length >
                0 && (
                <div className="space-y-3">
                  {formData.requiredDocuments.map(
                    (document) => {
                      const documentInfo =
                        documentTypes.find(
                          (item) =>
                            item._id ===
                            document.documentTypeId
                        );

                      return (
                        <div
                          key={document.documentTypeId}
                          className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                        >
                          {/* DOCUMENT HEADER */}

                          <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="rounded-lg bg-blue-50 p-2">
                                <FileText
                                  size={18}
                                  className="text-blue-600"
                                />
                              </div>

                              <div>
                                <p className="text-sm font-semibold text-gray-900">
                                  {documentInfo?.name ||
                                    "Document"}
                                </p>

                                <p className="text-xs text-gray-500">
                                  Configure requirements
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                removeDocument(
                                  document.documentTypeId
                                )
                              }
                              className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                              title="Remove document"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>

                          {/* CONFIGURATION */}

                          <div className="grid gap-4 sm:grid-cols-2">
                            {/* REQUIRED */}

                            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
                              <input
                                type="checkbox"
                                checked={
                                  document.isRequired
                                }
                                onChange={(e) =>
                                  updateDocumentConfig(
                                    document.documentTypeId,
                                    "isRequired",
                                    e.target.checked
                                  )
                                }
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />

                              <div>
                                <p className="text-sm font-medium text-gray-800">
                                  Required
                                </p>

                                <p className="text-xs text-gray-500">
                                  Vendor must upload this
                                  document
                                </p>
                              </div>
                            </label>

                            {/* EXPIRY */}

                            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
                              <input
                                type="checkbox"
                                checked={
                                  document.expiryRequired
                                }
                                onChange={(e) =>
                                  updateDocumentConfig(
                                    document.documentTypeId,
                                    "expiryRequired",
                                    e.target.checked
                                  )
                                }
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />

                              <div>
                                <p className="text-sm font-medium text-gray-800">
                                  Track Expiry
                                </p>

                                <p className="text-xs text-gray-500">
                                  Track the document's
                                  expiry date
                                </p>
                              </div>
                            </label>
                          </div>

                          {/* REMINDER DAYS */}

                          {document.expiryRequired && (
                            <div className="mt-4">
                              <label className="mb-2 block text-sm font-medium text-gray-700">
                                Reminder Days
                              </label>

                              <input
                                type="text"
                                value={document.reminderDays.join(
                                  ", "
                                )}
                                onChange={(e) =>
                                  updateReminderDays(
                                    document.documentTypeId,
                                    e.target.value
                                  )
                                }
                                placeholder="30, 15, 7"
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                              />

                              <p className="mt-1 text-xs text-gray-400">
                                Example: 30, 15, 7 means
                                reminders will be sent 30,
                                15 and 7 days before expiry.
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              )}

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

                  {editingService
                    ? "Update Service Type"
                    : "Create Service Type"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceTypes;
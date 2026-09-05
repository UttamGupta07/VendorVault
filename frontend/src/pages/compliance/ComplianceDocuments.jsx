import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FileText,
  Search,
  Eye,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

const ComplianceDocuments = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:5000/api/documents/pending-review",
        {
          withCredentials: true,
        }
      );

      setDocuments(response.data.documents || []);
    } catch (error) {
      console.error("Failed to fetch documents:", error);

      setError(
        error.response?.data?.message ||
        "Failed to load documents"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const filteredDocuments = documents.filter((document) => {
    const documentName =
      document.originalFileName?.toLowerCase() || "";

    const vendorName =
      document.vendorId?.name?.toLowerCase() || "";

    const documentType =
      document.documentTypeId?.name?.toLowerCase() || "";

    const searchValue = search.toLowerCase();

    return (
      documentName.includes(searchValue) ||
      vendorName.includes(searchValue) ||
      documentType.includes(searchValue)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Documents
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Review documents uploaded by vendors
        </p>
      </div>

      {/* Search + Refresh */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div className="relative w-full sm:max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search document or vendor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <button
          onClick={fetchDocuments}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
        </div>
      ) : filteredDocuments.length === 0 ? (
        /* Empty */
        <div className="rounded-xl border border-gray-200 bg-white py-16 text-center">
          <FileText
            size={45}
            className="mx-auto mb-4 text-gray-300"
          />

          <h3 className="text-lg font-semibold text-gray-800">
            No documents found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            There are no documents waiting for review.
          </p>
        </div>
      ) : (
        /* Table */
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="overflow-x-auto">
            <table className="w-full text-left">

              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                    Document
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                    Vendor
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                    Document Type
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                    Extraction
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                    Uploaded
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {filteredDocuments.map((document) => (
                  <tr
                    key={document._id}
                    className="hover:bg-gray-50"
                  >

                    {/* Document */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                          <FileText
                            size={20}
                            className="text-blue-600"
                          />
                        </div>

                        <div>
                          <p className="max-w-xs truncate font-medium text-gray-900">
                            {document.originalFileName}
                          </p>

                          <p className="text-xs text-gray-500">
                            Version {document.version}
                          </p>
                        </div>

                      </div>
                    </td>

                    {/* Vendor */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {document.vendorId?.name || "Unknown Vendor"}
                      </p>

                      <p className="text-xs text-gray-500">
                        {document.vendorId?.email || ""}
                      </p>
                    </td>

                    {/* Document Type */}
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {document.documentTypeId?.name ||
                        "Unknown"}
                    </td>

                    {/* Extraction */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        Completed
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(
                        document.createdAt
                      ).toLocaleDateString()}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          navigate(`/compliance/documents/${document._id}`)
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        <Eye size={16} />
                        Review
                      </button>
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceDocuments;
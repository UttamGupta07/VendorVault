const defaultRoles = {
  SUPER_ADMIN: {
    displayName: "Super Admin",
    description: "Full access to the organization",
    permissions: ["*"],
  },

  COMPLIANCE_OFFICER: {
    displayName: "Compliance Officer",
    description:
      "Manages vendors, documents and compliance activities",

    permissions: [
      // Vendors
      "vendors.view",
      "vendors.create",
      "vendors.edit",
      "vendors.suspend",

      // Documents
      "documents.view",
      "documents.download",
      "documents.review",
      "documents.approve",
      "documents.reject",

      // Compliance
      "compliance.view",
      "compliance.review",
      "compliance.approve",
      "compliance.reject",

      // Expiry
      "expiry.view",

      // Alerts
      "alerts.view",
      "alerts.resolve",

      // Reports
      "reports.view",
      "reports.generate",
      "reports.export",

      // Audit
      "audit.view",
    ],
  },

  AUDITOR: {
    displayName: "Auditor",
    description:
      "Read-only access to compliance and audit information",

    permissions: [
      "users.view",

      "vendors.view",

      "documents.view",
      "documents.download",

      "compliance.view",

      "expiry.view",

      "alerts.view",

      "reports.view",
      "reports.export",

      "audit.view",
      "audit.export",
    ],
  },

  VENDOR: {
    displayName: "Vendor",
    description:
      "Access limited to vendor's own information",

    permissions: [
      "vendors.view",
      "vendors.edit",

      "documents.view",
      "documents.upload",
      "documents.download",

      "compliance.view",

      "expiry.view",

      "alerts.view",
    ],
  },
};

module.exports = defaultRoles;
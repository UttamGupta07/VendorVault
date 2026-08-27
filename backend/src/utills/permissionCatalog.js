const PERMISSIONS = [
  // ==========================================
  // USER MANAGEMENT
  // ==========================================

  {
    key: "users.view",
    name: "View Users",
    category: "User Management",
  },
  {
    key: "users.create",
    name: "Create Users",
    category: "User Management",
  },
  {
    key: "users.edit",
    name: "Edit Users",
    category: "User Management",
  },
  {
    key: "users.delete",
    name: "Delete Users",
    category: "User Management",
  },
  {
    key: "users.changeRole",
    name: "Change User Role",
    category: "User Management",
  },
  {
    key: "users.suspend",
    name: "Suspend Users",
    category: "User Management",
  },

  // ==========================================
  // VENDOR MANAGEMENT
  // ==========================================

  {
    key: "vendors.view",
    name: "View Vendors",
    category: "Vendor Management",
  },
  {
    key: "vendors.create",
    name: "Create Vendors",
    category: "Vendor Management",
  },
  {
    key: "vendors.edit",
    name: "Edit Vendors",
    category: "Vendor Management",
  },
  {
    key: "vendors.delete",
    name: "Delete Vendors",
    category: "Vendor Management",
  },
  {
    key: "vendors.suspend",
    name: "Suspend Vendors",
    category: "Vendor Management",
  },

  // ==========================================
  // DOCUMENT MANAGEMENT
  // ==========================================

  {
    key: "documents.view",
    name: "View Documents",
    category: "Document Management",
  },
  {
    key: "documents.upload",
    name: "Upload Documents",
    category: "Document Management",
  },
  {
    key: "documents.download",
    name: "Download Documents",
    category: "Document Management",
  },
  {
    key: "documents.review",
    name: "Review Documents",
    category: "Document Management",
  },
  {
    key: "documents.approve",
    name: "Approve Documents",
    category: "Document Management",
  },
  {
    key: "documents.reject",
    name: "Reject Documents",
    category: "Document Management",
  },
  {
    key: "documents.delete",
    name: "Delete Documents",
    category: "Document Management",
  },

  // ==========================================
  // COMPLIANCE
  // ==========================================

  {
    key: "compliance.view",
    name: "View Compliance",
    category: "Compliance Management",
  },
  {
    key: "compliance.review",
    name: "Review Compliance",
    category: "Compliance Management",
  },
  {
    key: "compliance.approve",
    name: "Approve Compliance",
    category: "Compliance Management",
  },
  {
    key: "compliance.reject",
    name: "Reject Compliance",
    category: "Compliance Management",
  },
  {
    key: "compliance.override",
    name: "Override Compliance",
    category: "Compliance Management",
  },

  // ==========================================
  // EXPIRY
  // ==========================================

  {
    key: "expiry.view",
    name: "View Expiry Tracker",
    category: "Expiry Management",
  },
  {
    key: "expiry.configure",
    name: "Configure Expiry Rules",
    category: "Expiry Management",
  },

  // ==========================================
  // ALERTS
  // ==========================================

  {
    key: "alerts.view",
    name: "View Alerts",
    category: "Alert Management",
  },
  {
    key: "alerts.resolve",
    name: "Resolve Alerts",
    category: "Alert Management",
  },
  {
    key: "alerts.configure",
    name: "Configure Alert Rules",
    category: "Alert Management",
  },

  // ==========================================
  // REPORTS
  // ==========================================

  {
    key: "reports.view",
    name: "View Reports",
    category: "Reports",
  },
  {
    key: "reports.generate",
    name: "Generate Reports",
    category: "Reports",
  },
  {
    key: "reports.export",
    name: "Export Reports",
    category: "Reports",
  },

  // ==========================================
  // AUDIT
  // ==========================================

  {
    key: "audit.view",
    name: "View Audit Logs",
    category: "Audit",
  },
  {
    key: "audit.export",
    name: "Export Audit Logs",
    category: "Audit",
  },
];

const PERMISSION_KEYS = PERMISSIONS.map(
  (permission) => permission.key
);

module.exports = {
  PERMISSIONS,
  PERMISSION_KEYS,
};
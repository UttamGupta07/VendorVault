# VendorVault

> **AI-Powered B2B Vendor Compliance & Document-Expiry Management Platform**

VendorVault is a full-stack B2B SaaS platform designed to help organizations manage vendor compliance documents, automatically extract important information from uploaded documents using AI, monitor document expiry dates, and notify the relevant users before compliance issues occur.

Instead of managing hundreds of vendor documents through spreadsheets, emails, and shared drives, VendorVault provides a centralized platform for **vendor onboarding, document management, AI-powered extraction, compliance monitoring, automated alerts, document versioning, and audit tracking**.

---

## 🚀 Problem Statement

Organizations often work with hundreds of vendors and require each vendor to submit important documents such as:

- GST Certificates
- Business Licenses
- Insurance Certificates
- NDAs
- Contracts
- Certifications
- Other regulatory/compliance documents

Managing these documents manually can lead to:

- Missed expiry dates
- Missing documents
- Outdated documents
- Manual verification
- Compliance risks
- Audit difficulties
- Scattered files across multiple systems

### VendorVault solves this by providing a centralized compliance platform.

---

## 💡 Key Idea

VendorVault doesn't just **store documents**.

It attempts to **understand documents**.

When a vendor uploads a document:

```text
Document Upload
      ↓
Cloud Storage
      ↓
PDF/Text Processing
      ↓
LLM-based Extraction
      ↓
Structured Metadata
      ↓
Compliance Review
      ↓
Expiry Monitoring
      ↓
Automated Alerts
```

The system can extract information such as:

```json
{
  "documentType": "Insurance Certificate",
  "expiryDate": "2027-03-15",
  "keyClauses": [
    "Annual renewal required"
  ],
  "riskFlags": []
}
```

The extracted information is then stored alongside the original document.

---

# ✨ Features

## 🔐 Authentication & Authorization

- User registration and login
- JWT-based authentication
- Access and refresh tokens
- Secure password hashing
- Role-Based Access Control (RBAC)
- Organization-scoped authorization

---

## 🏢 Organization Management

Organizations can:

- Manage their users
- Add and manage vendors
- Define compliance policies
- Monitor overall compliance health
- Generate compliance reports

VendorVault is designed with **multi-tenancy** in mind, ensuring that organizations can only access their own data.

---

## 👥 Vendor Management

Compliance teams can:

- Add vendors
- Edit vendor information
- View vendor profiles
- Track vendor compliance
- View submitted documents
- Monitor missing documents
- Monitor expiring documents

Vendors can access and manage only their own documents.

---

## 📁 Document Management

Vendors can upload compliance documents such as:

- PDF
- DOC/DOCX
- Images

The system maintains:

- Document metadata
- Upload information
- Approval status
- Expiry information
- Document versions
- Audit history

---

## 🤖 AI-Powered Document Extraction

VendorVault uses an LLM-based extraction pipeline to identify important information from uploaded documents.

The system can extract:

- Document type
- Expiry date
- Important clauses
- Risk indicators
- Other configurable metadata

Example:

```text
Insurance Certificate
        ↓
AI Processing
        ↓
Document Type → Insurance
Expiry Date  → 15 March 2027
Risk Flags   → None
```

AI-generated information is subject to **human review before final compliance approval**.

---

## 📊 Compliance Dashboard

The dashboard provides an overview of organizational compliance.

Example:

```text
Total Vendors       250

Compliant           180
At Risk              40
Non-Compliant        20
Pending Review       10
```

Compliance officers can quickly identify vendors requiring attention.

---

## 📈 Compliance Score

Vendor compliance can be calculated based on required documents.

Example:

```text
GST Certificate       ✓
Insurance             ✓
Business License      ✓
NDA                   ✕

Compliance Score: 75%
Status: At Risk
```

Organizations can define which documents are mandatory for different vendor categories.

---

## ⏰ Automated Expiry Alerts

VendorVault continuously monitors document expiry dates.

Example reminder schedule:

```text
30 Days Before Expiry → Reminder
15 Days Before Expiry → Reminder
7 Days Before Expiry  → Urgent Reminder
1 Day Before Expiry   → Critical Reminder
After Expiry          → Expired Alert
```

Alerts can be delivered through:

- Email
- In-app notifications

The primary recipients are:

- Vendors
- Compliance Officers

Organization-level alerts can also be provided to administrators.

---

## 🔄 Document Versioning

Old documents are not simply deleted when vendors upload renewals.

Example:

```text
Insurance Certificate

Version 1
Uploaded: 2026
Expiry:   2027
Status:   Expired

Version 2
Uploaded: 2027
Expiry:   2028
Status:   Approved
```

This preserves historical information for auditing.

---

## 📝 Audit Logs

VendorVault records important actions performed within the system.

Examples:

```text
Vendor uploaded document
AI extraction completed
Document approved
Document rejected
Document version created
Reminder sent
User accessed document
```

This provides a complete compliance history.

---

## 👤 User Roles

VendorVault supports multiple roles.

| Role | Description |
|---|---|
| **Super Admin** | Manages organization, users, policies and overall compliance |
| **Compliance Officer** | Reviews documents and monitors vendor compliance |
| **Vendor** | Uploads and manages their own compliance documents |
| **Auditor** | Read-only access to documents, reports and audit history |

### Permission Example

| Action | Super Admin | Compliance Officer | Vendor | Auditor |
|---|:---:|:---:|:---:|:---:|
| View Vendors | ✅ | ✅ | ❌ | ✅ |
| Add Vendor | ✅ | ✅ | ❌ | ❌ |
| Upload Document | ✅ | ✅ | ✅ | ❌ |
| Approve Document | ✅ | ✅ | ❌ | ❌ |
| Delete Document | ✅ | ✅ | ❌ | ❌ |
| View Audit Logs | ✅ | ✅ | ❌ | ✅ |
| Modify Policies | ✅ | ✅ | ❌ | ❌ |
| Generate Reports | ✅ | ✅ | ❌ | ✅ |

---

# 🏗️ System Architecture

```text
                         ┌──────────────────┐
                         │      React       │
                         │   Tailwind CSS   │
                         └────────┬─────────┘
                                  │
                                  │ REST API
                                  ▼
                         ┌──────────────────┐
                         │    Express.js    │
                         │    REST API      │
                         └────────┬─────────┘
                                  │
                 ┌────────────────┼────────────────┐
                 │                │                │
                 ▼                ▼                ▼
           ┌───────────┐   ┌────────────┐   ┌──────────────┐
           │ MongoDB   │   │ Redis +    │   │ Cloud        │
           │           │   │ BullMQ     │   │ Storage      │
           └───────────┘   └─────┬──────┘   └──────────────┘
                                 │
                                 ▼
                         ┌─────────────────┐
                         │ Background      │
                         │ Workers         │
                         └────────┬────────┘
                                  │
                                  ▼
                           ┌────────────┐
                           │ LLM API    │
                           └────────────┘
                                  │
                                  ▼
                         Email / Notifications
```

---

# 🧱 Backend Architecture

VendorVault follows a layered backend architecture:

```text
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Database
```

### Example

```text
POST /api/vendors
        ↓
Vendor Route
        ↓
Authentication Middleware
        ↓
Authorization Middleware
        ↓
Vendor Controller
        ↓
Vendor Service
        ↓
Vendor Repository
        ↓
MongoDB
```

This separation improves:

- Maintainability
- Testability
- Scalability
- Code organization

---

# 🗄️ Database Design

VendorVault uses MongoDB.

Main collections:

```text
users
organizations
vendors
documents
alerts
auditLogs
compliancePolicies
```

### Relationship Overview

```text
Organization
     │
     ├── Users
     │
     ├── Vendors
     │      │
     │      └── Documents
     │
     ├── Compliance Policies
     │
     ├── Alerts
     │
     └── Audit Logs
```

Each organization-scoped resource contains an `organizationId` to maintain tenant isolation.

---

# 🔌 REST API

Main API modules include:

```text
/api/auth
/api/orgs
/api/vendors
/api/documents
/api/alerts
/api/reports
```

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

### Vendors

```http
GET    /api/vendors
POST   /api/vendors
GET    /api/vendors/:id
PUT    /api/vendors/:id
DELETE /api/vendors/:id
```

### Documents

```http
POST /api/documents
GET  /api/documents
GET  /api/documents/:id
POST /api/documents/:id/extract
POST /api/documents/:id/version
```

### Alerts

```http
GET /api/alerts
PUT /api/alerts/:id/read
```

### Reports

```http
GET /api/reports/compliance-summary
```

---

# ⚙️ Background Processing

Expensive and scheduled operations are handled asynchronously.

### Document Extraction

```text
Upload Document
      ↓
Create Extraction Job
      ↓
Redis Queue
      ↓
BullMQ Worker
      ↓
Process Document
      ↓
LLM Extraction
      ↓
Save Metadata
```

### Expiry Monitoring

```text
Scheduled Job
      ↓
Find Documents Near Expiry
      ↓
Create Alerts
      ↓
Send Notifications
      ↓
Update Alert Status
```

This prevents long-running operations from blocking API requests.

---

# 🔒 Security

Security is an important part of VendorVault because the platform handles business documents.

Implemented/planned security measures include:

- JWT authentication
- Role-Based Access Control
- Organization-level authorization
- Password hashing
- File type validation
- File size restrictions
- Signed URLs for private files
- API rate limiting
- Audit logging
- Secure environment variables
- Vendor-level document isolation
- Virus scanning integration hook

---

# 📂 Project Structure

```text
VendorVault/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── workers/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── context/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── utils/
│   └── package.json
│
├── README.md
└── .gitignore
```

---

# 🛠️ Technology Stack

### Frontend

- React
- Tailwind CSS
- React Router
- Axios
- Recharts

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

### AI

- LLM API
- Structured JSON extraction

### Background Processing

- Redis
- BullMQ

### Storage

- S3-compatible cloud storage

### Notifications

- Email API
- In-app notifications

### Deployment

- Vercel
- Render
- MongoDB Atlas
- Redis Cloud
- S3-compatible storage

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/<your-username>/VendorVault.git

cd VendorVault
```

---

## 2. Setup Backend

```bash
cd backend

npm install
```

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

REDIS_URL=your_redis_connection_string

LLM_API_KEY=your_llm_api_key

STORAGE_BUCKET=your_bucket
STORAGE_REGION=your_region
STORAGE_ACCESS_KEY=your_access_key
STORAGE_SECRET_KEY=your_secret_key

EMAIL_API_KEY=your_email_api_key
```

Start the backend:

```bash
npm run dev
```

---

## 3. Setup Frontend

```bash
cd ../frontend

npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

---

# 🧪 Development Roadmap

VendorVault is being developed incrementally.

### Phase 1 — Foundation

- [x] Project architecture
- [ ] MongoDB setup
- [ ] Authentication
- [ ] JWT access/refresh tokens
- [ ] Basic RBAC

### Phase 2 — Organization & Vendors

- [ ] Organization management
- [ ] Vendor CRUD
- [ ] Vendor invitation
- [ ] Organization-scoped authorization

### Phase 3 — Documents

- [ ] Document upload
- [ ] Cloud storage
- [ ] Document metadata
- [ ] Document versioning
- [ ] Approval/rejection workflow

### Phase 4 — AI

- [ ] PDF text extraction
- [ ] LLM integration
- [ ] Structured extraction
- [ ] Expiry-date detection
- [ ] Clause extraction
- [ ] Risk flagging
- [ ] Human verification

### Phase 5 — Automation

- [ ] Redis setup
- [ ] BullMQ
- [ ] Extraction queue
- [ ] Expiry monitoring
- [ ] Reminder jobs
- [ ] Email notifications

### Phase 6 — Compliance

- [ ] Compliance policies
- [ ] Compliance score
- [ ] Compliance dashboard
- [ ] Risk indicators
- [ ] Compliance reports

### Phase 7 — Auditing & Security

- [ ] Audit logs
- [ ] Auditor portal
- [ ] Signed URLs
- [ ] Rate limiting
- [ ] File security
- [ ] Security hardening

### Phase 8 — Deployment

- [ ] Production database
- [ ] Cloud storage
- [ ] Redis Cloud
- [ ] Backend deployment
- [ ] Frontend deployment
- [ ] Production environment configuration

---

# 🗺️ Future Improvements

Possible future features include:

- Advanced AI clause analysis
- OCR for scanned documents
- AI-generated compliance summaries
- Vendor risk scoring
- Custom notification rules
- Advanced analytics
- Bulk vendor import
- Bulk document upload
- External auditor portal
- Multi-language document processing
- Digital document verification
- Advanced organization-level compliance policies

---

# 🎯 MVP

The initial MVP focuses on the core problem:

```text
Authentication
      ↓
Vendor Management
      ↓
Document Upload
      ↓
Expiry Date
      ↓
Basic Compliance Status
      ↓
Expiry Reminder
```

AI extraction, background processing, advanced analytics, and multi-tenant SaaS functionality are added incrementally.

---

# 📊 Example User Workflow

```text
Vendor receives invitation
        ↓
Vendor creates account
        ↓
Vendor uploads document
        ↓
Document stored securely
        ↓
AI extracts document information
        ↓
Compliance Officer reviews
        ↓
Document approved/rejected
        ↓
Compliance score updated
        ↓
Expiry date monitored
        ↓
30/15/7 day reminders
        ↓
Vendor uploads renewed document
        ↓
New document version created
        ↓
Audit history maintained
```

---

# 👨‍💻 Project Status

**Status:** 🚧 In Development

VendorVault is being developed as a **final-year major project** with a focus on full-stack engineering, AI-assisted document processing, security, automation, and scalable backend architecture.

---

# 📚 Learning Objectives

This project is designed to provide practical experience with:

- Full-stack web development
- REST API design
- Authentication and authorization
- RBAC
- Multi-tenant architecture
- MongoDB data modeling
- Cloud file storage
- PDF processing
- LLM integration
- Asynchronous job processing
- Redis
- BullMQ
- Email notifications
- Security
- System architecture
- Cloud deployment

---

# 📄 License

This project is currently in development phase.

## ⭐ If you find this project interesting

Feel free to explore the repository, follow the development progress, and provide feedback.
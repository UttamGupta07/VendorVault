# 🔐 VendorVault — B2B Vendor Compliance & Document Expiry Tracker

> **VendorVault** is a full-stack B2B vendor compliance management system designed to help organizations manage vendor documents, monitor compliance, track document expirations, and receive proactive alerts.

**🎓 Final-Year Major Project | 👥 Group Project | 💻 Full-Stack Web Application**

---

## 📌 Overview

Managing vendor compliance using spreadsheets, emails, and scattered cloud storage can make it difficult to keep track of important documents such as:

* GST Certificates
* FSSAI Licenses
* Insurance Certificates
* NDAs
* Business Licenses
* Contracts
* Other compliance documents

Missing an expiry date can lead to compliance issues, audit risks, and disruption of vendor relationships.

**VendorVault** provides a centralized platform where organizations can onboard vendors, define required documents, upload and review compliance documents, automatically extract important information using AI, and receive expiry reminders.

---

## ✨ Key Features

### 🏢 Vendor Management

* Create and manage vendors
* Vendor-specific profiles
* Vendor authentication
* Vendor self-service document uploads
* Vendor status management
* Service-type assignment
* Vendor compliance overview

### 📄 Document Management

* Upload compliance documents
* PDF document support
* Cloud-based file storage
* Document type management
* Required/optional document configuration
* Expiry-date tracking
* Document approval/rejection workflow
* Replacement document uploads
* Rejection reason tracking

### 🤖 AI-Powered Document Extraction

VendorVault uses **Google Gemini** to extract structured information from uploaded documents.

The extraction system can identify information such as:

* Document type
* Document number
* Vendor name
* Issue date
* Expiry date
* Address
* Important clauses

This reduces the need for manually entering information from compliance documents.

### 📊 Compliance Dashboard

The dashboard provides an overview of vendor compliance, including:

* Total vendors
* Total documents
* Missing documents
* Pending reviews
* Approved documents
* Rejected documents
* Expiring documents
* Expired documents
* Compliance score
* Action-required items

### ⏳ Expiry Tracker

Documents are categorized according to their expiry status:

* 🟢 Valid
* 🟡 Expiring within 30 days
* 🟠 Expiring within 15 days
* 🔴 Critical / Expiring within 7 days
* ⚫ Expired

### 🔔 Notifications & Reminders

VendorVault provides notifications for important compliance events.

Reminder categories include:

* 15-day reminder
* 7-day reminder
* 1-day reminder
* 1-day expired reminder
* 3-day expired reminder
* 7-day expired reminder

Notifications can be delivered through the application's notification system and email.

### 📧 Email Delivery Monitoring

The system maintains email delivery information including:

* Reminder type
* Recipient
* Delivery status
* Message ID
* Retry attempts
* Failed email tracking

Failed email operations can be retried.

### 👥 Role-Based Access Control

VendorVault supports multiple user roles:

| Role                   | Responsibilities                           |
| ---------------------- | ------------------------------------------ |
| **Super Admin**        | Organization and system management         |
| **Compliance Officer** | Vendor and document compliance management  |
| **Vendor**             | Upload and manage own compliance documents |
| **Auditor**            | Read-only access to compliance information |

---

# 🔄 Vendor Compliance Workflow

```text
                    ┌─────────────────┐
                    │   Super Admin   │
                    └────────┬────────┘
                             │
                             ▼
                    Create Service Type
                             │
                             ▼
                    Define Required Docs
                             │
                             ▼
                    ┌─────────────────┐
                    │     Vendor      │
                    └────────┬────────┘
                             │
                             ▼
                    Upload Compliance PDF
                             │
                             ▼
                    ┌─────────────────┐
                    │  Gemini AI      │
                    │  Extraction     │
                    └────────┬────────┘
                             │
                             ▼
                  Extract Document Details
                             │
                             ▼
                    Compliance Review
                       /           \
                      /             \
                     ▼               ▼
                 Approved         Rejected
                    │                 │
                    │                 ▼
                    │          Vendor notified
                    │
                    ▼
              Expiry Monitoring
                    │
                    ▼
              Automatic Reminders
                    │
                    ▼
              Document Replacement
```

---

# 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────┐
│                     VendorVault                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  React Frontend                                         │
│       │                                                 │
│       │ HTTP / REST API                                 │
│       ▼                                                 │
│  Express.js Backend                                     │
│       │                                                 │
│       ├──────────────► MongoDB                          │
│       │                                                 │
│       ├──────────────► Cloudinary                       │
│       │                                                 │
│       ├──────────────► Google Gemini                    │
│       │                                                 │
│       ├──────────────► Gmail / Nodemailer               │
│       │                                                 │
│       └──────────────► Redis / BullMQ                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

* **React.js**
* **Vite**
* **React Router**
* **Axios**
* **Tailwind CSS**
* **Lucide React**
* React Context API

## Backend

* **Node.js**
* **Express.js**
* REST APIs
* JWT Authentication
* HTTP-only Cookies
* Role-Based Authorization
* Multer

## Database

* **MongoDB**
* **Mongoose**

## AI

* **Google Gemini API**
* `@google/genai`

Used for extracting structured information from compliance documents.

## File Storage

* **Cloudinary**

Used for storing uploaded documents.

## Notifications & Background Jobs

* **BullMQ**
* **Redis**
* **Nodemailer**
* Gmail SMTP

Used for scheduled expiry reminders and email processing.

---

# 🔐 Authentication & Security

VendorVault uses secure authentication mechanisms including:

* JWT-based authentication
* HTTP-only authentication cookies
* Password hashing with bcrypt
* Role-based authorization
* Organization-level data isolation
* Protected API routes
* Vendor-specific access control
* Suspended/inactive vendor login restrictions

Authentication token structure:

```text
JWT
 ├── userId
 ├── organizationId
 └── role
```

---

# 📂 Project Structure

```text
VendorVault/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── layouts/
│   │   └── App.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── jobs/
│   │   ├── utils/
│   │   └── app.js
│   │
│   ├── uploads/
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md
```

---

# 👤 User Roles

## Super Admin

The Super Admin manages the organization and overall platform configuration.

Responsibilities include:

* Manage users
* Manage vendors
* Create service types
* Create document types
* Configure required documents
* Monitor compliance
* View reports
* View audit logs
* Monitor email delivery

---

## Compliance Officer

The Compliance Officer is responsible for day-to-day vendor compliance.

Responsibilities include:

* Review vendor documents
* Approve documents
* Reject documents
* Monitor expiry dates
* Track missing documents
* Review compliance scores
* Manage vendor compliance
* Receive compliance notifications

---

## Vendor

Vendors have access to their own compliance workspace.

They can:

* View assigned requirements
* Upload documents
* Replace rejected/expired documents
* Track document status
* View expiry dates
* Receive notifications
* Manage their profile

---

## Auditor

Auditors have read-only access to compliance information.

They can inspect:

* Vendors
* Documents
* Compliance information
* Reports
* Audit information

They cannot modify compliance records.

---

# 📈 Compliance Score

VendorVault calculates a compliance score based on the vendor's document status.

The dashboard identifies factors such as:

* Valid documents
* Missing documents
* Pending documents
* Rejected documents
* Expiring documents
* Expired documents

Expired documents negatively affect the vendor's compliance score.

Compliance states include:

```text
Compliant
At Risk
Non-Compliant
Pending Review
```

---

# 🔔 Notification Flow

```text
Document Uploaded
       │
       ▼
Compliance Officer
       │
       ▼
Review Document
   ┌───┴────┐
   │        │
   ▼        ▼
Approve   Reject
   │        │
   ▼        ▼
Vendor    Vendor
notified  notified
```

Expiry flow:

```text
Document Expiry Date
        │
        ▼
Expiry Scheduler
        │
        ▼
Check Remaining Days
        │
        ├── 15 Days
        ├── 7 Days
        ├── 1 Day
        │
        ▼
Send Notification
        │
        ▼
Record Delivery
```

---

# ⚙️ Local Installation

## 1. Clone the Repository

```bash
git clone https://github.com/UttamGupta07/VendorVault.git

cd VendorVault
```

---

# 🔧 Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

GEMINI_API_KEY=your_gemini_api_key

EMAIL_USER=your_email
EMAIL_APP_PASSWORD=your_gmail_app_password
EMAIL_FROM=your_email

REDIS_URL=your_redis_url
```

Start the backend:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

# 🎨 Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# 🔑 Environment Variables

Never commit `.env` files to GitHub.

The following credentials must remain private:

```text
MONGO_URI
JWT_SECRET
GEMINI_API_KEY
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
EMAIL_APP_PASSWORD
REDIS_URL
```

A `.env.example` file can be used to document the required variables without exposing credentials.

---

# 🧪 Testing

Before testing the application, make sure the following services are available:

```text
MongoDB
Redis
Backend Server
Frontend Server
```

Then test the complete workflow:

```text
Organization Registration
        ↓
Super Admin Login
        ↓
Create Service Type
        ↓
Configure Required Documents
        ↓
Create Vendor
        ↓
Vendor Login
        ↓
Upload Document
        ↓
AI Extraction
        ↓
Compliance Review
        ↓
Approve / Reject
        ↓
Expiry Monitoring
        ↓
Notification / Email Reminder
```

---

# 📊 Main Modules

```text
Authentication
     │
     ├── Organization Registration
     ├── Login
     ├── Password Reset
     └── Role Authorization
     
Vendor Management
     │
     ├── Vendor Creation
     ├── Vendor Profile
     ├── Vendor Authentication
     └── Vendor Status

Document Management
     │
     ├── Upload
     ├── AI Extraction
     ├── Review
     ├── Approval / Rejection
     └── Replacement

Compliance
     │
     ├── Compliance Dashboard
     ├── Compliance Score
     ├── Expiry Tracker
     └── Reports

Notifications
     │
     ├── In-App Notifications
     ├── Email Reminders
     ├── Delivery Monitoring
     └── Failed Reminder Handling

Administration
     │
     ├── Users
     ├── Service Types
     ├── Document Types
     ├── Audit Logs
     └── Reports
```

---

# 🚀 Future Improvements

Potential future enhancements include:

* OCR support for scanned documents
* More advanced AI clause analysis
* Automatic document authenticity verification
* Vendor risk scoring
* Advanced analytics and reporting
* Bulk vendor import
* Microsoft 365 / Google Drive integration
* Multi-language document extraction
* Mobile application
* Advanced audit and compliance reports
* Production deployment with scalable background workers

---

# 👨‍💻 Project Information

**Project:** VendorVault
**Type:** Final-Year Major Project
**Category:** B2B SaaS / Vendor Compliance Management
**Development:** Group Project
**Status:** Under Development / Not Currently Deployed

---

# 🔗 Repository

**GitHub:**
https://github.com/UttamGupta07/VendorVault

> The project is currently available as a source-code repository and is not deployed as a public production application.

---

# 📜 License

This project was developed as an academic final-year major project.

If you wish to reuse or distribute the project, please contact the project authors.

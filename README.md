# 🏆 Lead Management Frontend Application

A Next.js-based lead management system that allows users to submit leads and admins to manage them efficiently.

## 🚀 Features
- **Public Lead Submission Form**
  - JsonForms-based dynamic form  
  - Resume/CV file upload  
  - Input validation  
- **Admin Lead Management**
  - JWT authentication  
  - Status update functionality  
  - Search & filtering  
  - Pagination  
- **Security & Optimization**
  - `httpOnly` cookie authentication  
  - Responsive UI with CSS Modules  

---

## 📌 Tech Stack

| Technology      | Description |
|----------------|-------------|
| **Frontend**   | Next.js, TypeScript, JsonForms |
| **Styling**    | CSS Modules |
| **Backend**    | Next.js API Routes |
| **Auth**       | JWT (JSON Web Token) |
| **Storage**    | File Upload (`formidable`) |
| **State Mgmt** | Context API |

---

## 🏗️ System Architecture
+———————+
|  Client (Next.js)  |
+———————+
│
▼
+–––––––––––+
|  API Routes (Next.js) |
+–––––––––––+
│
▼
+–––––––––––+
|   File Upload (S3)  |
|   JSON DB (FS)      |
+–––––––––––+

### **How it Works**
1. Users submit leads via a **public form** (`/`).
2. Leads are stored using **Next.js API routes** (`/api/leads`).
3. Admins access leads in a **secure dashboard** (`/admin`).
4. **File uploads** are processed using `formidable`.

## 🔥 API Endpoints

### **Lead Management**
| Method | Endpoint        | Description |
|--------|----------------|-------------|
| `POST` | `/api/leads`   | Submit a new lead |
| `GET`  | `/api/leads`   | Retrieve all leads |
| `PUT`  | `/api/leads/:id` | Update lead status |

### **Authentication**
| Method | Endpoint        | Description |
|--------|----------------|-------------|
| `POST` | `/api/login`   | Admin login |
| `POST` | `/api/logout`  | Admin logout |

### **Example: Create a Lead**
**Request**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "johndoe@example.com",
  "linkedin": "https://linkedin.com/in/johndoe",
  "citizenship": "United States",
  "visasOfInterest": ["O-1", "EB-1A"],
  "resume": "base64_encoded_file"
}
```

**Response**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "firstName": "John",
  "lastName": "Doe",
  "email": "johndoe@example.com",
  "linkedin": "https://linkedin.com/in/johndoe",
  "citizenship": "United States",
  "visasOfInterest": ["O-1", "EB-1A"],
  "resumeUrl": "/uploads/abcd1234.pdf",
  "status": "PENDING",
  "createdAt": "2025-03-10T12:00:00Z"
}
```

### **Lead Data Model**
| Field | Type | Description |
|--------|------|-------------|
| `id` | `string` | Unique identifier (UUID) |
| `firstName` | `string` | First name of the lead |
| `lastName` | `string` | Last name of the lead |
| `email` | `string` | Contact email |
| `linkedin` | `string` | LinkedIn profile URL |
| `citizenship` | `string` | Country of citizenship |
| `visasOfInterest` | `string[]` | Array of visa categories of interest |
| `resumeUrl` | `string` | URL of uploaded resume |
| `additionalInfo` | `string` | Any additional details |
| `status` | `string`| Current status of the lead |
| `createdAt` | `string` | Timestamp of lead creation |


## 🛠 Installation & Setup

```
# Install dependencies
npm install

# Start the development server
npm run dev

# Run unit test
npm run test

Open http://localhost:3000 in your browser.
```
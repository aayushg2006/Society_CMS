# 🏢 Society SaaS – Multi-Tenant Housing Management Platform

Society SaaS is a **scalable, modern SaaS platform** built to digitize and streamline housing society management.  
It features a **robust multi-tenant architecture** and an **AI-powered gatekeeper** that automatically verifies resident complaints to eliminate spam and false reports.

---

## 🚀 Tech Stack

### Backend
- **Language:** Java  
- **Framework:** Spring Boot 3  
- **ORM:** Hibernate / Spring Data JPA  

### Database
- **PostgreSQL**
- Supabase IPv4 Connection Pooler

### AI Microservice
- **Python**, **Flask**
- **Google Gemini 1.5 Flash**
- Multimodal Video & Image Processing

### Frontend
- **Web:** React, Vite, Tailwind CSS  
- **Mobile:** React Native, Expo  

---

## ✨ Features Implemented

### 🔐 Multi-Tenancy
- Complete data isolation using `societyId`
- Ensures secure and scalable tenant separation at the database level

### 🔑 Secure Authentication
- JWT-based stateless authentication
- Passwords securely hashed using BCrypt

### 🤖 Automated AI Verification
- A dedicated **Python Flask microservice** validates complaint media
- Uses **Gemini 2.5 Flash** to analyze images/videos
- Returns a **strict JSON verdict** identifying:
  - Genuine complaints
  - Fake or spam submissions

### 👍 Community Trust System
- Residents can upvote complaints
- Complaints are automatically escalated to `OPEN` status after **3 verified upvotes**

---

## 📂 Project Structure

```text
Society-SaaS/
├── backend/            # Spring Boot REST API
├── ai-service/         # Python Flask AI Validator
├── frontend-web/       # Admin Dashboard (React)
└── frontend-mobile/    # Resident Mobile App (React Native)
````

---

## ⚙️ Local Setup

### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd Society-SaaS
```

### 2️⃣ Database Setup

* Ensure **Supabase PostgreSQL** is running
* Add database credentials to:

```text
backend/src/main/resources/application.properties
```

### 3️⃣ Environment Variables

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_google_gemini_api_key
```

### 4️⃣ Run the AI Service

```bash
cd ai-service
python main.py
```

### 5️⃣ Run the Backend

```bash
cd backend
./mvnw spring-boot:run
```

---

## 📌 Future Enhancements

* Role-based access control (RBAC)
* Admin analytics dashboard
* Push notifications for complaint updates
* Payment and maintenance billing module

---

## 🧑‍💻 Author

Built with ❤️ to modernize housing society management using AI and scalable SaaS architecture.

---


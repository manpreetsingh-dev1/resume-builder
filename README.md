# resume-builder
this is my Resume builder project with AI enhancing
<br>
# 🚀 Resume Builder (MERN + AI)

A full-stack Resume Builder web application built using the MERN stack with AI-powered resume generation.

---

## 🌟 Features

* 🔐 User Authentication (JWT)
* 📄 Create, Edit & Delete Resumes
* 📤 Upload PDF Resume
* 🤖 AI Resume Parsing & Generation
* 🎨 Modern UI Dashboard
* 📱 Fully Responsive Design

---

## 🛠️ Tech Stack

**Frontend**

* React (Vite)
* Tailwind CSS
* Redux Toolkit

**Backend**

* Node.js
* Express.js
* MongoDB (Mongoose)

**Other**

* JWT Authentication
* PDF Parsing (pdfjs)
* AI Integration

---

## 📂 Project Structure

resume-builder/
│
├── vite-product/   # Frontend (React)
├── server/         # Backend (Node + Express)
├── .gitignore
└── README.md

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

git clone https://github.com/your-username/resume-builder.git
cd resume-builder

---

### 2️⃣ Install dependencies

# Backend

cd server
npm install

# Frontend

cd ../vite-product
npm install

---

### 3️⃣ Setup Environment Variables

Create `.env` file inside **server/**:

PORT=5000
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_api_key

---

### 4️⃣ Run the project

# Run backend

cd server
npm run server

# Run frontend

cd ../vite-product
npm run dev

---

## 🌐 API Routes

* POST `/api/users/register`
* POST `/api/users/login`
* GET `/api/users/data`
* GET `/api/users/resumes`
* POST `/api/resumes/create`
* POST `/api/ai/upload-resume`

---

## 🚀 Future Improvements

* ✨ More resume templates
* 🌍 Public resume sharing
* 📥 Download as PDF
* 📊 Analytics dashboard

---

## 🤝 Contributing

Feel free to fork this repo and contribute.

---

## 👨‍💻 Author

Manpreet Singh
MERN Stack Developer

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!


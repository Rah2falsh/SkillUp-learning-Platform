# SkillUp 🚀
An advanced and interactive skill development and training management platform custom-built for **JODAYM company**. 

---

## 🌟 Project Overview
**SkillUp** is a comprehensive solution designed to streamline the learning and development journey within organization. It empowers employees to track their growth, manage training tracks, and enables administrators to monitor progress and scale organizational capabilities efficiently through an intuitive, role-based ecosystem.

## 🛠️ Tech Stack
This project is built using a modern, scalable, and high-performance development stack:
* **Frontend:** React.js (Powered by Vite for blazing-fast HMR)
* **Styling:** Tailwind CSS (For a modern, clean, and fully responsive UI/UX)
* **Backend & Database:** Firebase (Authentication, Firestore Realtime Database)
* **State & Tools:** ESLint, PostCSS

---

## ✨ Key Features & Architecture

### 👥 Role-Based Dashboard Ecosystem
The platform layout is fully tailored based on user privileges to ensure security and productivity:
* **Admin Portal:** Comprehensive management tools including Admin SignUp/Login, Training Tracks Oversight (`ViewTrainings`), and administrative Personal Info management.
* **Employee Hub:** Personal learning dashboard features including tracking `LearningJourney`, managing `FavoriteCourses`, monitoring `CompletedCourses`, and personal profile management.

### 🔐 Secure Authentication & Services
* **Firebase Auth & Protected Routes:** Strict route guards (`ProtectedRoute.jsx`) preventing unauthorized access based on user roles.
* **Smart Recovery:** Automated `ForgotPassword` handlers and seamless dynamic email services (`emailService.js`).

---

## 🚀 Getting Started

To run this project locally on your machine, follow these simple steps:

### 1. Clone the repository
```bash
git clone [https://github.com/Rah2falsh/SkillUp.git](https://github.com/Rah2falsh/SkillUp.git)
cd SkillUp

# 📝 Fundoo Notes — React Frontend

A responsive, full-stack note-taking application built using **React.js, Vite, and Java Spring Boot**, inspired by Google Keep.

## 📌 About the Project

**Fundoo Notes** is a web-based application that allows users to securely create, manage, organize, and search personal notes.

The frontend is developed using React.js and communicates with a Spring Boot backend through REST APIs and Spring Cloud Gateway.

The application includes JWT authentication, note management, labels, reminders, CSV import/export, and a responsive user interface.

## 🚀 Key Features

- **Authentication:** User registration, login, logout, email verification, and password reset.
- **Profile Management:** View and manage user profile information.
- **Notes CRUD:** Create, read, update, and delete notes.
- **Notes Organization:** Pin, unpin, archive, trash, restore, and permanently delete notes.
- **Search:** Search notes by title or description.
- **Labels:** Create, rename, delete, assign, and remove labels.
- **Reminders:** Set, view, update, and remove note reminders.
- **CSV Import/Export:** Import and export notes using CSV files.
- **Responsive UI:** Mobile-friendly design with loading states, dialogs, and notifications.
- **Security:** JWT authentication and protected routes.

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite, JavaScript |
| Routing | React Router |
| API Communication | Axios |
| Styling | CSS3, HTML5 |
| Backend | Java, Spring Boot |
| Security | Spring Security, JWT |
| API Gateway | Spring Cloud Gateway |
| Database | MySQL |
| Caching | Redis |
| Messaging | RabbitMQ |
| Batch Processing | Spring Batch |
| Email Testing | Mailpit |
| Logging & Scheduling | Spring AOP, Spring Scheduler |
| Testing | Playwright |
| Version Control | Git, GitHub |

## 📂 Project Structure

```text
fundoo-notes-frontend/
│
├── public/
│
├── src/
│   ├── assets/            # Images and static assets
│   ├── components/        # Reusable React components
│   │   └── ui/            # Loading, Empty State, Modal, Messages
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Application pages
│   ├── router/            # Protected route handling
│   ├── services/          # Backend API integration
│   ├── styles/            # Component and page styles
│   ├── utils/             # JWT, API client and utilities
│   │
│   ├── App.jsx            # Application routes
│   ├── App.css            # Application styling
│   └── main.jsx           # React entry point
│
├── tests/                 # Playwright tests
├── docs/                  # Project documentation
├── index.html
├── package.json
├── playwright.config.js
├── vite.config.js
└── README.md
```

## 📋 Use Cases Implemented

| Use Case | Module | Description |
|---|---|---|
| UC1 | Authentication | Registration, login, logout and JWT |
| UC2 | User Management | Profile, email verification and password reset |
| UC3 | Notes CRUD | Create, view, update and delete notes |
| UC4 | Notes Organization | Pin, archive, trash and restore |
| UC5 | Search & Labels | Search notes and manage labels |
| UC6 | Reminders | Set, view, update and remove reminders |
| UC7 | CSV Import/Export | Import and export notes through Spring Batch |
| UC8 | Backend Integration | Redis, RabbitMQ, AOP and scheduled tasks |
| UC9 | UI Enhancements | Responsive design and reusable UI components |
| UC10 | Final Testing | Playwright integration and security tests |

## 🏗️ Application Architecture

```text
React Frontend (Vite)
        |
        | Axios REST API Requests
        v
Spring Cloud Gateway
        |
        v
Spring Boot Backend
        |
        ├── Spring Security + JWT
        ├── MySQL Database
        ├── Redis Cache
        ├── RabbitMQ
        ├── Spring Batch
        ├── Spring AOP
        └── Scheduled Tasks
```

The frontend sends authenticated API requests through Spring Cloud Gateway, which forwards them to the Spring Boot backend.

## ⚙️ Installation and Setup

**1. Clone the repository**

```bash
git clone https://github.com/akhildurgesh-pokuru/Fundo-Noted-Frontend.git
```

**2. Open the project**

```bash
cd Fundo-Noted-Frontend
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the backend and API Gateway**

Make sure the Spring Boot backend, Spring Cloud Gateway, and required infrastructure services are running.

**5. Start the React application**

```bash
npm run dev
```

Open: `http://localhost:5173`

## 🔗 Local Service Ports

| Service | Port |
|---|---|
| React Frontend | 5173 |
| Spring Cloud Gateway | 8081 |
| Spring Boot Backend | 8080 |
| MySQL | 3306 |
| Redis | 6379 |
| RabbitMQ | 5672 |
| Mailpit UI | 8025 |

## 🧪 Testing

Automated testing is implemented using **Playwright**.

The test suite covers protected routes, authentication security, and real Notes API operations.

**Test Results:**
- Total Tests: 10
- Passed: 10
- Failed: 0

Run tests:

```bash
npx playwright test
```

View test report:

```bash
npx playwright show-report
```

Build the application:

```bash
npm run build
```

## 🔐 Security

- JWT-based user authentication.
- Protected frontend routes.
- Authorization headers added using Axios interceptors.
- Backend API protection using Spring Security.
- User-specific access to notes and related data.

## 🌿 Git Workflow

Development follows a feature-branch workflow.

```text
develop
   |
   ├── feature/UC-1-...
   ├── feature/UC-2-...
   ├── feature/UC-3-...
   ├── ...
   └── feature/UC-10-FinalIntegration
```

Each use case is developed in a separate branch and merged into `develop` through a GitHub Pull Request.

## 🎯 Project Objective

To build a secure, responsive, and maintainable note-taking application while demonstrating practical experience with **React, REST API integration, Spring Boot, JWT authentication, MySQL, caching, messaging, and automated testing**.

## 👨‍💻 Developer

**Pokuru Akhil Durgesh**

GitHub: [akhildurgesh-pokuru](https://github.com/akhildurgesh-pokuru)

---

**Fundoo Notes — React Frontend | Full-Stack Notes Management Application**

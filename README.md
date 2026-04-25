# 🛡️ Bep Viet - Admin Command Center (Frontend)

[![ReactJS](https://img.shields.io/badge/Frontend-ReactJS-blue.svg)](https://reactjs.org/)
[![MUI](https://img.shields.io/badge/UI--Library-Material--UI-007FFF.svg)](https://mui.com/)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-38B2AC.svg)](https://tailwindcss.com/)
[![Socket.io](https://img.shields.io/badge/Real--time-Socket.io-black.svg)](https://socket.io/)

## 📌 Project Overview
This repository contains the **Admin Dashboard** for the Bep Viet E-commerce ecosystem. Built with **ReactJS**, it provides a centralized platform for administrators to manage menus, track real-time orders, and monitor system-wide delivery operations.

## 🏗 Technical Architecture
The application is engineered for high-performance state management and real-time responsiveness:
- **Core Framework**: ReactJS with functional components and **Hooks**.
- **State Management**: **Context API** for global state handling (Auth, Real-time updates).
- **UI System**: **Material UI (MUI)** for complex data tables and **TailwindCSS** for flexible layout design.
- **Networking**: **Axios** with interceptors for secure API communication and **Socket.io-client** for bi-directional data streaming.

---

## 🚀 Key Technical Features

### 1. Real-time Fleet & Order Orchestration
- **Live Order Stream**: Integrated **Socket.io** to receive and handle incoming orders instantly without page refreshes.
- **Shipper Tracking**: Real-time monitoring of delivery personnel locations and status updates via persistent socket connections.

### 2. Advanced Inventory & Menu Management
- **Dynamic Content Control**: Comprehensive CRUD modules for dishes, categories, and ingredients.
- **Media Optimization**: Integrated with **Cloudinary API** for efficient image uploading, transformations, and caching.
- **Data Integrity**: Implemented client-side validation to ensure system-wide data consistency.

### 3. Security & Access Control
- **Authentication**: Secure login flow utilizing **JWT (Access/Refresh Tokens)** stored in secure storage.
- **Protected Routing**: Implemented Higher-Order Components (HOCs) to guard administrative routes and prevent unauthorized access.

### 4. Operational Insights
- **Interactive Dashboards**: Utilized charting libraries to visualize system KPIs, revenue trends, and order analytics for data-driven management.

---

## 📂 Project Structure
```text
├── src/
│   ├── components/     # Reusable UI components (Modals, Tables, Forms)
│   ├── pages/          # Primary views (Dashboard, Orders, Menu, Settings)
│   ├── context/        # Global state management providers
│   ├── services/       # API call definitions and Socket event listeners
│   ├── theme/          # Custom MUI theme and branding configurations
│   └── utils/          # Helper functions and data formatters
├── .env                # Configuration variables
└── package.json        # Project dependencies

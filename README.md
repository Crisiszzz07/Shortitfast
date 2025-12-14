<div align="center">

# ⚡ ShortItFast

**The friction-less URL shortener for modern developers.**

<p>
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-api-docs">API Docs</a>
  </p>

  <p>
    <img src="https://img.shields.io/github/license/Crisiszzz07/Shortitfast?style=flat-square&color=8b5cf6" alt="License" />
    <img src="https://img.shields.io/github/last-commit/Crisiszzz07/Shortitfast?style=flat-square&color=8b5cf6" alt="Last Commit" />
    <img src="https://img.shields.io/badge/PRs-welcome-8b5cf6?style=flat-square" alt="PRs Welcome" />
    <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  </p>

  <br />

  [**Explore the Docs »**](https://shortitfast.onrender.com/docs)
  <br />
  [View Demo](https://shortitfast.onrender.com) · [Report Bug](https://github.com/Crisiszzz07/Shortitfast/issues)
  
</div>

---

## 🇬🇧 English Description

### 📖 About The Project

**ShortItFast** is a robust Full Stack application designed to demonstrate scalable software architecture principles. Unlike traditional shorteners that require tedious registration, ShortItFast focuses on **UX (User Experience)** by offering instant link shortening with a "Zero-Friction" philosophy.

The project implements a **Monorepo architecture**, combining a high-performance REST API (Node/Express) with a modern, static-first frontend (Astro/React).

### ✨ Key Features

* **⚡ Zero-Login Experience:** Instant usage without registration barriers.
* **💾 Local History:** Uses `localStorage` to persist user links client-side securely.
* **🛡️ Rate Limiting:** Advanced protection against abuse and bot spamming.
* **🐳 Dockerized Database:** Development environment fully containerized with Docker Compose.
* **📘 Interactive API Docs:** Integrated Swagger UI (OpenAPI 3.0) for testing endpoints directly.
* **💎 Modern UI:** Responsive design with a polished Violet/Dark theme.

### 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | Node.js + Express | REST API with TypeScript for type safety. |
| **Database** | PostgreSQL | Relational data storage (Hosted on Neon.tech). |
| **ORM/Query** | `pg` (node-postgres) | Native SQL queries for performance optimization. |
| **Frontend** | Astro + React | Hybrid rendering for maximum speed and interactivity. |
| **Docs** | Swagger UI | Auto-generated interactive documentation. |
| **DevOps** | Docker | Containerization for local development. |

### 🚀 Getting Started

Follow these steps to run the project locally.

#### Prerequisites

* Node.js (v18+)
* Docker & Docker Compose (optional, for local DB)
* Git

#### Installation

1. **Clone the repo**

    ```bash
    git clone [https://github.com/yourusername/shortitfast.git](https://github.com/yourusername/shortitfast.git)
    cd shortitfast
    ```

2. **Setup Backend**

    ```bash
    cd backend
    npm install
    # Create .env file based on .env.example
    cp .env.example .env
    ```

3. **Setup Database (Docker)**

    ```bash
    # Run the Postgres container
    docker run --name my-postgres -e POSTGRES_PASSWORD=secret -p 5432:5432 -d postgres
    ```

4. **Run Backend**

    ```bash
    npm run dev
    ```

5. **Setup & Run Frontend**

    ```bash
    # In a new terminal
    cd ../frontend
    npm install
    npm run dev
    ```

---

## 🇪🇸 Descripción en Español

### 📖 Sobre el Proyecto

**ShortItFast** es una aplicación Full Stack robusta diseñada para demostrar principios de arquitectura de software escalable. A diferencia de los acortadores tradicionales que requieren registros tediosos, ShortItFast se centra en la **UX (Experiencia de Usuario)** ofreciendo acortamiento instantáneo bajo la filosofía de "Cero Fricción".

El proyecto implementa una **arquitectura Monorepo**, combinando una REST API de alto rendimiento (Node/Express) con un frontend moderno y estático (Astro/React).

### ✨ Características Clave

* **⚡ Experiencia Sin Login:** Uso instantáneo sin barreras de registro.
* **💾 Historial Local:** Uso de `localStorage` para persistir enlaces del usuario en el cliente.
* **🛡️ Rate Limiting:** Protección avanzada contra abusos y spam de bots.
* **🐳 Base de Datos Dockerizada:** Entorno de desarrollo contenerizado.
* **📘 Docs Interactivas:** Swagger UI (OpenAPI 3.0) integrado para probar endpoints en vivo.
* **💎 UI Moderna:** Diseño responsivo con un tema Violeta/Oscuro pulido.

### 🛠️ Tecnologías

| Componente | Tecnología | Descripción |
| :--- | :--- | :--- |
| **Backend** | Node.js + Express | REST API con TypeScript para tipado seguro. |
| **Base de Datos** | PostgreSQL | Almacenamiento relacional (Hosteado en Neon.tech). |
| **ORM/Query** | `pg` (node-postgres) | Consultas SQL nativas para optimización. |
| **Frontend** | Astro + React | Renderizado híbrido para máxima velocidad. |
| **Docs** | Swagger UI | Documentación interactiva autogenerada. |
| **DevOps** | Docker | Contenerización para desarrollo local. |

### 📂 Estructura del Proyecto

```text
/shortitfast
├── /backend         # API Node.js/Express, Lógica de Negocio, Swagger
├── /frontend        # Interfaz de Usuario (Astro/React)
├── docker-compose.yml
└── README.md
````

### 🤝 Contribución

¡Las contribuciones son bienvenidas\! Este es un proyecto Open Source pensado para aprendizaje y mejora continua.

1. Haz un Fork del proyecto
2. Crea tu rama de funcionalidad (`git checkout -b feature/AmazingFeature`)
3. Haz Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

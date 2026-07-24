# Agri-Allied AI Chatbot

An AI-assisted full-stack web development application featuring a dynamic React + Vite frontend linked seamlessly to a custom Node.js & Express.js backend engine.

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


## 📡 How to Run Backend Locally

To launch the backend engine room and test the REST API endpoints locally, follow these steps:

1. **Navigate to the backend directory:**
   ```bash
   cd backend

 2.  Install required dependencies:
    Make sure you have Node.js installed, then execute:

    npm install

  3.  Set up local Environment Variables:
    Ensure a .env file exists in your /backend folder configuring your target port layout (you can reference the provided blueprint .env.example file):

    Ini, TOML
    PORT=5000

  4.  Boot up the live development server:
    Launch the server with nodemon for active file tracking and hot-reloads:

    Bash
    npm run dev






    ## 🗄️ Week 5 Database Integration Strategy

### 1. Database Choice & Technical Justification
For this architecture, **MariaDB via Aiven Cloud** was chosen as the primary relational database layer. Relational structures provide strict type safety, ACID compliance, and excellent indexing capabilities for structured telemetry logs. Utilizing an enterprise cloud provider like Aiven ensures scalable, offsite data persistence rather than relying on ephemeral local mock environments. 

### 2. Schema Architecture Diagram
Below is the structural layout tracking the persistent telemetry entities for the diagnostic modules:

![Schema Diagram](./W5_SchemaDiagram_26100090.png)

### 3. Database Bootstrap & Setup Instructions
To initialize the full-stack database connection pipeline locally, follow these steps:

1. **Clone the Environment Template:**
   Ensure you have a `.env` file configured in your `backend/` directory based on the provided `.env.example`.
2. **Configure Connection String:**
   Supply your cloud access credentials within the `DATABASE_URL` variable inside `.env`.
3. **Install Core Dependencies:**
   Run `npm install` inside the backend directory to pull down `@prisma/client` and the required database adapters.
4. **Deploy Schema Migrations:**
   Synchronize your cloud instance with the local Prisma structural files by executing:
   ```bash
   npx prisma db push
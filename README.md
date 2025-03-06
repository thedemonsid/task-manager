# Task Manager Assignment

## 🌟 Overview
Task Manager is a modern, responsive web application for efficiently organizing and tracking personal or team tasks. Built with **Next.js**, **React**, and **Prisma**, this application provides a seamless task management experience with robust authentication, real-time updates, and comprehensive dashboard analytics.

![Task Manager](./public/task-manager.png)

## 🚀 Features
- **🔒 User Authentication**: Secure login and registration with JWT token-based authentication
- **📝 Task Management**: Create, update, delete, and organize tasks with ease
- **⚡ Priority Levels**: Assign **LOW**, **MEDIUM**, **HIGH**, or **URGENT** priority to tasks
- **📊 Status Tracking**: Monitor task progression with **PENDING** or **FINISHED** status
- **📈 Dashboard Analytics**: Visualize task completion rates, time metrics, and priority distribution
- **📱 Responsive Design**: Fully functional on desktop and mobile devices
- **🌙 Dark Mode**: Modern dark theme UI for comfortable viewing

## 🛠️ Technologies
- **Frontend**: Next.js, React, Tailwind CSS, Shadcn
- **Backend**: Prisma, PostgreSQL,JWT,bcryptjs
- **Deployment**: Vercel

## 📚 Getting Started
1. **Clone the repository**:
   ```bash
   git clone https://github.com/thedemonsid/task-manager.git
    cd task-manager
    ```
2. **Install dependencies**:
   ```bash
   pnpm install
   ```
3. **Set up environment variables**:
    - Create a `.env.local` file in the root directory
    - Add the following environment variables:
      ```env
      DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
      JWT_SECRET="your-jwt-secret"
4. **Run the docker-compose file**:
    ```bash
    docker compose up -d
    ```
5. **Run the development server**:
   ```bash
   pnpm dev
   ```
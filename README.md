# 🛒 CommerceX — Scalable E-commerce Backend (Microservices-Ready)

**CommerceX** is a robust and scalable e-commerce backend platform built using **NestJS**, **Prisma**, and **PostgreSQL**. Designed for real-world use, it follows best practices in modular architecture, role-based access control (RBAC), and includes full support for admin operations, analytics, and notifications.

---

## 🚀 Features

- 🔐 **Authentication & Authorization**

  - JWT-based login and registration
  - Role-based access (User, Admin)

- 👥 **User Management**

  - Admin access to list, view, and delete users

- 🛍️ **Product Catalog**

  - CRUD operations
  - Category & Inventory management

- 🛒 **Shopping Cart**

  - Add, update, remove, and clear cart items

- 📦 **Order Management**

  - Place orders, view order history, track status
  - Admin controls for order management

- 💳 **Payments Integration**

  - Stripe-powered payment intents
  - Webhook support to update order statuses

- 🧾 **Invoice Generation**

  - Automatically generate downloadable PDF invoices

- ⭐ **Reviews & Ratings**

  - Users can rate and review products

- 💖 **Wishlist**

  - Wishlist operations per user

- 📬 **Notifications**

  - Email notifications via Nodemailer
  - In-app notifications stored in DB

- 📊 **Admin Reports & Analytics**
  - Sales reports (filterable by date range)
  - Total counts (users, products, orders)

---

## 🛠️ Tech Stack

- **Backend:** [NestJS](https://nestjs.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL
- **Auth:** JWT + Role Guards
- **Email:** Nodemailer
- **Payments:** Stripe
- **PDFs:** node-invoice-generator
- **Containerization:** Docker, Docker Compose

---

## 📦 Getting Started with Docker

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/CommerceX.git
cd CommerceX
```

### 2️⃣ Create Your .env File

Create a `.env` file in the root directory and add the following environment variables:

DATABASE_URL=postgresql://postgres:password@db:5432/ecommerce_db?schema=public  
STRIPE_SECRET_KEY=your_stripe_secret_key  
EMAIL_USER=your_email@example.com  
EMAIL_PASS=your_email_password  
JWT_SECRET=your_jwt_secret

---

### 3️⃣ Start the App with Docker

Run the following command:

```bash
docker-compose up --build
```

This will:

- Start the PostgreSQL database on port 5432
- Start the NestJS backend app on port 3000
- Wait a few seconds for the DB to become ready before running migrations

---

## 🔃 Running Prisma Migrations

Inside the app container, run:

```bash
docker-compose exec app npx prisma migrate dev --name init
```

This applies the initial schema migration to the database.

Then generate Prisma client:

docker-compose exec app npx prisma generate

---

🧪 Testing API Endpoints

The app runs on: http://localhost:3000

You can use Postman or Thunder Client to test endpoints like:

- POST /auth/register
- POST /auth/login
- GET /products
- POST /products (admin only)
- GET /reports/sales?startDate=2024-01-01&endDate=2024-12-31 (admin only)

---

👤 Admin Access

To access admin-specific routes:

- Ensure your user has the Admin role
- You can manually update the user role in the database after registration
- Or seed an admin user via a seed script

---

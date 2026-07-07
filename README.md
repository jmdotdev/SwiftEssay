# Swift Essay

Swift Essay is an academic writing marketplace where admins post writing orders and writers claim, complete, and submit them for payment. It's built as a full-stack Next.js application with a MongoDB backend.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Roles:**
  - **Admin:** Creates and manages orders, assigns/tracks writers, and processes payments.
  - **Writer:** Browses available orders, claims work, submits completed files, and tracks earnings.

- **Order Management:**
  - Admins create orders with discipline, deadline, pricing (per page/total), and reference files.
  - Writers claim unassigned orders and upload submitted files when work is complete.
  - Orders move through a status lifecycle: `unassigned → assigned → in_progress → revision → completed` (or `cancelled`).
  - File uploads (order attachments and submissions) are stored via Cloudinary.

- **Payments:**
  - Admins mark orders as paid; dedicated payment views for admins and writers track paid/unpaid orders.

- **Notifications:**
  - In-app notifications (new order, order paid, order completed) are created for relevant users and can be marked as read.

- **Authentication:**
  - JWT-based auth with login, registration, password reset, and a "forgot password" flow.
  - Route guards restrict admin-only API endpoints.

- **Dashboards:**
  - Role-specific dashboards (admin and writer) with a shared topbar/sidebar layout, order tables, and writer profile pages.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/swift-essay.git
   cd swift-essay
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory with the variables your environment needs, for example:

   ```
   MONGODB_URI=
   JWT_SECRET=
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   SMTP_HOST=
   SMTP_PORT=
   SMTP_USER=
   SMTP_PASS=
   ```

4. Run the development server:

   ```bash
   pnpm dev
   ```

5. Open your browser and visit [http://localhost:3000](http://localhost:3000) to view the app.

## Usage

1. **Admin:**
   - Create new orders, monitor their status, and edit order details.
   - View and manage writers, assign orders, and mark orders as paid.

2. **Writer:**
   - Browse available orders and claim ones matching their skills/deadline.
   - Submit completed files, track "my orders," and review payment history.
   - Manage profile details from a dedicated profile page.

## Tech Stack

- **Framework:** Next.js (App Router) with React
- **Language:** TypeScript
- **Database:** MongoDB via Mongoose
- **Auth:** JWT (jsonwebtoken, bcryptjs for password hashing)
- **File Storage:** Cloudinary
- **Email:** Nodemailer
- **UI:** Tailwind CSS, Radix UI primitives, shadcn-style components
- **Data Fetching/State:** TanStack Query, TanStack Table
- **Forms/Validation:** React Hook Form, Zod

## Project Structure

- `app/(auth)` — login, registration, and password reset pages
- `app/(dashboard)` — admin and writer dashboard pages (orders, payments, writers, profile)
- `app/api` — REST-style API routes for auth, orders, writers, and notifications
- `components/dashboard` — dashboard UI (topbar, order tables/detail views, etc.)
- `models` — Mongoose schemas (`User`, `Order`, `Notification`)
- `services` — client-side service functions that call the API routes
- `lib` — shared utilities (Mongoose connection, JWT helpers, mailer, notifications, validations)

## Contributing

We welcome contributions! Please follow our [contribution guidelines](CONTRIBUTING.md) to contribute to Swift Essay.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute it as per the license terms.

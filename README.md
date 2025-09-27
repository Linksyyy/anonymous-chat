# Anonymous Chat

This is a secure and anonymous chat application with a focus on privacy and end-to-end encryption.

## Technologies Used

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Database:** [PostgreSQL](https://www.postgresql.org/)
*   **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
*   **Real-time Communication:** [Socket.IO](https://socket.io/)
*   **Authentication:** [bcryptjs](https://www.npmjs.com/package/bcryptjs) & [jose](https://www.npmjs.com/package/jose) (JWT)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Deployment:** [Render](https://render.com/)

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or higher)
*   [Bun](https://bun.sh/) (or npm/yarn)
*   [PostgreSQL](https://www.postgresql.org/download/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/anonymous-chat.git
    cd anonymous-chat
    ```

2.  **Install dependencies:**

    ```bash
    bun install
    ```

### Environment Variables

Copy the [`.env.example`](.env.example) file to `.env` and update the values:

```bash
cp .env.example .env
```

Then, open the newly created `.env` file and fill in the following environment variables:

```
DATABASE_URL=<your-database-URL-(postgres-only)>
JWT_SECRET=<random-string>
```

Replace the placeholder values with your actual database connection string and a secure JWT secret.

### Database Migration

Run the following command to push the database schema changes:

```bash
bun run db:push
```

### Running the Application

1.  **Development Server:**

    ```bash
    bun run dev
    ```

    The application will be available at `http://localhost:3000`.

2.  **Production Build:**

    ```bash
    bun run build
    ```

3.  **Production Server:**

    ```bash
    bun run start:local
    ```

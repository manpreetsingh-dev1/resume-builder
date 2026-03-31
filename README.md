# Resume Builder

A MERN resume builder with authentication, resume editing, PDF import, and AI-assisted content enhancement.

## Project Structure

```text
resume-builder/
|-- server/        Backend API (Node.js + Express + MongoDB)
|-- vite-product/  Frontend app (React + Vite)
`-- README.md
```

## Local Setup

### Backend

```bash
cd server
npm install
```

Create `server/.env` from `server/.env.example`.

Required backend variables:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume_builder?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_secret
OPENAI_API_KEY=replace_with_your_api_key
OPENAI_MODEL=gpt-4o-mini
IMAGEKIT_PUBLIC_KEY=replace_with_your_public_key
IMAGEKIT_PRIVATE_KEY=replace_with_your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
ADMIN_EMAIL=you@example.com
RESEND_API_KEY=replace_with_your_resend_key
FEEDBACK_FROM_EMAIL=onboarding@resend.dev
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm start
```

### Frontend

```bash
cd vite-product
npm install
```

Create `vite-product/.env` from `vite-product/.env.example`.

Required frontend variable:

```env
VITE_BASE_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

## Deployment

### Backend

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Set environment variables from `server/.env.example`
- Set `FRONTEND_URL` to your deployed frontend URL

### Frontend

- Root directory: `vite-product`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_BASE_URL=https://your-backend-domain`
- If your host serves a React SPA, configure rewrites so all app routes resolve to `index.html`

## Security Notes

- Do not commit real `.env` files
- Rotate any secrets that were previously committed
- Use a MongoDB Atlas URI with an explicit database name

## Main API Routes

- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/users/data`
- `GET /api/users/resumes`
- `POST /api/resumes/create`
- `PUT /api/resumes/update`
- `POST /api/ai/upload-resume`
- `POST /api/feedback`

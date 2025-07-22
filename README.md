# EliteStore Frontend

A modern, responsive E-commerce storefront built with React, TypeScript, Vite, and TailwindCSS. This app connects to a Django REST API backend and supports product browsing, cart, checkout, and order history.

## Features
- Product grid and detail pages
- Add to cart, update quantity, remove items
- Checkout with form validation
- Order history for authenticated users
- JWT authentication (login/register)
- Responsive design with TailwindCSS
- Stripe payment integration (test mode)

## Tech Stack
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) (build tool)
- [TailwindCSS](https://tailwindcss.com/) (styling)
- [React Router](https://reactrouter.com/)
- [Stripe React SDK](https://stripe.com/docs/stripe-js/react)
- [Lucide React](https://lucide.dev/)

## Getting Started

### 1. Install dependencies
```sh
cd frontend
npm install
```

### 2. Development server
```sh
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for production
```sh
npm run build
```

### 4. Preview production build
```sh
npm run preview
```

## Environment Variables
Create a `.env` file in the `frontend/` directory if you need to override defaults or add secrets (e.g., Stripe keys):

```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=https://your-backend.onrender.com/api
```

- All Vite env vars must start with `VITE_`.
- The default API URL is `http://localhost:8000/api` (see `src/services/api.ts`).

## Deployment (Render)
- Deploy as a **Static Site** on [Render](https://render.com/):
  - Root Directory: `frontend`
  - Build Command: `npm run build`
  - Publish Directory: `dist`
- Set any required environment variables in the Render dashboard.
- For API calls, update `VITE_API_URL` to your backend’s public URL.

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
MIT

## Contact
For questions or support, open an issue or contact the maintainer. 
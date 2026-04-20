# Cartify

Cartify is a modern, fully responsive e-commerce web application built entirely with React. This project prioritizes fundamental React concepts, robust state management, and custom hooks over heavy reliance on external UI libraries to deliver a seamless shopping experience.

## 📋 Features

* **Advanced Routing:** Utilizes React Router DOM for comprehensive client-side routing, including dynamic product pages, cart, wishlist, and checkout flows.
* **Global State Management:** Features a custom Context API implementation (`CartContext`) that securely persists cart and wishlist states via `localStorage` without prop drilling.
* **Dynamic API Integration:** Communicates with external APIs (FakeStoreAPI) using an initialized Axios instance for retrieving product catalogs and category classifications.
* **Custom React Hooks:** Business logic is abstracted into highly reusable hooks, including `useProducts`, `useCart`, `useWishlist`, and a performance-critical `useDebounce` hook for optimized search querying.
* **Live Search & Filtering:** Features a debounced search engine and client-side filtering capabilities (price ranges, sorting algorithms) directly integrated into the product grid.
* **Robust Checkout Validation:** Implements `react-hook-form` and `yup` for rigorous, schema-driven validation (e.g., exact 16-digit credit card matching) and generates unique fulfillment IDs using `uuid`.
* **Premium UI/UX:** * Smooth page transitions and unmounting animations handled by Framer Motion's `<AnimatePresence>`.
  * Auto-playing responsive carousels built with SwiperJS.
  * Custom Toast notifications via React Toastify.
  * Bespoke vanilla CSS architecture utilizing high-contrast design principles, bypassing utility frameworks like Tailwind for a custom aesthetic.

## 🛠️ Technology Stack

* **Core:** React 19, Vite
* **Routing:** React Router DOM
* **Network:** Axios
* **Forms & Validation:** React Hook Form, Yup
* **UI & Animations:** Framer Motion, Swiper, React Toastify, React Icons

## 🚀 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd cartify
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Available Command Scripts**
   * `npm run dev` - Starts the Vite development server.
   * `npm run build` - Bundles the application for production.
   * `npm run lint` - Runs ESLint to evaluate code quality.
   * `npm run preview` - Previews the production build locally.
   * `npm run deploy` - Deploys the `dist` directory directly to GitHub Pages (runs `predeploy` first to build).
   
 

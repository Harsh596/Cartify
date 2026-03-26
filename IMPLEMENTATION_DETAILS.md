# Cartify Implementation Details

This document outlines everything done to build the Cartify E-Commerce application, fulfilling all PRD requirements by heavily prioritizing fundamental React concepts over external form-handling libraries.

## 1. Core Architecture and State Management
- **React Router DOM**: Set up the complete routing structure (`/`, `/products`, `/products/:id`, `/wishlist`, `/cart`, `/checkout`) utilizing `<Routes>` and `<Route>`.
- **Context API (`CartContext.jsx`)**: Built a robust global state manager to hold all Cart Items and Wishlist items without prop drilling. It securely persists and initializes state directly to/from `localStorage` inside `useState`.

## 2. Dynamic API Integration
- **`src/services/api.js`**: Replaced standard `fetch` with an initialized **Axios** instance. It communicates with `fakestoreapi.com` to fetch individual items, full catalogues, and raw category classifications.

## 3. Abstracted Custom Hooks
To keep UI components pristine, complex business logic was aggressively abstracted into reusable custom hooks (`src/hooks/`):
- **`useProducts()`**: Orchestrates data fetching, gracefully managing multi-state transitions (e.g., `loading`, `error`, `success`).
- **`useCart()`**: Provides contextual access and wrapper callbacks for the shopping cart.
- **`useWishlist()`**: Seamlessly interacts with `CartContext` to mutate user wishlists.
- **`useDebounce()`**: A performance-critical hook that deliberately delays the Search string processing by 400 milliseconds, preventing the application from crashing via excessive re-renders during rapid keystrokes.

## 4. Feature Implementations
1. **Product Grid & Details Page**: Mapped the `products` state into `ProductCard` components using a highly responsive CSS grid. The `ProductDetails` page dynamically captures the URL parameter (`const { id } = useParams()`) to request specific metadata.
2. **Category Tabs & Client-Side Filtering**: Fetches raw categories remotely, generating dynamic navigation tabs. Further integrated native client-side **Price Filters** ($0-$100, $500+, etc.) and **Sorting** methodologies (Price Ascending, Highest Rated, Newest) directly into `Products.jsx`.
3. **Live Search Engine**: Embedded a `SearchBar` linked to the `useDebounce` hook to instantly query the entire product catalog based on titles and category tags.
4. **Wishlist & Cart Economics**: Built visually premium Cart and Wishlist tables allowing full CRUD operations (add, adjust quantity, delete). The cart mathematically deduces dynamic subtotals, calculating a realistic 10% tax margin.
5. **Checkout Form Validation (`Checkout.jsx`)**: 
   - **Integrated `react-hook-form` & `yup`** to orchestrate robust, schema-driven form validation exactly as requested.
   - Designed a comprehensive `yup` validation schema that runs rigorous RegEx evaluations (e.g., matching exactly 16 credit card digits, validating expiry formats).
   - Once successfully checked out, the form purges the cart's context and generates a randomized hexadecimal fulfillment ID using the `uuid` package for maximum realism.

## 5. UI / UX Engineering
- **Framer Motion**: Orchestrated the `App.jsx` layout inside an `<AnimatePresence>` tree. Navigating between paths dynamically unmounts and remounts components with smooth opacity and vertical translation animations, completely eliminating harsh single-page application "flashes".
- **SwiperJS**: Engineered the Home page's `Featured Products` section into an auto-playing, swipe-enabled responsive carousel wrapper. 
- **React Toastify**: Replaced brutal browser `alert()` behaviors with buttery smooth Toast notifications anchored to the bottom right of the viewport when clicking "Add to Cart".
- **Aesthetic Direction**: Opted out of TailwindCSS in favor of a bespoke, vanilla CSS architectural pattern. Focused heavily on high-contrast colors, subtle box-shadow depth (`0 4px 15px rgba`), soft pill-based radii (`border-radius: 50px`), and immediate hover feedbacks to guarantee the platform feels strictly "human-built" and remarkably premium.

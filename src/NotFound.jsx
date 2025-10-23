// src/pages/NotFound.jsx
import { Link } from "react-router-dom";


export default function NotFound() {
  return (
    <div className="NotFoundPage">
      <h2>404 — Page Not Found</h2>
      <p>Oops! The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="homeLink">Go Back Home</Link>
    </div>
  );
}

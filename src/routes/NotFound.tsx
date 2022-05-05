import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">404!</h1>
          <p className="py-6">The page you are looking for does not exist.</p>
          <Link to="/" className="btn btn-primary">
            Go to home page
          </Link>
        </div>
      </div>
    </div>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-ink/10 bg-[#FAF7F2]/95 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl tracking-tight">
          Market<span className="text-accent">.</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-accent transition-colors">Catalog</Link>
          {isAdmin && (
            <Link to="/admin" className="hover:text-accent transition-colors">Admin</Link>
          )}
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-ink/60">{user?.fullName}</span>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="px-3 py-1.5 rounded-full border border-ink/15 hover:border-accent hover:text-accent transition-colors"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="hover:text-accent transition-colors">Log in</Link>
              <Link to="/register" className="px-3 py-1.5 rounded-full bg-ink text-white hover:bg-accent transition-colors">
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

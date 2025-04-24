
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="bg-barbershop-dark text-barbershop-light p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-barbershop-gold">
          Sharp Cuts
        </Link>
        <div className="space-x-6">
          <Link to="/" className="hover:text-barbershop-gold transition-colors">
            Home
          </Link>
          <Link to="/dashboard" className="hover:text-barbershop-gold transition-colors">
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
};

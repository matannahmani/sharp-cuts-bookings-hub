
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User } from "lucide-react";

export const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-barbershop-dark text-barbershop-light p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-barbershop-gold">
          Sharp Cuts
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-barbershop-gold transition-colors">
            Home
          </Link>
          {user && (
            <>
              <Link to="/dashboard" className="hover:text-barbershop-gold transition-colors">
                Dashboard
              </Link>
              <Link to="/services" className="hover:text-barbershop-gold transition-colors">
                Services
              </Link>
            </>
          )}
          
          <div className="ml-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  <span className="text-sm hidden md:inline">{user.email}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={signOut}
                  className="border-barbershop-gold text-barbershop-gold hover:bg-barbershop-gold/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">Sign Out</span>
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button 
                  asChild
                  variant="outline" 
                  size="sm" 
                  className="border-barbershop-gold text-barbershop-gold hover:bg-barbershop-gold/10"
                >
                  <Link to="/auth/login">Sign In</Link>
                </Button>
                <Button 
                  asChild 
                  size="sm" 
                  className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-cream"
                >
                  <Link to="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

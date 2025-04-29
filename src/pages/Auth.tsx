
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/context/AuthContext";

export default function Auth() {
  const { action } = useParams<{ action: string }>();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  // Determine if we're on login or signup page
  const formType = action === "signup" ? "signup" : "login";

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      navigate("/dashboard");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto py-16 px-4">
        <h1 className="text-4xl font-bold text-center mb-10 text-barbershop-dark">
          {formType === "login" ? "Sign In" : "Create Account"}
        </h1>
        <AuthForm type={formType} />
      </div>
    </div>
  );
}

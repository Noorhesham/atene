import LoginForm from "@/components/forms/LoginForm";
import MaxWidthWrapper from "@/components/MaxwidthWrapper";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from location state, default to products page
  const from = location.state?.from?.pathname || "/products";

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from]);

  // Don't render anything while checking authentication
  if (isLoading) {
    return null;
  }

  // Only render the form if not authenticated
  return (
    <MaxWidthWrapper>
      <div className="my-10 lg:my-20">
        <LoginForm />
      </div>
    </MaxWidthWrapper>
  );
};

export default Login;

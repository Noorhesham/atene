import LoginForm from "@/components/forms/LoginForm";
import MaxWidthWrapper from "@/components/MaxwidthWrapper";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/products");
    }
  }, [isAuthenticated, isLoading, navigate]);

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

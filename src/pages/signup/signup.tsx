import SignupForm from "@/components/forms/SignupForm";
import MaxWidthWrapper from "@/components/MaxwidthWrapper";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Don't render anything while checking authentication
  if (isLoading) {
    return null;
  }

  // Only render the form if not authenticated
  return (
    <MaxWidthWrapper>
      <SignupForm />
    </MaxWidthWrapper>
  );
};

export default Signup;

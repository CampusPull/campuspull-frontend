import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function useRequireAuth() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const requireAuth = (action) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    action();
  };

  return requireAuth;
}
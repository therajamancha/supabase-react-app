import { useState, createContext, useEffect, useContext } from "react";
import { useNavigate, type SessionData } from "react-router";
import { getSession } from "~/services/auth.services";
import { supabase } from "~/supabase-client";

const AuthContext = createContext<{
  session?: SessionData | null;
  setSession: (session: SessionData) => void;
}>({
  session: null,
  setSession: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [session, setSession] = useState<SessionData | null>(null);

  const checkAuth = async () => {
    const response = await getSession();
    if (response.session) {
      setSession(response.session);
    } else {
      setSession(null);
      navigate("/admin/login");
    }
  };

  useEffect(() => {
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, _session) => {
        setSession(_session);
        if (event === "SIGNED_OUT") {
          navigate("/admin/login");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, setSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

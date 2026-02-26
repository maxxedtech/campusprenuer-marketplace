import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";

const API_URL = "https://townketbackend.onrender.com";

type AuthState = {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

type AuthContextType = AuthState & {
  login: (email: string, password: string) => Promise<any>;
  signup: (
    name: string,
    email: string,
    password: string,
    role: string
  ) => Promise<any>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setState] = useState<AuthState>(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    return {
      user: storedUser ? JSON.parse(storedUser) : null,
      token: storedToken,
      isAuthenticated: !!storedToken,
      isLoading: false,
    };
  });

  // ================= LOGIN =================

const login = useCallback(async (email: string, password: string) => {
  setState((prev) => ({ ...prev, isLoading: true }));

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Login failed");
    }

    // ✅ SAVE TO LOCAL STORAGE
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);

    setState({
      user: data.user,
      token: data.token,
      isAuthenticated: true,
      isLoading: false,
    });

    return data.user; // important
  } catch (error: any) {
    setState((prev) => ({ ...prev, isLoading: false }));
    throw new Error(error?.message || "Something went wrong");
  }
}, []);
  // ================= SIGNUP =================
  const signup = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      role: string
    ) => {
      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: name,
            email,
            password,
            role,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "Signup failed");
        }

        // ✅ SAVE TO LOCAL STORAGE
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        setState({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
          isLoading: false,
        });

        return data.user;
      } catch (error: any) {
        setState((prev) => ({ ...prev, isLoading: false }));
        throw new Error(error?.message || "Something went wrong");
      }
    },
    []
  );

  return (
    <AuthContext.Provider value={{ ...state, login, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

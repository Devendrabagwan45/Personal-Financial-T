import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = backendUrl;

export const Authcontext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);

  //check if user is authenticated
  const checkAuth = async () => {
    try {
      const currentToken = localStorage.getItem("token");
      if (!currentToken) {
        setAuthUser(null);
        return;
      }

      const { data } = await axios.get("/api/auth/check", {
        headers: {
          token: currentToken,
        },
      });

      if (data.success) {
        setAuthUser(data.user);
      }
    } catch (error) {
      // Handle 401 and other auth errors gracefully
      if (error.response?.status === 401) {
        // Token is invalid or expired, clear it
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
      } else {
        console.error("Auth check failed:", error.message);
      }
    }
  };

  //login function to handle user authentication
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        setAuthUser(data.userData);

        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //logout function to handle user logout
  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);

    axios.defaults.headers.common["token"] = null;
    toast.success("logged out successfully");
  };

  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.userData);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
      checkAuth();
    } else {
      setAuthUser(null);
    }
  }, [token]);

  const value = {
    axios,
    authUser,
    login,
    logout,
    updateProfile,
  };
  return <Authcontext.Provider value={value}>{children}</Authcontext.Provider>;
};

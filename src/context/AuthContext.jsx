
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

const API_URL = "http://localhost:5000/api";

/*
|--------------------------------------------------------------------------
| AuthProvider
|--------------------------------------------------------------------------
*/

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | Load logged-in user when application starts
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadUser = async () => {
      const savedUser = localStorage.getItem("currentUser");
      const token = localStorage.getItem("authToken");

      // Agar login data hi nahi hai
      if (!savedUser || !token) {
        setLoading(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(savedUser);

        /*
        |--------------------------------------------------------------------------
        | Temporary state set
        |--------------------------------------------------------------------------
        */

        setUser(parsedUser);

        /*
        |--------------------------------------------------------------------------
        | Backend se latest user verify karo
        |--------------------------------------------------------------------------
        */

        const response = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok && data.user) {
          setUser(data.user);

          localStorage.setItem(
            "currentUser",
            JSON.stringify(data.user)
          );

          // Existing project ke liye bhi save karo
          localStorage.setItem(
            "ananyaUser",
            JSON.stringify(data.user)
          );
        } else {
          /*
          |--------------------------------------------------------------------------
          | Token invalid / expired
          |--------------------------------------------------------------------------
          */

          localStorage.removeItem("currentUser");
          localStorage.removeItem("authToken");
          localStorage.removeItem("ananyaUser");

          setUser(null);
        }
      } catch (error) {
        console.error("Auth restore error:", error);

        /*
        |--------------------------------------------------------------------------
        | Invalid localStorage data
        |--------------------------------------------------------------------------
        */

        localStorage.removeItem("currentUser");
        localStorage.removeItem("authToken");
        localStorage.removeItem("ananyaUser");

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | LOGIN
  |--------------------------------------------------------------------------
  |
  | Login.jsx se:
  |
  | login(userData, token, rememberMe)
  |
  */

  const login = (
    userData,
    token = null,
    rememberMe = true
  ) => {
    try {
      /*
      |--------------------------------------------------------------------------
      | User state
      |--------------------------------------------------------------------------
      */

      setUser(userData);

      /*
      |--------------------------------------------------------------------------
      | Current user
      |--------------------------------------------------------------------------
      */

      localStorage.setItem(
        "currentUser",
        JSON.stringify(userData)
      );

      /*
      |--------------------------------------------------------------------------
      | Existing Checkout/Profile code ke liye
      |--------------------------------------------------------------------------
      */

      localStorage.setItem(
        "ananyaUser",
        JSON.stringify(userData)
      );

      /*
      |--------------------------------------------------------------------------
      | JWT Token
      |--------------------------------------------------------------------------
      */

      if (token) {
        localStorage.setItem("authToken", token);
      }

      /*
      |--------------------------------------------------------------------------
      | Remember Me
      |--------------------------------------------------------------------------
      */

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }
    } catch (error) {
      console.error("Login save error:", error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */

  const logout = () => {
    try {
      /*
      |--------------------------------------------------------------------------
      | Auth data remove
      |--------------------------------------------------------------------------
      */

      localStorage.removeItem("currentUser");
      localStorage.removeItem("authToken");
      localStorage.removeItem("ananyaUser");
      localStorage.removeItem("rememberMe");

      /*
      |--------------------------------------------------------------------------
      | Admin login data
      |--------------------------------------------------------------------------
      */

      localStorage.removeItem("adminLoggedIn");

      /*
      |--------------------------------------------------------------------------
      | React state
      |--------------------------------------------------------------------------
      */

      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | UPDATE USER
  |--------------------------------------------------------------------------
  |
  | Profile se user information update karne ke liye.
  |
  | Example:
  |
  | updateUser({
  |   name: "Amit",
  |   phone: "9876543210",
  |   address: "Delhi"
  | })
  |
  */

  const updateUser = async (updatedData) => {
    try {
      if (!user) {
        return {
          success: false,
          message: "User is not logged in",
        };
      }

      const token = localStorage.getItem("authToken");

      if (!token) {
        return {
          success: false,
          message: "Authentication token not found",
        };
      }

      /*
      |--------------------------------------------------------------------------
      | Backend ko update request
      |--------------------------------------------------------------------------
      */

      const response = await fetch(`${API_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      /*
      |--------------------------------------------------------------------------
      | Backend response
      |--------------------------------------------------------------------------
      */

      if (!response.ok) {
        return {
          success: false,
          message:
            data.message || "Unable to update profile",
        };
      }

      /*
      |--------------------------------------------------------------------------
      | Latest user
      |--------------------------------------------------------------------------
      */

      const updatedUser = data.user || {
        ...user,
        ...updatedData,
      };

      /*
      |--------------------------------------------------------------------------
      | React state update
      |--------------------------------------------------------------------------
      */

      setUser(updatedUser);

      /*
      |--------------------------------------------------------------------------
      | currentUser update
      |--------------------------------------------------------------------------
      */

      localStorage.setItem(
        "currentUser",
        JSON.stringify(updatedUser)
      );

      /*
      |--------------------------------------------------------------------------
      | ananyaUser update
      |--------------------------------------------------------------------------
      */

      localStorage.setItem(
        "ananyaUser",
        JSON.stringify(updatedUser)
      );

      /*
      |--------------------------------------------------------------------------
      | Return result
      |--------------------------------------------------------------------------
      */

      return {
        success: true,
        message:
          data.message || "Profile updated successfully",
        user: updatedUser,
      };
    } catch (error) {
      console.error("Update user error:", error);

      return {
        success: false,
        message: "Server error. Please try again.",
      };
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Refresh user from backend
  |--------------------------------------------------------------------------
  */

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        return null;
      }

      const response = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok && data.user) {
        setUser(data.user);

        localStorage.setItem(
          "currentUser",
          JSON.stringify(data.user)
        );

        localStorage.setItem(
          "ananyaUser",
          JSON.stringify(data.user)
        );

        return data.user;
      }

      return null;
    } catch (error) {
      console.error("Refresh user error:", error);
      return null;
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Context Value
  |--------------------------------------------------------------------------
  */

  const contextValue = {
    user,

    login,

    logout,

    updateUser,

    refreshUser,

    isLoggedIn: !!user,

    loading,
  };

  /*
  |--------------------------------------------------------------------------
  | Provider
  |--------------------------------------------------------------------------
  */

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/*
|--------------------------------------------------------------------------
| useAuth Hook
|--------------------------------------------------------------------------
*/

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};

export default AuthContext;

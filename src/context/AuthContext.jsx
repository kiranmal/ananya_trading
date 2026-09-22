import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Invalid user data");
        localStorage.removeItem("currentUser");
      }
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem(
      "currentUser",
      JSON.stringify(userData)
    );

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  const updateUser = (updatedData) => {
    const updatedUser = {
      ...user,
      ...updatedData,
    };

    localStorage.setItem(
      "currentUser",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);

    // Users list bhi update karo
    const savedUsers = localStorage.getItem("users");

    if (savedUsers) {
      try {
        const users = JSON.parse(savedUsers);

        const updatedUsers = users.map((item) =>
          item.email === updatedUser.email
            ? {
                ...item,
                ...updatedUser,
              }
            : item
        );

        localStorage.setItem(
          "users",
          JSON.stringify(updatedUsers)
        );
      } catch (error) {
        console.error("Users data error");
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
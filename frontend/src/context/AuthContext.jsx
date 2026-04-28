import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const name = localStorage.getItem("name");

        if (token) {
            setUser({ token, role, name });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post("/api/auth/login", { email, password });
            
            if (response.status === 200 && response.data?.token) {
                const { token, role, name } = response.data;

                localStorage.setItem("token", token);
                localStorage.setItem("role", role);
                localStorage.setItem("name", name);

                setUser({ token, role, name });
                return { success: true, role };
            } else {
                return { success: false, message: "Invalid credentials" };
            }
        } catch (error) {
            console.error("Login failed", error);
            return { success: false, message: "Invalid credentials" };
        }
    };

    const register = async (name, email, password, role) => {
        try {
            const response = await api.post("/api/auth/register", { name, email, password, role });
            
            if (response.status === 200 && response.data?.token) {
                const { token: newToken, role: newRole, name: newName } = response.data;

                localStorage.setItem("token", newToken);
                localStorage.setItem("role", newRole);
                localStorage.setItem("name", newName);

                setUser({ token: newToken, role: newRole, name: newName });
                return { success: true, role: newRole };
            } else {
                return { success: false, message: "Registration failed" };
            }
        } catch (error) {
            console.error("Registration failed", error);
            return { success: false, message: error.response?.data?.message || "Registration failed" };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

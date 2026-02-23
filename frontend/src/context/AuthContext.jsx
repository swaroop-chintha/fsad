import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

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

        // Add interceptor to automatically add token to requests
        const interceptor = axios.interceptors.request.use(
            (config) => {
                const storedToken = localStorage.getItem("token");
                if (storedToken) {
                    config.headers["Authorization"] = `Bearer ${storedToken}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(interceptor);
        };
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post("/api/auth/login", { email, password });
            const { token, role, name } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("role", role);
            localStorage.setItem("name", name);

            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            setUser({ token, role, name });
            return { success: true, role };
        } catch (error) {
            console.error("Login failed", error);
            return { success: false, message: error.response?.data?.message || "Login failed" };
        }
    };

    const register = async (name, email, password, role) => {
        try {
            const response = await axios.post("/api/auth/register", { name, email, password, role });
            const { token: newToken, role: newRole, name: newName } = response.data;

            localStorage.setItem("token", newToken);
            localStorage.setItem("role", newRole);
            localStorage.setItem("name", newName);

            axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
            setUser({ token: newToken, role: newRole, name: newName });
            return { success: true, role: newRole };
        } catch (error) {
            console.error("Registration failed", error);;
            return { success: false, message: error.response?.data?.message || "Registration failed" };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        delete axios.defaults.headers.common["Authorization"];
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

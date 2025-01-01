'use client';

import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

interface UserResource {
    id: string | number;
    name: string;
    email: string;
    phone: string;
    dateOfBirth: string;
}

interface AuthContextType {
    user: UserResource | null;
    setUser: (user: UserResource | null) => void;
    isAuthenticated: boolean;
    login: (phone: string) => void;
    logout: () => void;
    token: string | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => { },
    isAuthenticated: false,
    login: () => { },
    logout: () => { },
    token: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserResource | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const fetchUserData = useCallback(async () => {
        if (!token) return;

        try {
            const response = await fetch('https://cry-com.ru/api/v1/user', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.user) {
                    const userData = {
                        id: data.user.id,
                        name: data.user.name || '',
                        email: data.user.email || '',
                        phone: data.user.phone || '',
                        dateOfBirth: data.user.dateOfBirth || ''
                    };
                    setUser(userData);
                } else {
                    console.error('Unexpected API response structure:', data);
                }
            } else if (response.status === 401) {
                console.error('Authentication failed:', await response.text());
                setToken(null);
                setUser(null);
                localStorage.removeItem('token');
            } else {
                console.error('API error:', response.status, await response.text());
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }, [token]);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        if (token) {
            fetchUserData();
        }
    }, [token, fetchUserData]);

    const login = async (phone: string) => {
        // Existing login logic...
        // After successful login and getting token:
        const newToken = 'newToken'; // Replace with actual token
        setToken(newToken);
        localStorage.setItem('token', newToken);
        // fetchUserData will be called automatically due to token change
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    const value = {
        user,
        setUser,
        isAuthenticated: !!token,
        login,
        logout,
        token,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

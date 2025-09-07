// "use client"

// import type React from "react"
// import axios from 'axios';
// import { createContext, useContext, useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { TypeOf } from "zod";
// import { config } from "process";

// interface User {
//   id: string
//   name: string
//   email: string
//   avatar: string
// }

// interface AuthContextType {
//   user: User | null
//   login: (email: string, password: string) => Promise<boolean>
//   register: (name: string, email: string, password: string) => Promise<boolean>
//   logout: () => void
//   isLoading: boolean
//   axiosInstance: typeof axios
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const router = useRouter()

//   const axiosInstance = axios.create({
//     baseURL: 'http://localhost:3001',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   axiosInstance.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     console.log('Token enviado:', token);
//     if(token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   });
//   useEffect(() => {
//     // Check if user is logged in on app start
//     const savedUser = localStorage.getItem("smartquote_user")
//     if (savedUser) {
//       setUser(JSON.parse(savedUser))
//     }
//     setIsLoading(false)
//   }, [])

//   const login = async (email: string, password: string): Promise<boolean> => {
//     setIsLoading(true)

//     try
//     {
//       const response = await axios.post('http://localhost:3001/auth/login',
//       {
//         email,
//         password,
//       })
//       const { acess_token } = response.data;
//       localStorage.setItem('token', acess_token);
//       setUser({ email });
//       return(true);
//     }catch (error) {
//       console.error('Erro no login:', error)
//       return false;
//     } finally {
//       setIsLoading(false);
//       router.push("/dashboard")
//     }

//     const logout = () => {
//       localStorage.removeItem('token');
//       localStorage.removeItem('smartquote_user');
//       setUser(null);
//       router.push('/login');
//     };
//     return (
//       <AuthContext.Provider value={{ user, isLoading, login, logout, axiosInstance }}>
//         {children}
//       </AuthContext.Provider>
//     );
    
//   }

//   const register = async (name: string, email: string, password: string): Promise<boolean> => {
//     setIsLoading(true)

//     // Mock registration - in real app, this would be an API call
//     await new Promise((resolve) => setTimeout(resolve, 1000))

//     const userData = {
//       id: Date.now().toString(),
//       name,
//       email,
//       avatar: "/diverse-user-avatars.png",
//     }

//     setUser(userData)
//     localStorage.setItem("smartquote_user", JSON.stringify(userData))
//     setIsLoading(false)
//     router.push("/dashboard")
//     return true
//   }

//   const logout = () => {
//     setUser(null)
//     localStorage.removeItem("smartquote_user")
//     router.push("/")
//   }

//   return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }

'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  axiosInstance: typeof axios;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001/',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    console.log('Token enviado:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('smartquote_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/auth/login', {
        email,
        password,
      });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      const user = { email };
      setUser(user);
      localStorage.setItem('smartquote_user', JSON.stringify(user));
      router.push('/dashboard');
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/auth/register', {
        name,
        email,
        password,
      });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      const user = { email };
      setUser(user);
      localStorage.setItem('smartquote_user', JSON.stringify(user));
      router.push('/dashboard');
      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('smartquote_user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, axiosInstance }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
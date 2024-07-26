import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"
import axios from "axios"
import { config } from "./config"

interface AuthContextProps {
  token: string | null
  username: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextProps>({
  token: null,
  username: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem("token")
    const savedUsername = localStorage.getItem("username")
    if (savedToken) {
      setToken(savedToken)
      setUsername(savedUsername)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${config.endpoint}/users/login`, {
        username: email,
        password: password,
      })
      setToken(response.data.token)
      setUsername(response.data.username)
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("username", response.data.username)
    } catch (error: any) {
      console.error("Login failed:", error?.response?.data || error?.message)
      throw error
    }
  }

  const register = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${config.endpoint}/users/register`, {
        username: email,
        password: password,
      })
      setToken(response.data.token)
      setUsername(response.data.username)
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("username", response.data.username)
    } catch (error: any) {
      console.error(
        "Registration failed:",
        error?.response?.data || error?.message
      )
      throw error
    }
  }

  const logout = () => {
    setToken(null)
    setUsername(null)
    localStorage.removeItem("token")
    localStorage.removeItem("username")
  }

  return (
    <AuthContext.Provider value={{ token, username, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

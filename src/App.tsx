import "./App.css"
import { useAuth, AuthProvider } from "./SessionContext"
import Auth from "./Auth"
import Portal from "./Portal"
import { ConfigProvider, theme } from "antd"

function AppContent() {
  const { username } = useAuth()

  return !username ? <Auth /> : <Portal key={username} />
}

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
      }}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ConfigProvider>
  )
}

export default App

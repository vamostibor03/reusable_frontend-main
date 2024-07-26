import React, { useState } from "react";
import { Input, Button, Alert, Checkbox, Typography } from "antd";
import { useAuth } from "./SessionContext";

const { Title, Paragraph } = Typography;

export default function Auth() {
  const { login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isRegisterRoute, setIsRegisterRoute] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await login(email, password);
      setMessage("Logged in successfully");
    } catch (error) {
      setMessage("Error logging in");
    }

    setLoading(false);
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!acceptTerms) {
      setMessage("You must accept the terms and conditions to register.");
      setLoading(false);
      return;
    }

    try {
      await register(email, password);
      setMessage("Registered successfully");
    } catch (error) {
      setMessage("Error registering");
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <Title level={2}>Authentication</Title>
        <Paragraph>
          {isRegisterRoute ? "Register" : "Login"} with your credentials below
        </Paragraph>
        {message && (
          <Alert
            message={message}
            type={"info"}
            showIcon
            className="auth-alert"
          />
        )}
        {isRegisterRoute ? (
          <form onSubmit={handleRegister}>
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              required={true}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
            />
            <Input
              type="password"
              placeholder="Your password"
              value={password}
              required={true}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
            />
            <Input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              required={true}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="auth-input"
            />
            <Checkbox
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="auth-checkbox"
            >
              I accept the terms and conditions
            </Checkbox>
            <Button
              htmlType="submit"
              loading={loading}
              className="auth-button"
            >
              {loading ? "Loading" : "Register"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              required={true}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
            />
            <Input
              type="password"
              placeholder="Your password"
              value={password}
              required={true}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
            />
            <Button
              htmlType="submit"
              loading={loading}
              className="auth-button"
            >
              {loading ? "Loading" : "Login"}
            </Button>
          </form>
        )}
        <Paragraph className="auth-toggle">
            {isRegisterRoute ? "Already have an account?" : "Don't have an account?"}{" "}
          <span onClick={() => setIsRegisterRoute(!isRegisterRoute)} style={{color:"black"}}>
            {isRegisterRoute ? "Login here." : "Register here."}
          </span>
        </Paragraph>
      </div>
    </div>
  );
}

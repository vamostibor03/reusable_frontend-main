import React, { useState } from "react";
import { Button, Layout } from "antd";
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Account from "./Account";
import { PlusOutlined, ArrowLeftOutlined, LogoutOutlined } from "@ant-design/icons";
import "./styles.css"; // Add this line to include custom styling
import Statistics from "./Statistics";
import Surveys from "./Surveys";
import CreateSurvey from "./CreateSurvey"; // Import the CreateSurvey component
import { useAuth } from "./SessionContext";

const { Content, Header } = Layout;

const Portal: React.FC = () => {
  return (
    <Router>
      <Layout style={{ height: "100vh" }}>
        <PortalLayout />
      </Layout>
    </Router>
  );
};

const PortalLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To get the current route
  const { token, username: authUsername, logout } = useAuth();
  const [username, setUsername] = useState(authUsername || "User");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleGoBack = () => {
    navigate("/surveys");
  };

  return (
    <Layout>
      <Layout>
        <Header className="header">
          <div>{username}</div>
          {location.pathname === "/create-survey" ? (
            <Button className="go-back-button" icon={<ArrowLeftOutlined />} onClick={handleGoBack}>
              Go Back
            </Button>
          ) : (
            <>
              <Button className="new-survey-button" icon={<PlusOutlined />} onClick={() => navigate('/create-survey')}>
                New Survey
              </Button>
              <Button className="logout-button" icon={<LogoutOutlined />} onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Header>
        <Content className="content">
          <Routes>
            <Route path="/account" element={<Account />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/surveys" element={<Surveys />} />
            <Route path="/create-survey" element={<CreateSurvey />} />
            <Route path="/" element={<Surveys />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Portal;

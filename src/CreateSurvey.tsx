import React from "react";
import { Form, Input, Button, Select, InputNumber, Upload, notification, Tooltip } from "antd";
import { UploadOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./SessionContext";
import { config } from "./config";
import "./CreateSurvey.css"; // Import custom styles

const { Option } = Select;

const CreateSurvey: React.FC = () => {
  const { token, username } = useAuth();
  const navigate = useNavigate();

  const handleCreateSurvey = async (values: any) => {
    try {
      const response = await fetch(`${config.endpoint}/surveys/createSurvey`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...values, username }), // Include username in the request
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      notification.success({ message: "Survey created successfully", description: `Survey ID: ${data.survey._id}` });
      navigate("/surveys");
    } catch (error) {
      const errorMessage = (error as Error).message || (error as Error).toString();
      notification.error({ message: "Error", description: errorMessage });
      console.error("Create Survey Error:", error);
    }
  };

  return (
    <div className="create-survey-container-wrapper">
      <div className="create-survey-container">
        <h2>Create New Survey</h2>
        <p>Fill out the form below to configure your new survey.</p>
        <Form onFinish={handleCreateSurvey} layout="vertical">
          <Form.Item label="Survey Name" name="name" rules={[{ required: true, message: "Please input the survey name!" }]}>
            <Input placeholder="Enter survey name" />
          </Form.Item>

          <Form.Item label="System Prompt" name="systemPrompt" rules={[{ required: true, message: "Please input the system prompt!" }]}>
            <Input.TextArea rows={4} placeholder="Enter system prompt" />
          </Form.Item>

          <Form.Item label="Instruction Text" name="instructionText">
            <Input.TextArea rows={4} placeholder="Enter instructions" />
          </Form.Item>

          <Form.Item label="Timer (minutes)" name="timer" rules={[{ type: 'number', min: 1, max: 15 }]}>
            <InputNumber min={1} max={15} />
          </Form.Item>

          <Form.Item label={
            <span>
              Button Description&nbsp;
              <Tooltip title="This text will be displayed on the button">
                <InfoCircleOutlined />
              </Tooltip>
            </span>
          } name="buttonDescription" rules={[{ required: true, message: "Please input the button description!" }]}>
            <Input placeholder="Enter button description" />
          </Form.Item>

          <Form.Item label={
            <span>
              Button Link&nbsp;
              <Tooltip title="Enter the URL the button should link to">
                <InfoCircleOutlined />
              </Tooltip>
            </span>
          } name="buttonLink" rules={[{ required: true, message: "Please input the button link!" }]}>
            <Input placeholder="Enter button link" />
          </Form.Item>

          <Form.Item label="Chatbot Picture">
            <Form.Item name="chatbotPicture" valuePropName="fileList" getValueFromEvent={(e) => e && e.fileList} noStyle>
              <Upload name="chatbotPicture" action="/upload.do" listType="picture">
                <Button icon={<UploadOutlined />}>Click to upload</Button>
              </Upload>
            </Form.Item>
          </Form.Item>

          <Form.Item label="Primary Color" name="primaryColor">
            <Input type="color" />
          </Form.Item>

          <Form.Item label="Secondary Color" name="secondaryColor">
            <Input type="color" />
          </Form.Item>

          <Form.Item label={
            <span>
              Qualtrics Query Parameter&nbsp;
              <Tooltip title="Parameter to identify the interaction in Qualtrics">
                <InfoCircleOutlined />
              </Tooltip>
            </span>
          } name="qualtricsQueryParameter" rules={[{ required: true, message: "Please input the Qualtrics query parameter!" }]}>
            <Input placeholder="Enter Qualtrics query parameter" />
          </Form.Item>

          <Form.Item label={
            <span>
              Result Mode&nbsp;
              <Tooltip title="Choose how the results should be saved">
                <InfoCircleOutlined />
              </Tooltip>
            </span>
          } name="resultMode" rules={[{ required: true, message: "Please select the result mode!" }]}>
            <Select>
              <Option value="files">Files</Option>
              <Option value="text">Text String</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="create-button">Create Survey</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CreateSurvey;

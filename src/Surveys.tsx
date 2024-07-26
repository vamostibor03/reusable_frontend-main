import React, { useEffect, useState } from "react";
import { Table, Button, notification } from "antd";
import { PlayCircleFilled, PauseCircleFilled, DeleteFilled, ShareAltOutlined } from "@ant-design/icons";
import { useAuth } from "./SessionContext";
import { config } from "./config";
import "./styles.css";

const Surveys: React.FC = () => {
  const { token, username } = useAuth();
  const [surveys, setSurveys] = useState<any[]>([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      console.log("Token:", token); // Log the token to verify it
      console.log("Username:", username); // Log the username to verify it

      try {
        const response = await fetch(`${config.endpoint}/surveys/byUser?username=${username}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        const data = await response.json();
        setSurveys(data.map((survey: any, index: number) => ({ key: index + 1, ...survey })));
      } catch (error) {
        const errorMessage = (error as Error).message || (error as Error).toString();
        notification.error({ message: "Error", description: errorMessage });
        console.error("Fetch Surveys Error:", error);
      }
    };

    fetchSurveys();
  }, [token, username]);

  const columns = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Date',
      dataIndex: 'creationDate',
      key: 'creationDate',
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string | undefined) => (
        <span className={status === 'open' ? 'survey-status-open' : 'survey-status-paused'}>
          {status ? status.toUpperCase() : 'N/A'}
        </span>
      ),
    },
    {
      title: 'Participants',
      dataIndex: 'participants',
      key: 'participants',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: any) => (
        <span>
          {record.status === 'open' ? (
            <Button className='action-button' icon={<PauseCircleFilled />} />
          ) : (
            <Button className='action-button' icon={<PlayCircleFilled />} />
          )}
          <Button className='action-button' icon={<ShareAltOutlined />} style={{ marginLeft: 8 }} />
          <Button icon={<DeleteFilled />} className='action-button-delete' />
        </span>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 className="table-header">All surveys</h1>
      <Table className='ant-table' dataSource={surveys} columns={columns} pagination={false} />
    </div>
  );
};

export default Surveys;

import { useState, useEffect } from "react"
import { Form, Input, Button, message, Space, Typography, Card } from "antd"
import { LogoutOutlined } from "@ant-design/icons"
import { useAuth } from "./SessionContext"
import axios from "axios"
import { config } from "./config"

const { Title } = Typography

export default function Account() {
  const { token, username: authUsername, logout } = useAuth()
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState<string>("")
  const [website, setWebsite] = useState<string>("")
  const [avatar_url, setAvatarUrl] = useState<string>("")

  useEffect(() => {
    let ignore = false
    async function getProfile() {
      setLoading(true)
      try {
        const response = await axios.get(`${config.endpoint}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!ignore && response.data) {
          const { username, website, avatar_url } = response.data
          setUsername(username)
          setWebsite(website)
          setAvatarUrl(avatar_url)
        }
      } catch (error: any) {
        console.warn(error.response?.data || error.message)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      getProfile()
    }

    return () => {
      ignore = true
    }
  }, [token])

  async function updateProfile(event: React.FormEvent, avatarUrl?: string) {
    event?.preventDefault?.()

    setLoading(true)
    try {
      const updates = {
        username,
        website,
        avatar_url: avatarUrl || avatar_url,
      }

      const response = await axios.put(
        `${config.endpoint}/users/profile`,
        updates,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data) {
        setAvatarUrl(avatarUrl || avatar_url)
        message.success("Profile updated successfully")
      }
    } catch (error: any) {
      message.error(error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Space
      direction='vertical'
      size='large'
      style={{ display: "flex", alignItems: "center" }}>
      <Title level={3}>Account</Title>
      <Card style={{ width: 500, padding: 20 }}>
        <Form
          onFinish={(event) =>
            updateProfile(event as unknown as React.FormEvent)
          }
          layout='vertical'
          initialValues={{
            email: authUsername || "",
            username: username || "",
            website: website || "",
          }}>
          <Form.Item label='Email' name='email'>
            <Input type='text' disabled value={authUsername || ""} />
          </Form.Item>

          <Form.Item
            label='Name'
            name='username'
            rules={[
              { required: true, message: "Please input your username!" },
            ]}>
            <Input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>

          <Form.Item label='Website' name='website'>
            <Input
              type='url'
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' loading={loading} block>
              {loading ? "Loading ..." : "Update"}
            </Button>
          </Form.Item>

          <Form.Item>
            <Button onClick={logout} icon={<LogoutOutlined />} block>
              Sign Out
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Space>
  )
}

import { Space, Typography, Card } from "antd"
const { Title } = Typography

export default function Statistics() {
  return (
    <Space
      direction='vertical'
      size='large'
      style={{ display: "flex", alignItems: "center" }}>
      <Space direction='vertical' size='large'>
        <Title level={4}>Statistics</Title>
        <Card>
          {/* <Statistic title='Total Users' value={1000} />
          <Statistic title='Active Users' value={800} />
          <Statistic title='Inactive Users' value={200} /> */}
        </Card>
      </Space>
    </Space>
  )
}

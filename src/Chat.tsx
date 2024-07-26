import { ProChat, ProChatInstance } from "@ant-design/pro-chat"
import React, { useEffect, useRef, useState } from "react"
import { useAuth } from "./SessionContext"
import { useParams } from "react-router-dom"
import { Button, Space } from "antd"
import { config } from "./config"

const Chat: React.FC = (props) => {
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()
  const { id } = useParams<{ id: string }>()
  const [thread, setThread] = useState<any>({})
  const proChatRef = useRef<ProChatInstance>()

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true)
      const response = await fetch(`${config.endpoint}/threads/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      setThread(data)
      setLoading(false)
    }

    fetchChats()
  }, [id])

  const updateChat = async (chats: Array<any>) => {
    const response = await fetch(`${config.endpoint}/threads/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...(thread || {}), messages: chats || [] }),
    })
    await response.json()
  }

  return (
    <ProChat
      chatRef={proChatRef}
      loading={loading}
      key={id}
      locale='en-US'
      style={{
        height: "100%",
        width: "100%",
      }}
      onChatsChange={(chats: Array<any>) => {
        console.log(chats)
        updateChat(chats)
      }}
      actions={{
        render: (defaultDoms) => {
          return [
            <Space direction='horizontal'>
              <Button
                type='link'
                onClick={() => {
                  proChatRef?.current?.sendMessage("Test1")
                }}>
                Test1
              </Button>
            </Space>,
            ...defaultDoms,
          ]
        },
        flexConfig: {
          gap: 24,
          direction: "horizontal",
          justify: "space-between",
        },
      }}
      chats={thread?.messages || []}
      request={async (messages: Array<any>) => {
        const response = await fetch(`${config.endpoint}/chat/inference`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            responseType: "stream",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages: messages }),
        })
        return response
      }}
    />
  )
}

export default Chat

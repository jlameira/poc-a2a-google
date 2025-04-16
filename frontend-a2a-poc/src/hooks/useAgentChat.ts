import { useState, useEffect, useRef } from "react"
import { createTask, getTask } from "@/lib/api"
import axios from "axios"

interface Message {
  role: "agent" | "gerente"
  content: string
}

export function useAgentChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [taskId, setTaskId] = useState("")
  const eventSourceRef = useRef<EventSource | null>(null)

  async function startConversation(
    input: string,
    proposalId: string,
    proposalDetails?: { client: string; value: number; approvedValue: number }
  ) {
    setLoading(true)
    setMessages([])

    const contextText = proposalDetails
      ? `Proposta para cliente ${proposalDetails.client}, valor proposto R$${proposalDetails.value}, valor aprovado R$${proposalDetails.approvedValue}.\n`
      : ""

    const task = await createTask(contextText + input, proposalId)
    setTaskId(task.id)

    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    const es = new EventSource(`http://localhost:8080/tasks/${task.id}/events`)
    es.onmessage = (e) => {
      const parsed = JSON.parse(e.data)
      if (parsed && parsed.sender === "agent") {
        setMessages((prev) => {
          const alreadyExists = prev.some(
            (m) => m.role === "agent" && m.content === parsed.content.value
          )
          return alreadyExists ? prev : [...prev, { role: "agent", content: parsed.content.value }]
        })
      }
    }
    es.onerror = () => {
      es.close()
    }
    eventSourceRef.current = es
    setLoading(false)
  }

  async function sendReply(reply: string) {
    if (!taskId) return
    setIsTyping(true)
    setMessages((prev) => [...prev, { role: "gerente", content: reply }])

    const res = await axios.post(`http://localhost:8080/tasks/${taskId}/messages`, {
      sender: "gerente",
      content: { type: "text", value: reply }
    })

    setTimeout(() => {
      if (res.data.status == "completed"){
      const response =
          res.data.output?.value || res.data.messages?.at(-1)?.content?.value || "Resposta do agente."
      setMessages((prev) => [...prev, { role: "agent", content: response }])

      }
      setIsTyping(false)
    }, 3000)


  }

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [])

  return {
    messages,
    loading,
    isTyping,
    startConversation,
    sendReply
  }
}

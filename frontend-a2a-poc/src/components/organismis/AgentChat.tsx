"use client"
import { useState } from "react"
import { useAgentChat } from "@/hooks/useAgentChat"
import ChatMessage from "../atoms/ChatMessage"
import TypingIndicator from "../atoms/TypingIndicator"
import MessageInput from "../molecules/MessageInput"

interface Proposal {
  id: string
  title: string
  hasIssue: boolean
  client: string
  value: number
  approvedValue: number
}

export default function AgentChat({ proposal }: { proposal: Proposal }) {
  const [reply, setReply] = useState("")
  const [startText, setStartText] = useState(false)
  const { messages, isTyping, loading, startConversation, sendReply } = useAgentChat()

  const handleStart = () => {
    setStartText(true)
    startConversation(
      `Sou um gerente e encontrei um erro na proposta ${proposal.id}. Gostaria de resolver.`,
      proposal.id,
      {
        client: proposal.client,
        value: proposal.value,
        approvedValue: proposal.approvedValue
      }
    )
  }

  const handleSend = () => {
    if (reply.trim()) {
      sendReply(reply.trim())
      setReply("")
    }
  }

  return (
    <div className="bg-[#fffaf4] border border-[#c2b8a3] rounded p-4 space-y-3">
        <h4>Chat with our agent</h4>
      <button
        onClick={handleStart}
        disabled={loading}
        className="bg-[#8b7355] text-white px-4 py-2 disabled:opacity-50"
      >
          Start chat with agent
      </button>
        <hr />

      <div className="bg-[#f5f0e6] text-[#4b3f2f] p-3 font-mono h-60 overflow-y-auto space-y-2">
        {messages.map((m, i) => (
          <ChatMessage key={i} role={m.role} text={m.content} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      {startText && (
        <MessageInput
          value={reply}
          onChange={setReply}
          onSend={handleSend}
          disabled={isTyping || loading}
        />
      )}
    </div>
  )
}

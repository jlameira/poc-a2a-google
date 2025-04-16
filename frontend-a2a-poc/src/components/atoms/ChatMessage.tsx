"use client"
import { motion } from "framer-motion"

export default function ChatMessage({ role, text }: { role: "agent" | "gerente", text: string }) {
    const isUser = role === "gerente"
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`rounded px-3 py-2 my-1 max-w-[80%] ${
                isUser ? "ml-auto bg-[#d8c9b6] text-right" : "bg-[#e9e1d8] text-left"
            }`}
        >
            <div className="text-sm whitespace-pre-wrap">{text}</div>
        </motion.div>
    )
}

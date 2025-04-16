"use client"
import { motion } from "framer-motion"

export default function TypingIndicator() {
    return (
        <div className="flex gap-1 items-center text-[#7a6a58] text-sm mt-2">
            <span>Agent is typing</span>
            <motion.span
                className="w-2 h-2 rounded-full bg-[#7a6a58]"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1 }}
            />
            <motion.span
                className="w-2 h-2 rounded-full bg-[#7a6a58]"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
            />
            <motion.span
                className="w-2 h-2 rounded-full bg-[#7a6a58]"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
            />
        </div>
    )
}

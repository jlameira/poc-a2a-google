"use client"
interface MessageInputProps {
    value: string
    onChange: (value: string) => void
    onSend: () => void
    disabled?: boolean
}

export default function MessageInput({
                                         value,
                                         onChange,
                                         onSend,
                                         disabled = false
                                     }: MessageInputProps) {
    return (
        <div className="flex gap-2">
            <input
                className="w-full border border-[#c2b8a3] p-2 bg-[#fffaf4]"
                placeholder="Your response as a manager..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <button
                className="bg-[#6f5846] text-white px-4 py-2 disabled:opacity-50"
                onClick={onSend}
                disabled={disabled || !value.trim()}
            >
                Sent
            </button>
        </div>
    )
}

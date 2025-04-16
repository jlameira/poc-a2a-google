"use client"
import { CheckCircle, XCircle, CheckCheck } from "lucide-react"

interface ProposalCardProps {
    id: string
    title: string
    approved: boolean
    hasIssue: boolean
    onApprove: () => void
}

export default function ProposalCard({
                                         id,
                                         title,
                                         approved,
                                         hasIssue,
                                         onApprove
                                     }: ProposalCardProps) {
    const status = approved
        ? { text: "Approved", icon: <CheckCheck size={18} />, color: "text-green-600" }
        : hasIssue
            ? { text: "Erro", icon: <XCircle size={18} />, color: "text-red-600" }
            : { text: "Pending", icon: <CheckCircle size={18} />, color: "text-yellow-600" }

    return (
        <tr className="border-t border-[#d4cbbb]">
            <td className="p-3">{title}</td>
            <td className="p-3">
                <div className={`flex items-center gap-1 ${status.color}`}>
                    {status.icon} {status.text}
                </div>
            </td>
            <td className="p-3">
                <button
                    onClick={onApprove}
                    disabled={approved}
                    className="bg-[#6f5846] text-white px-4 py-1 disabled:opacity-50"
                >
                    Approve
                </button>
            </td>
        </tr>
    )
}

"use client"
import { useState } from "react"
import AgentChat from "./AgentChat"
import ProposalList from "./ProposalList"

interface Proposal {
    id: string
    title: string
    hasIssue: boolean
    client: string
    value: number;
    approvedValue: number
}

const proposalsData: Proposal[] = [
    {
        id: "111",
        title: "Proposal 111 - Marketing Budget",
        hasIssue: false,
        client: "Empresa A",
        value: 100,
        approvedValue: 100
    },
    {
        id: "222",
        title: "Proposal 222 - HR Expansion",
        hasIssue: false,
        client: "Empresa B",
        value: 200,
        approvedValue: 200
    },
    {
        id: "321",
        title: "Proposal 321 - New Client Deal",
        hasIssue: false,
        client: "Empresa C",
        value: 120,
        approvedValue: 100
    }
]

export default function AgentPanel() {
    const [approved, setApproved] = useState<string[]>([])
    const [activeProposal, setActiveProposal] = useState<Proposal | null>(null)

    const handleApprove = (proposal: Proposal) => {
        if (proposal.id == "321") {
            proposal.hasIssue = true
        }
        if (!proposal.hasIssue) {
            setApproved((prev) => [...prev, proposal.id])
            return
        }
        setActiveProposal(proposal)
    }

    return (
        <div className="p-4 max-w-3xl mx-auto space-y-6 bg-[#f5f0e6] text-[#4b3f2f] min-h-screen">
            <h1 className="text-2xl font-bold">Approval Panel</h1>
            <ProposalList
                proposals={proposalsData}
                approved={approved}
                onApprove={handleApprove}
            />

            {activeProposal?.hasIssue && !approved.includes(activeProposal.id) && (
                <AgentChat proposal={activeProposal} />
            )}
        </div>
    )
}

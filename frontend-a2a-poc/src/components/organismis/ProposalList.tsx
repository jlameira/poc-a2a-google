import ProposalCard from "../molecules/ProposalCard"

interface Proposal {
  id: string
  title: string
  hasIssue: boolean
  client: string
  value: number
  approvedValue: number
}

interface Props {
  proposals: Proposal[]
  approved: string[]
  onApprove: (proposal: Proposal) => void
}

export default function ProposalList({ proposals, approved, onApprove }: Props) {
  return (
    <table className="w-full border border-[#c2b8a3] bg-[#fffaf4]">
      <thead className="bg-[#e6ddd0] text-left">
        <tr>
          <th className="p-3">Proposal</th>
          <th className="p-3">Status</th>
          <th className="p-3">Action</th>
        </tr>
      </thead>
      <tbody>
        {proposals.map((p) => (
          <ProposalCard
            key={p.id}
            id={p.id}
            title={p.title}
            approved={approved.includes(p.id)}
            hasIssue={p.hasIssue}
            onApprove={() => onApprove(p)}
          />
        ))}
      </tbody>
    </table>
  )
}

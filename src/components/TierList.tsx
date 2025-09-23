import { TierData, TierKey } from '@/types/game'
import TierRow from './TierRow'

interface TierListProps {
  tiers: TierData
}

const tierOrder: TierKey[] = ['S', 'A', 'B', 'C', 'D', 'F']

export default function TierList({ tiers }: TierListProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-4">Your Tier List</h2>
      <div className="card-steam p-6">
        {tierOrder.map((tier) => (
          <TierRow 
            key={tier} 
            tier={tier} 
            games={tiers[tier]} 
          />
        ))}
      </div>
    </div>
  )
}
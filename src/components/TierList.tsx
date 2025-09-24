import { TierData, TierKey } from '@/types/game'
import TierRow from './TierRow'

interface TierListProps {
  tiers: TierData
  tierColors?: Record<string, string>
}

const defaultTierOrder: TierKey[] = ['S', 'A', 'B', 'C', 'D', 'F']

export default function TierList({ tiers, tierColors }: TierListProps) {
  // Get all existing tiers from the tiers object
  const existingTiers = Object.keys(tiers)
  
  // Combine default order with any custom tiers
  const tierOrder = [
    ...defaultTierOrder.filter(tier => existingTiers.includes(String(tier))),
    ...existingTiers.filter(tier => !defaultTierOrder.includes(tier as TierKey))
  ]

  return (
    <div className="mb-8">
      <div className="card-steam p-6">
        {tierOrder.map((tier) => (
          <TierRow 
            key={tier} 
            tier={tier as TierKey} 
            games={tiers[tier] || []}
            customColor={tierColors?.[tier]}
          />
        ))}
      </div>
    </div>
  )
}
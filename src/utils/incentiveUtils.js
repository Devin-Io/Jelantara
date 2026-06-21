export function calculateIncentive(volume, grade = 'Grade B', contamination = 'Rendah', settings = {}) {
  const config = typeof settings === 'number' ? { baseIncentiveRate:settings } : settings
  const baseRate = Number(config.baseIncentiveRate ?? 6500)
  const bonusRate = grade === 'Grade A' ? Number(config.gradeABonus ?? 700) : grade === 'Grade B' ? Number(config.gradeBBonus ?? 300) : 0
  const deductionRate = grade === 'Grade C' ? Number(config.gradeCDeduction ?? 600) : contamination === 'Tinggi' ? 350 : 0
  const baseValue = Number(volume) * baseRate
  const bonus = Number(volume) * bonusRate
  const deduction = Number(volume) * deductionRate
  return { baseRate, baseValue, bonus, deduction, total: baseValue + bonus - deduction }
}

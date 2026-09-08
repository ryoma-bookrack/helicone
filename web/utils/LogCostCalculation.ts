const HELICONE_LOG_PRICING = [
  { lower: 0, upper: 100_000, rate: 0 },
  { lower: 100_000, upper: 2_000_000, rate: 0.000248 * 1.3 },
  { lower: 2_000_000, upper: 15_000_000, rate: 0.000104 * 1.3 },
  { lower: 15_000_000, upper: 50_000_000, rate: 0.0000655 * 1.3 },
  { lower: 50_000_000, upper: 100_000_000, rate: 0.0000364 * 1.3 },
  { lower: 100_000_000, upper: Number.MAX_SAFE_INTEGER, rate: 0.0000187 * 1.3 },
];

export const handleLogCostCalculation = (currentLogValue: number) => {
  let cost = 0;
  let remainingValue = currentLogValue;
  for (const pricing of HELICONE_LOG_PRICING) {
    const logCount = Math.min(pricing.upper - pricing.lower, remainingValue);
    cost += logCount * pricing.rate;
    remainingValue -= logCount;
    if (remainingValue <= 0) {
      break;
    }
  }
  return cost;
};

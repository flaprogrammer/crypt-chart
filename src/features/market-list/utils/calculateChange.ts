export interface TickerOpenVolumeLowHigh {
  ask: string | null;
  bid: string | null;
  open: string | null;
}

export function calculateChange(update: TickerOpenVolumeLowHigh): number {
  const { ask, bid, open } = update;

  if (!ask || !bid || !open) return 0;

  const openFloat = parseFloat(open);
  const midPrice = calculateMidPrice(parseFloat(bid), parseFloat(ask));

  return (midPrice - openFloat) / openFloat;
}

function calculateMidPrice(bidPrice: number, askPrice: number): number {
  return (bidPrice + askPrice) / 2;
}

export function formatPercentage(change: number): string {
  // Consider a very small number as zero
  const isEffectivelyZero = !change || Math.abs(change) < 1e-2;

  if (isEffectivelyZero) {
    return "0.00";
  }

  const formattedChange = (change * 100).toFixed(2);
  const prefix = change > 0 ? "+" : "";
  return prefix + formattedChange;
}

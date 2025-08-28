// utils/rangeCalculator.ts
export const calculateWeeklyRange = (nifty: number, vix: number) => {
    const vixDecimal = vix / 100; 
    const weeklyVol = vixDecimal * Math.sqrt(1 / 52); 
  
    const move = nifty * weeklyVol; // 1σ move
    const oneSigmaRange = {
      lower: (nifty - move).toFixed(0),
      upper: (nifty + move).toFixed(0),
    };
    const twoSigmaRange = {
      lower: (nifty - 2 * move).toFixed(0),
      upper: (nifty + 2 * move).toFixed(0),
    };
  
    return { oneSigmaRange, twoSigmaRange, move: move.toFixed(0) };
  };
  
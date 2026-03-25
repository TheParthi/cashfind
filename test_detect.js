const NOTES = [10, 20, 50, 100, 200, 500, 2000];

// Tuned for poor lighting and smartphone shadows
const NOTE_PROFILES = {
  10: { h: 18, s: 45, v: 45 },
  20: { h: 75, s: 45, v: 60 },    // shifted to greener yellow
  50: { h: 195, s: 35, v: 50 },   // drastically lower expected sat/val for shadows
  100: { h: 255, s: 35, v: 60 },
  200: { h: 38, s: 70, v: 75 },   // shifted closer to orange
  500: { h: 100, s: 10, v: 50 },
  2000: { h: 325, s: 50, v: 65 },
};

function computeScore(h, s, v) {
  if (v < 15 || v > 95) return null;

  const scores = {};
  for (const n of NOTES) {
    const target = NOTE_PROFILES[n];
    let dh = Math.abs(h - target.h);
    if (dh > 180) dh = 360 - dh;

    // Saturation penalization (shadows destroy saturation, so lower penalty)
    let ds = Math.abs(s - target.s);
    let ds_penalty = ds * 0.5;

    // Value penalization (lighting drastically changes value, so we penalize less)
    let dv = Math.abs(v - target.v);
    let dv_penalty = dv * 0.3;
    
    // Hue is the absolute king. But wait! If saturation is very low, hue is meaningless!
    // A grey table has Hue 20 or Hue 190 randomly. We should penalize distance MORE if saturation is high, 
    // or just require a very tight hue.
    let dh_penalty = dh * (3.0); 

    const D = dh_penalty + ds_penalty + dv_penalty;
    let score = Math.max(0, 100 - D);

    if (score > 10) {
      scores[n] = score * score;
    } else {
      scores[n] = 0;
    }
  }
  return scores;
}

console.log("Shadowed 50 (h:200, s:15, v:25) =>", computeScore(200, 15, 25));
console.log("Warm lit 20 (h:65, s:55, v:70) =>", computeScore(65, 55, 70));
console.log("500 in neutral light (h:100, s:12, v:55) =>", computeScore(100, 12, 55));
console.log("200 note (h:40, s:80, v:85) =>", computeScore(40, 80, 85));

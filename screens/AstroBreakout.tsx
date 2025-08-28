// AstroBreakout.tsx
import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { julian, moonposition, planetposition } from "astronomia";

import vsop87Bearth from "astronomia/data/vsop87Bearth";
import vsop87Bvenus from "astronomia/data/vsop87Bvenus";
import vsop87Bmars from "astronomia/data/vsop87Bmars";
import vsop87Bjupiter from "astronomia/data/vsop87Bjupiter";
import vsop87Bsaturn from "astronomia/data/vsop87Bsaturn";
import vsop87Buranus from "astronomia/data/vsop87Buranus";
import vsop87Bneptune from "astronomia/data/vsop87Bneptune";
import vsop87Bmercury from "astronomia/data/vsop87Bmercury";
import CommunityLinks from "./CommunityLinks";


// ---------------- TYPES ----------------
type AspectName = "conj" | "opp" | "sq" | "tri" | "sex";

interface AstroEvent {
  timeISO: string;
  label: string;
  orbDeg: number;
  signal: "Breakout" | "Breakdown";
  reason: string;
}

// ---------------- CONFIG ----------------
const ORB_DEG = 3; // Orb for aspect detection
const ASPECT_ANGLES: Record<AspectName, number> = {
  conj: 0,
  opp: 180,
  sq: 90,
  tri: 120,
  sex: 60,
};


// ---------------- MEANINGS ----------------
const ASPECT_MEANINGS: Record<
  string,
  { signal: "Breakout" | "Breakdown"; reason: string }
> = {
  // Sun
  "Moon conj Sun": {
    signal: "Breakout",
    reason: "New cycle begins — strong directional impulse.",
  },
  "Moon opp Sun": {
    signal: "Breakdown",
    reason: "Opposition to vitality — profit taking and volatility.",
  },
  "Moon sq Sun": {
    signal: "Breakdown",
    reason: "Tension between emotion and will — erratic swings.",
  },
  "Moon tri Sun": {
    signal: "Breakout",
    reason: "Harmony boosts confidence — trending continuation.",
  },
  "Moon sex Sun": {
    signal: "Breakout",
    reason: "Opportunity window — moderate trend support.",
  },

  // Mercury
  "Moon conj Mercury": {
    signal: "Breakout",
    reason: "News or communication triggers volatility.",
  },
  "Moon opp Mercury": {
    signal: "Breakdown",
    reason: "Confusion and mixed signals — choppy moves.",
  },
  "Moon sq Mercury": {
    signal: "Breakdown",
    reason: "Rumors and noise dominate — sideways pressure.",
  },
  "Moon tri Mercury": {
    signal: "Breakout",
    reason: "Clarity in market narrative — smooth flow.",
  },
  "Moon sex Mercury": {
    signal: "Breakout",
    reason: "Good coordination — minor supportive trends.",
  },

  // Venus
  "Moon conj Venus": {
    signal: "Breakout",
    reason: "Optimism and liquidity inflow — bullish sentiment.",
  },
  "Moon opp Venus": {
    signal: "Breakdown",
    reason: "Excessive optimism meets resistance — correction risk.",
  },
  "Moon sq Venus": {
    signal: "Breakdown",
    reason: "Overvaluation fears — profit booking likely.",
  },
  "Moon tri Venus": {
    signal: "Breakout",
    reason: "Harmony supports steady gains.",
  },
  "Moon sex Venus": {
    signal: "Breakout",
    reason: "Supportive flows, smaller bullish opportunity.",
  },

  // Mars
  "Moon conj Mars": {
    signal: "Breakout",
    reason: "Aggression and momentum spike — sharp move.",
  },
  "Moon opp Mars": {
    signal: "Breakdown",
    reason: "Conflict energy — volatile reversals.",
  },
  "Moon sq Mars": {
    signal: "Breakdown",
    reason: "Tension sparks erratic bursts, risky whipsaws.",
  },
  "Moon tri Mars": {
    signal: "Breakout",
    reason: "Energy aligns — strong trending push.",
  },
  "Moon sex Mars": {
    signal: "Breakout",
    reason: "Supportive action, moderate breakout window.",
  },

  // Jupiter
  "Moon conj Jupiter": {
    signal: "Breakout",
    reason: "Optimism, expansion — bullish burst.",
  },
  "Moon opp Jupiter": {
    signal: "Breakdown",
    reason: "Overextension → correction phase.",
  },
  "Moon sq Jupiter": {
    signal: "Breakdown",
    reason: "Excessive speculation — unstable trend.",
  },
  "Moon tri Jupiter": {
    signal: "Breakout",
    reason: "Confidence and support — continuation trend.",
  },
  "Moon sex Jupiter": {
    signal: "Breakout",
    reason: "Minor supportive inflow — bullish tilt.",
  },

  // Saturn
  "Moon conj Saturn": {
    signal: "Breakdown",
    reason: "Restrictions, fear — bearish weight.",
  },
  "Moon opp Saturn": {
    signal: "Breakdown",
    reason: "Strong resistance — rejection risk.",
  },
  "Moon sq Saturn": {
    signal: "Breakdown",
    reason: "Heavy pressure, liquidity drains.",
  },
  "Moon tri Saturn": {
    signal: "Breakout",
    reason: "Stability — steady controlled trend.",
  },
  "Moon sex Saturn": {
    signal: "Breakout",
    reason: "Disciplined flow, minor support.",
  },

  // Uranus
  "Moon conj Uranus": {
    signal: "Breakout",
    reason: "Sudden shocks — sharp breakout move.",
  },
  "Moon opp Uranus": {
    signal: "Breakdown",
    reason: "Unexpected reversal, instability.",
  },
  "Moon sq Uranus": {
    signal: "Breakdown",
    reason: "Erratic volatility dominates.",
  },
  "Moon tri Uranus": {
    signal: "Breakout",
    reason: "Innovation surge — trend acceleration.",
  },
  "Moon sex Uranus": {
    signal: "Breakout",
    reason: "Opportunity from surprise, smaller window.",
  },

  // Neptune
  "Moon conj Neptune": {
    signal: "Breakdown",
    reason: "Illusion, mispricing risk — foggy markets.",
  },
  "Moon opp Neptune": {
    signal: "Breakdown",
    reason: "Disappointments, false signals.",
  },
  "Moon sq Neptune": {
    signal: "Breakdown",
    reason: "Confusion, uncertainty — unreliable trend.",
  },
  "Moon tri Neptune": {
    signal: "Breakout",
    reason: "Intuition helps align trends.",
  },
  "Moon sex Neptune": {
    signal: "Breakout",
    reason: "Minor opportunity, creative flows.",
  },

  // Pluto
  "Moon conj Pluto": {
    signal: "Breakout",
    reason: "Power shift, deep transformation — big move.",
  },
  "Moon opp Pluto": {
    signal: "Breakdown",
    reason: "Intense struggle — strong rejection.",
  },
  "Moon sq Pluto": {
    signal: "Breakdown",
    reason: "Hidden pressure erupts — unstable correction.",
  },
  "Moon tri Pluto": {
    signal: "Breakout",
    reason: "Transformation aligns with flow — strong trend.",
  },
  "Moon sex Pluto": {
    signal: "Breakout",
    reason: "Subtle transformation, supportive opportunity.",
  },
};

// ---------------- HELPERS ----------------
function angleDiff(a: number, b: number): number {
  return ((a - b + 540) % 360) - 180;
}
function normalize(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

const earth = new planetposition.Planet(vsop87Bearth as any);

function calcAngle(jd: number, vsop: any, planetName: string): number {
  
  const moonLon = moonposition.position(jd).lon * (180 / Math.PI);
  let planetLon: number;
  if (planetName === "Sun") {
    const earthPos = earth.position2000(jd);
    planetLon = normalize(earthPos.lon * (180 / Math.PI) + 180);
  } else {
    planetLon = vsop.position2000(jd).lon * (180 / Math.PI);
  }
  return normalize(moonLon - planetLon);
}

function aspectName(a: AspectName): string {
  switch (a) {
    case "conj": return "conj";
    case "opp": return "opp";
    case "sq": return "sq";
    case "tri": return "tri";
    case "sex": return "sex";
    default: return "";
  }
}

function refineAspectTime(
  start: Date,
  end: Date,
  planetName: string,
  vsop: any,
  aspect: AspectName,
  stepMinutes: number
): AstroEvent | null {
  const jdStart = julian.DateToJD(start);
  const jdEnd = julian.DateToJD(end);
  const targetDeg = ASPECT_ANGLES[aspect];

  for (let jd = jdStart; jd < jdEnd; jd += stepMinutes / 1440) {
    const angle = calcAngle(jd, vsop, planetName);
    const diff = angleDiff(angle, targetDeg);

    if (Math.abs(diff) <= ORB_DEG) {
      const dt = julian.JDToDate(jd);
      const key = `Moon ${aspectName(aspect)} ${planetName}`;
      const meaning =
        ASPECT_MEANINGS[key] || {
          signal: "Breakout",
          reason: "General volatility expected.",
        };

      return {
        timeISO: dt.toISOString(),
        label: key,
        orbDeg: Math.abs(diff),
        signal: meaning.signal,
        reason: meaning.reason,
      };
    }
  }
  return null;
}

// ---------------- COMPONENT ----------------
export default function AstroBreakout() {
  const [events, setEvents] = useState<AstroEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"crypto" | "nifty">("crypto");
  const [currentPlanet, setCurrentPlanet] = useState<string>(""); // ✅ show progress

  useEffect(() => {
    setLoading(true);
    setEvents([]);
    setCurrentPlanet("Starting...");

    // async compute wrapped in setTimeout so loader shows
    setTimeout(() => {
      try {
        const now = new Date();
        const start = new Date(now);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(end.getDate() + 1);

        const planetList = [
          { name: "Sun", vsop: earth },
          { name: "Mercury", vsop: new planetposition.Planet(vsop87Bmercury as any) },
          { name: "Venus", vsop: new planetposition.Planet(vsop87Bvenus as any) },
          { name: "Mars", vsop: new planetposition.Planet(vsop87Bmars as any) },
          { name: "Jupiter", vsop: new planetposition.Planet(vsop87Bjupiter as any) },
          { name: "Saturn", vsop: new planetposition.Planet(vsop87Bsaturn as any) },
          { name: "Uranus", vsop: new planetposition.Planet(vsop87Buranus as any) },
          { name: "Neptune", vsop: new planetposition.Planet(vsop87Bneptune as any) },
        ];

        const aspects: AspectName[] = ["conj", "opp", "sq", "tri", "sex"];
        let evts: AstroEvent[] = [];

            (async () => {
            let evts: AstroEvent[] = [];

            for (const planet of planetList) {
              setCurrentPlanet(planet.name);
              await new Promise(res => setTimeout(res, 0)); // ⚡ yield to UI

              for (const asp of aspects) {
                const e = refineAspectTime(start, end, planet.name, planet.vsop, asp, 30);
                if (e) evts.push(e);
              }
            }

            evts.sort((a, b) => a.timeISO.localeCompare(b.timeISO));
            setEvents(evts);
            setLoading(false);
          })();

      } catch (err) {
        console.error(err);
      } 
    }, 100);
  }, [mode]);

  const filteredEvents = useMemo(() => {
    if (mode === "crypto") return events;
    return events.filter((e) => {
      const dt = new Date(e.timeISO);
      const mins = dt.getHours() * 60 + dt.getMinutes();
      return mins >= 9 * 60 + 15 && mins <= 15 * 60 + 30;
    });
  }, [events, mode]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10 }}>Calculating aspects {currentPlanet}... </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🌙 Astro Breakout/Breakdown — Today</Text>

      <Picker
        selectedValue={mode}
        onValueChange={(val) => setMode(val)}
        style={styles.picker}
      >
        <Picker.Item label="Crypto (24×7)" value="crypto" />
        <Picker.Item label="Nifty (9:15–15:30 IST)" value="nifty" />
      </Picker>

      <FlatList
        data={filteredEvents}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              item.signal === "Breakout" ? styles.breakout : styles.breakdown,
            ]}
          >
            <Text style={styles.time}>
              {new Date(item.timeISO).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </Text>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.orb}>
              orb ±{item.orbDeg.toFixed(2)}° • {item.signal}
            </Text>
            <Text style={styles.reason}>{item.reason}</Text>
          </View>
        )}
      />

      {/* <CommunityLinks /> */}

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.breakoutDot}>⬛</Text>
        <Text style={styles.legendText}>Breakout</Text>
        <Text style={styles.breakdownDot}>⬛</Text>
        <Text style={styles.legendText}>Breakdown</Text>
      </View>
    </View>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#fff" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  picker: {
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    height: 50,
  },
  card: { borderRadius: 10, padding: 12, marginVertical: 6, elevation: 2 },
  breakout: { backgroundColor: "#28a745" },   // solid green
  breakdown: { backgroundColor: "#dc3545" },  // solid red
  time: { fontWeight: "bold", fontSize: 16, color: "#fff" },
  label: { fontSize: 14, marginVertical: 4, color: "#fff" },
  orb: { fontSize: 12, color: "#fff", marginTop: 2 },
  reason: { fontSize: 12, fontStyle: "italic", marginTop: 4, color: "#fff" },
  legend: { flexDirection: "row", justifyContent: "center", marginTop: 10 },
  breakoutDot: { color: "#28a745", marginHorizontal: 6 },
  breakdownDot: { color: "#dc3545", marginHorizontal: 6 },
  legendText: { fontSize: 12, marginHorizontal: 4 },
});
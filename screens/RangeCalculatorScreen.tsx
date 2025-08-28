import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../AppNavigator";
import { LineChart } from "react-native-chart-kit";
import { showRewardedInterstitial } from "./AdService";
import BannerAdView from './BannerAd';
import { useInterstitialAd } from './Interstitial';
// 👇 Import Google Mobile Ads
import {
    InterstitialAd,
    AdEventType,
    TestIds,
    BannerAd, BannerAdSize
  } from "react-native-google-mobile-ads";

type RangeCalculatorRouteProp = RouteProp<
  RootStackParamList,
  "RangeCalculator"
>;

// 📌 Ad IDs
// const adUnitIds = {
//     interstitial: __DEV__
//       ? TestIds.INTERSTITIAL
//       : 'ca-app-pub-9851781618699752/9745571965',
  
//     //   bannerSellingScreen: __DEV__
//     //   ? TestIds.BANNER
//     //   : 'ca-app-pub-9851781618699752/2050898861',
//   };
//   const interstitial = InterstitialAd.createForAdRequest(adUnitIds.interstitial);

type Props = {
  route: RangeCalculatorRouteProp;
};

const RangeCalculatorScreen: React.FC<Props> = ({ route }) => {
  const { showAd } = useInterstitialAd();
  const { niftyValue } = route.params;
  const [vix, setVix] = useState("");
  // const [interstitialLoaded, setInterstitialLoaded] = useState(false);
  const [timeframe, setTimeframe] = useState("daily");
  const [range, setRange] = useState<{
    high1: number;
    low1: number;
    high2: number;
    low2: number;
  } | null>(null);

  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

    // 📌 Interstitial setup
    // useEffect(() => {
    //     const unsubscribeLoaded = interstitial.addAdEventListener(
    //       AdEventType.LOADED,
    //       () => {
    //         setInterstitialLoaded(true);
    //       }
    //     );
    
    //     const unsubscribeClosed = interstitial.addAdEventListener(
    //       AdEventType.CLOSED,
    //       () => {
    //         setInterstitialLoaded(false);
    //         interstitial.load(); // preload next
    //       }
    //     );
    
    //     const unsubscribeError = interstitial.addAdEventListener(
    //       AdEventType.ERROR,
    //       () => {
    //         setInterstitialLoaded(false);
    //       }
    //     );
    
    //     interstitial.load();
    
    //     return () => {
    //       unsubscribeLoaded();
    //       unsubscribeClosed();
    //       unsubscribeError();
    //     };
    //   }, []);
    
      // const showInterstitial = () => {
      //   if (interstitialLoaded) {
      //     interstitial.show();
      //     setInterstitialLoaded(false);
      //   }
      // };

  const calculateRange = () => {
    
     showAd(); 
    // showInterstitial();
    //showRewardedInterstitial();
    const vixValue = parseFloat(vix);
    if (isNaN(vixValue)) return;

    let periodsPerYear = 52; // default weekly
    if (timeframe === "daily") periodsPerYear = 252;
    if (timeframe === "monthly") periodsPerYear = 12;

    const move1 =
      (niftyValue * vixValue * Math.sqrt(1 / periodsPerYear)) / 100;
    const move2 = move1 * 2;

    setRange({
      high1: niftyValue + move1,
      low1: niftyValue - move1,
      high2: niftyValue + move2,
      low2: niftyValue - move2,
    });
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContainer}>
      {/* <Text style={styles.title}>VIX Range Calculator</Text> */}
      <Text style={styles.title}>Nifty Spot: {niftyValue}</Text>

      {/* Input card */}
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Enter VIX value"
          keyboardType="numeric"
          value={vix}
          onChangeText={setVix}
        />

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={timeframe}
            onValueChange={(itemValue) => setTimeframe(itemValue)}
            style={styles.picker}
            mode="dropdown"
          >
            <Picker.Item label="Daily" value="daily" />
            <Picker.Item label="Weekly" value="weekly" />
            <Picker.Item label="Monthly" value="monthly" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.calcButton} onPress={calculateRange}>
          <Text style={styles.calcButtonText}>Calculate Range</Text>
        </TouchableOpacity>
      </View>
       {/* 📌 Banner Ad Here */}
       <View style={{ marginVertical: 20, alignItems: 'center' }}>
      <BannerAdView />
    </View>

      {/* Results */}
      {range && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>📊 Range Levels</Text>

          <View style={styles.levelRow}>
            <View style={[styles.levelCard, { flex: 1 }]}>
              <Text style={styles.levelLabel}>Current Nifty</Text>
              <Text style={[styles.levelValue, { color: "black" }]}>
                {niftyValue.toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.levelRow}>
            <View style={styles.levelCard}>
              <Text style={styles.levelLabel}>1σ High</Text>
              <Text style={styles.levelValue}>{range.high1.toFixed(2)}</Text>
            </View>
            <View style={styles.levelCard}>
              <Text style={styles.levelLabel}>1σ Low</Text>
              <Text style={styles.levelValue}>{range.low1.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.levelRow}>
            <View style={styles.levelCard}>
              <Text style={styles.levelLabel}>2σ High</Text>
              <Text style={styles.levelValue}>{range.high2.toFixed(2)}</Text>
            </View>
            <View style={styles.levelCard}>
              <Text style={styles.levelLabel}>2σ Low</Text>
              <Text style={styles.levelValue}>{range.low2.toFixed(2)}</Text>
            </View>
          </View>

            {/* ✅ Probability text based on timeframe */}
{timeframe === "daily" && (
  <View style={styles.probabilityBox}>
    <Text style={styles.probabilityText}>
      📌 On a daily basis, there is ~68% probability that Nifty will close within the 1σ range.
    </Text>
    <Text style={styles.probabilityText}>
      📌 On a daily basis, there is ~95% probability that Nifty will close within the 2σ range.
    </Text>
  </View>
)}

{timeframe === "weekly" && (
  <View style={styles.probabilityBox}>
    <Text style={styles.probabilityText}>
      📌 On a weekly basis, there is ~68% probability that Nifty will close within the 1σ range.
    </Text>
    <Text style={styles.probabilityText}>
      📌 On a weekly basis, there is ~95% probability that Nifty will close within the 2σ range.
    </Text>
  </View>
)}

{timeframe === "monthly" && (
  <View style={styles.probabilityBox}>
    <Text style={styles.probabilityText}>
      📌 On a monthly basis, there is ~68% probability that Nifty will close within the 1σ range.
    </Text>
    <Text style={styles.probabilityText}>
      📌 On a monthly basis, there is ~95% probability that Nifty will close within the 2σ range.
    </Text>
  </View>
)}


          {/* Chart back again */}
          <LineChart
            data={{
              labels: ["Low2", "Low1", "Current", "High1", "High2"],
              datasets: [
                {
                  data: [
                    range.low2,
                    range.low1,
                    niftyValue,
                    range.high1,
                    range.high2,
                  ],
                },
              ],
            }}
            width={Dimensions.get("window").width - 40}
            height={220}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: "5",
                strokeWidth: "2",
                stroke: "#007AFF",
              },
            }}
            style={styles.chart}
          />

          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.colorBox, { backgroundColor: "#007AFF" }]} />
              <Text>Range Levels</Text>
            </View>
          </View>

        <View style={styles.footer}>
        <Text style={styles.dateText}>📅 {currentDate}</Text>
        <Text style={styles.disclaimer}>
          Disclaimer: This is for educational purposes only. Not registered with SEBI. This is not investment advice.
        </Text>
      </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  subtitle: { fontSize: 16, marginBottom: 20, textAlign: "center" },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    width: "100%",
    marginBottom: 15,
    overflow: "hidden",
  },
  picker: { width: "100%" },
  calcButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  calcButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  resultBox: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
  },
  resultTitle: { fontSize: 18, fontWeight: "700", marginBottom: 15, textAlign: "center" },
  levelRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  levelCard: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 5,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  levelLabel: { fontSize: 14, fontWeight: "600", marginBottom: 5 },
  levelValue: { fontSize: 16, fontWeight: "bold", color: "#007AFF" },
  chart: { marginVertical: 20, borderRadius: 12, alignSelf: "center" },
  legend: { marginTop: 10, flexDirection: "row", justifyContent: "center" },
  legendItem: { flexDirection: "row", alignItems: "center", marginHorizontal: 10 },
  colorBox: { width: 15, height: 15, marginRight: 6, borderRadius: 3 },
  footer: {
    marginTop: 30,
    borderTopWidth: 1,
    paddingTop: 10,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  disclaimer: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  dateText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  probabilityBox: {
    marginTop: 15,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#eaf4ff",
  },
  probabilityText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
  },
});

export default RangeCalculatorScreen;

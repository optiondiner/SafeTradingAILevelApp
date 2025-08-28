import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { RootStackParamList } from '../AppNavigator';
import { Tooltip, Icon } from '@rneui/themed';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
  BannerAd,
  BannerAdSize,
} from 'react-native-google-mobile-ads';
// import { showRewardedInterstitial } from "./AdService";
import BannerAdView from './BannerAd';
import { useInterstitialAd } from './Interstitial';

// 📌 Ad IDs
// const adUnitIds = {
//   interstitial: __DEV__
//     ? TestIds.INTERSTITIAL
//     : 'ca-app-pub-9851781618699752/9745571965',

//     // bannerOption: __DEV__
//     // ? TestIds.BANNER
//     // : 'ca-app-pub-9851781618699752/2050898861',
// };
// const interstitial = InterstitialAd.createForAdRequest(adUnitIds.interstitial);

type OptionSellingScreenRouteProp = RouteProp<
  RootStackParamList,
  'OptionSelling'
>;

const OptionSellingScreen = () => {
   const { showAd } = useInterstitialAd();
  const route = useRoute<OptionSellingScreenRouteProp>();
  const { closingPrice } = route.params;

  const [sdValue, setSdValue] = useState('');
  const [selectedProbability, setSelectedProbability] = useState('60');
  const [range, setRange] = useState<{ lower: number; upper: number } | null>(
    null
  );
  const [strikePrices, setStrikePrices] = useState<{
    pe: number;
    ce: number;
  } | null>(null);
  // const [interstitialLoaded, setInterstitialLoaded] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // 📌 Interstitial setup
  // useEffect(() => {
  //   const unsubscribeLoaded = interstitial.addAdEventListener(
  //     AdEventType.LOADED,
  //     () => {
  //       setInterstitialLoaded(true);
  //     }
  //   );

  //   const unsubscribeClosed = interstitial.addAdEventListener(
  //     AdEventType.CLOSED,
  //     () => {
  //       setInterstitialLoaded(false);
  //       interstitial.load(); // preload next
  //     }
  //   );

  //   const unsubscribeError = interstitial.addAdEventListener(
  //     AdEventType.ERROR,
  //     () => {
  //       setInterstitialLoaded(false);
  //     }
  //   );

  //   interstitial.load();

  //   return () => {
  //     unsubscribeLoaded();
  //     unsubscribeClosed();
  //     unsubscribeError();
  //   };
  // }, []);

  // const showInterstitial = () => {
  //   if (interstitialLoaded) {
  //     interstitial.show();
  //     setInterstitialLoaded(false);
  //   }
  // };

  const getMultiplier = (probability: string) => {
    switch (probability) {
      case '60':
        return 1;
      case '75':
        return 1.5;
      case '90':
        return 1.75;
      case '95':
        return 2;
      default:
        return 1;
    }
  };

  const roundTo50 = (value: number) => Math.round(value / 50) * 50;

  const calculateRange = () => {
     showAd(); 
    //showInterstitial();
    //showRewardedInterstitial();
    const sd = parseFloat(sdValue);
    if (isNaN(sd)) return;
    const multiplier = getMultiplier(selectedProbability);
    const deviation = sd * multiplier;
    const lower = closingPrice - deviation;
    const upper = closingPrice + deviation;
    const pe = roundTo50(lower);
    const ce = roundTo50(upper);

    setRange({ lower, upper });
    setStrikePrices({ pe, ce });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>Option Selling Simulator</Text>
      </View>

      <Text style={styles.label}>Nifty Closing Price: {closingPrice}</Text>

      {/* Magic Number Input */}
      <View style={styles.row}>
        <Text style={styles.label}>
          Enter Safe Trading Magic Number (e.g. 100)
        </Text>
        <Tooltip
          popover={
            <Text style={{ color: '#fff' }}>
              To get this number daily you must be part of SafeTrading community.
            </Text>
          }
          backgroundColor="#000"
          height={100}
          width={250}
          withOverlay={false}
        >
          <Icon
            name="info"
            type="feather"
            color="#007bff"
            containerStyle={styles.icon}
          />
        </Tooltip>
      </View>
      <TextInput
        style={styles.input}
        placeholder="e.g. 100"
        keyboardType="numeric"
        value={sdValue}
        onChangeText={setSdValue}
      />

      {/* Probability Picker */}
      <View style={styles.row}>
        <Text style={styles.label}>Select Winning Probability:</Text>
        <Tooltip
          popover={
            <Text style={{ color: '#fff' }}>
              This is calculated on historical data for 30 years.
            </Text>
          }
          backgroundColor="#000"
          height={80}
          width={250}
          withOverlay={false}
        >
          <Icon
            name="info"
            type="feather"
            color="#007bff"
            containerStyle={styles.icon}
          />
        </Tooltip>
      </View>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedProbability}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedProbability(itemValue)}
        >
          <Picker.Item label="60%" value="60" />
          <Picker.Item label="75%" value="75" />
          <Picker.Item label="90%" value="90" />
          <Picker.Item label="95%" value="95" />
        </Picker>
      </View>

      {/* Calculate Button */}
      <TouchableOpacity style={styles.button} onPress={calculateRange}>
        <Text style={styles.buttonText}>Calculate Range & Strike Prices</Text>
      </TouchableOpacity>

      {/* 📌 Banner Ad Here */}
      <View style={{ marginVertical: 20, alignItems: 'center' }}>
       <BannerAdView />
    </View>

      {/* Results */}
      {range && strikePrices && (
        <View style={styles.resultCard}>
          <Text style={styles.resultText}>
            Calculated Range: {range.lower.toFixed(2)} - {range.upper.toFixed(2)}
          </Text>
          <Text style={styles.resultText}>
            Suggested Option Selling Strike Prices:
          </Text>
          <Text style={styles.pe}>Put (PE): {strikePrices.pe}</Text>
          <Text style={styles.ce}>Call (CE): {strikePrices.ce}</Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.dateText}>📅 {currentDate}</Text>
        <Text style={styles.disclaimer}>
          Disclaimer: This is for educational purposes only. Not registered with
          SEBI. This is not investment advice.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  header: { fontSize: 24, fontWeight: 'bold' },
  label: { fontSize: 16, marginBottom: 6, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  resultCard: {
    marginTop: 20,
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  resultText: { fontSize: 16, marginBottom: 6 },
  pe: { fontSize: 16, color: 'red', fontWeight: 'bold' },
  ce: { fontSize: 16, color: 'green', fontWeight: 'bold' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  icon: { marginLeft: 6 },
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
  dateText: { fontSize: 14, color: '#555', marginBottom: 5 },
});

export default OptionSellingScreen;

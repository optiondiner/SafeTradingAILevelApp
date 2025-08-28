import React, { useState, useEffect,useRef  } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Dimensions,
  StyleSheet,
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  BackHandler,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../AppNavigator';
//import PushNotification from 'react-native-push-notification';
import notifee, { AndroidImportance } from '@notifee/react-native';
import DeviceInfo from 'react-native-device-info';
import BannerAdView from './BannerAd';
import { useInterstitialAd } from './Interstitial';
import CommunityLinks from "./CommunityLinks";
import { AppRegistry } from 'react-native';

type GannLevelsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GannLevels'>;

const UPDATE_CONFIG_URL =
  'https://raw.githubusercontent.com/ankushbutole/SafeTradingAILevelApp/refs/heads/master/VersionFile.json';

const GannLevelsScreen = () => {
   const scrollRef = useRef<ScrollView>(null);

  
  const { showAd } = useInterstitialAd();
  const navigation = useNavigation<GannLevelsNavigationProp>();

  const [niftyClosingPrice, setNiftyClosingPrice] = useState<string>('');
  const [levels, setLevels] = useState<any>(null);
  const [updateRequired, setUpdateRequired] = useState(false);
  const [updateConfig, setUpdateConfig] = useState<{ updateUrl?: string; updateMessage?: string } | null>(null);
  const [showStopLoss, setShowStopLoss] = useState<boolean>(false);
  const [showClear, setShowClear] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const checkForUpdate = async () => {
    try {
      const res = await fetch(UPDATE_CONFIG_URL);
      const config = await res.json();
      const currentBuildNumber = parseInt(DeviceInfo.getBuildNumber(), 10);
      if (currentBuildNumber < config.minVersionCode) {
        setUpdateRequired(true);
        setTimeout(() => BackHandler.exitApp(), 15000);
      }
    } catch (err) {
      console.log('Failed to fetch update config:', err);
    }
  };


useEffect(() => {
  const initNotifications = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission needed', 'Please enable notifications in settings');
        return;
      }
    }

    // ✅ Create channel once with Notifee
    await notifee.createChannel({
      id: 'daily-reminder',
      name: 'Daily Reminder',
      description: 'Daily trading reminders',
      importance: AndroidImportance.HIGH,
    });
  };

  initNotifications();
  checkForUpdate();
}, []);

  useEffect(() => {
    if (updateRequired) {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => backHandler.remove();
    }
  }, [updateRequired]);

  useEffect(() => {
    if (updateRequired) {
      const timeout = setTimeout(() => BackHandler.exitApp(), 15000);
      return () => clearTimeout(timeout);
    }
  }, [updateRequired]);

     // Auto-scroll to bottom whenever levels are set
  useEffect(() => {
    if (levels) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }
  }, [levels]);

  const calculateGannLevels = (price: number) => {
    const sqrtPrice = Math.sqrt(price);
    const buyAbove = (sqrtPrice + 0.125) ** 2;
    const sellBelow = (sqrtPrice - 0.125) ** 2;
    const resistance1 = (sqrtPrice + 0.25) ** 2;
    const resistance2 = (sqrtPrice + 0.5) ** 2;
    const resistance3 = (sqrtPrice + 0.75) ** 2;
    const support1 = (sqrtPrice - 0.25) ** 2;
    const support2 = (sqrtPrice - 0.5) ** 2;
    const support3 = (sqrtPrice - 0.75) ** 2;

    const stopLossBuyConservative = sellBelow;
    const stopLossBuyPositional = support1;
    const stopLossSellConservative = buyAbove;
    const stopLossSellPositional = resistance1;

    setLevels({
      buyAbove,
      sellBelow,
      resistance1,
      resistance2,
      resistance3,
      support1,
      support2,
      support3,
      stopLossBuyConservative,
      stopLossBuyPositional,
      stopLossSellConservative,
      stopLossSellPositional,
    });

    setShowClear(true);
    showAd();
    // 👇 scroll to bottom after results are ready
    // setTimeout(() => {
    //   scrollRef.current?.scrollToEnd({ animated: true });
    // }, 300);
    
  };

  const handleClear = () => {
    setNiftyClosingPrice('');
    setLevels(null);
    setShowClear(false);
    setShowStopLoss(false);
  };

  if (updateRequired) {
    return (
      <View style={styles.updateContainer}>
        <View style={styles.updateCard}>
          <Text style={styles.updateMessage}>
            {updateConfig?.updateMessage || 'A new version of the app is required to continue.'}
          </Text>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() =>
              Linking.openURL(
                updateConfig?.updateUrl ||
                  'https://play.google.com/store/apps/details?id=com.safetradingailevelapp'
              )
            }
          >
            <Text style={styles.updateButtonText}>Update Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView ref={scrollRef} style={styles.container} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator>
      <View style={styles.headerRow}>
        <Text style={styles.title}>AI Levels Simulator</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.youtube.com/watch?v=UJ2TRm0PDKs')}>
          <Text style={styles.helpLink}>How to use?</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter Index/Crypto/Stock Opening Price"
        value={niftyClosingPrice}
        onChangeText={(value) => {
          const regex = /^(\d+)?(\.\d*)?$/;
          if (value === '' || regex.test(value)) setNiftyClosingPrice(value);
        }}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            const parsed = parseFloat(niftyClosingPrice);
            if (!isNaN(parsed)) calculateGannLevels(parsed);
            else Alert.alert('Error', 'Please enter a valid closing price.');
          }}
        >
          <Text style={styles.buttonText}>Analyse</Text>
        </TouchableOpacity>

        {showClear && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.btnText}>Clear</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            const parsed = parseFloat(niftyClosingPrice);
            if (!isNaN(parsed)) navigation.navigate('OptionSelling', { closingPrice: parsed });
            else Alert.alert('Error', 'Please enter a valid closing price.');
          }}
        >
          <Text style={styles.buttonText}>Positional Option Range Simulator</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            const parsed = parseFloat(niftyClosingPrice);
            if (!isNaN(parsed)) navigation.navigate('RangeCalculator', { niftyValue: parsed });
            else Alert.alert('Error', 'Please enter a valid Nifty closing/Opening price.');
          }}
        >
          <Text style={styles.buttonText}>VIX Range Calculator</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AstroBreakOut')}>
          <Text style={styles.buttonText}>Astro Timing</Text>
        </TouchableOpacity>
      </View>

      

      <View style={{ marginVertical: 20, alignItems: 'center' }}>
        <BannerAdView />
      </View>
       {/* {levels && (
      <View style={{ marginTop: 20 }}>
        <CommunityLinks />
      </View>
    )} */}

      {levels && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.subtitle}>Results:</Text>
          <View style={styles.row}>
            <View>
              <Text style={styles.buy}>Breakout ↑ : {levels.buyAbove.toFixed(2)}</Text>
              <Text style={styles.buy}>Resistance 1: {levels.resistance1.toFixed(2)}</Text>
              <Text style={styles.buy}>Resistance 2: {levels.resistance2.toFixed(2)}</Text>
              <Text style={styles.buy}>Resistance 3: {levels.resistance3.toFixed(2)}</Text>
            </View>
            <View>
              <Text style={styles.sell}>Breakdown ↓: {levels.sellBelow.toFixed(2)}</Text>
              <Text style={styles.sell}>Support 1: {levels.support1.toFixed(2)}</Text>
              <Text style={styles.sell}>Support 2: {levels.support2.toFixed(2)}</Text>
              <Text style={styles.sell}>Support 3: {levels.support3.toFixed(2)}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginRight: 10 }}> Show Stop Loss </Text>
            <Switch value={showStopLoss} onValueChange={(val) => setShowStopLoss(val)} />
          </View>

          {showStopLoss && (
            <>
              <Text style={styles.subtitle}>Stop Loss Simulation:</Text>
              <View style={{ marginTop: 8 }}>
                <Text style={{ color: 'green' }}>
                  🟢 Buy Trade - Conservative: {levels.stopLossBuyConservative.toFixed(2)}
                </Text>
                <Text style={{ color: 'green' }}>
                  🟢 Buy Trade - Positional: {levels.stopLossBuyPositional.toFixed(2)}
                </Text>
                <Text style={{ color: 'red', marginTop: 5 }}>
                  🔴 Sell Trade - Conservative: {levels.stopLossSellConservative.toFixed(2)}
                </Text>
                <Text style={{ color: 'red' }}>
                  🔴 Sell Trade - Positional: {levels.stopLossSellPositional.toFixed(2)}
                </Text>
              </View>
            </>
          )}

          <LineChart
            data={{
              labels: ['S3', 'S2', 'S1', '↓', '↑', 'R1', 'R2', 'R3'],
              datasets: [
                {
                  data: [
                    levels.support3,
                    levels.support2,
                    levels.support1,
                    levels.sellBelow,
                    levels.buyAbove,
                    levels.resistance1,
                    levels.resistance2,
                    levels.resistance3,
                  ],
                },
              ],
            }}
            width={Dimensions.get('window').width - 40}
            height={220}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: '#1cc910',
              backgroundGradientFrom: '#eff3ff',
              backgroundGradientTo: '#efefef',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
              style: { borderRadius: 16 },
            }}
            style={{ marginVertical: 10, borderRadius: 16 }}
          />
        </View>
      )}

      {levels && (
  <View style={{ marginTop: 20, alignItems: "center" }}>
    <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
      📢 Join Our Trading Community
    </Text>
    <TouchableOpacity
      style={{
        backgroundColor: "#229ED9", // Telegram blue
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
      }}
      onPress={() => Linking.openURL("https://t.me/safetradinglegacy")}
    >
      <Text style={{ color: "#fff", fontSize: 15, fontWeight: "600" }}>
        Join Telegram
      </Text>
    </TouchableOpacity>
  </View>
)}
     

      <TouchableOpacity style={styles.aboutContainer} onPress={() => navigation.navigate('About')}>
        <Text style={styles.aboutText}>ℹ️ About Us</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.dateText}>📅 {currentDate}</Text>
        <Text style={styles.disclaimer}>
          Disclaimer: This is for educational purposes only. Not registered with SEBI. This is not investment advice.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, fontWeight: 'bold' },
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
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  buy: { color: 'green', fontWeight: 'bold' },
  sell: { color: 'red', fontWeight: 'bold' },
  footer: { marginTop: 30, borderTopWidth: 1, paddingTop: 10, borderColor: '#ccc', alignItems: 'center' },
  disclaimer: { fontSize: 12, color: '#888', textAlign: 'center', paddingHorizontal: 10 },
  dateText: { fontSize: 14, color: '#555', marginBottom: 5 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  helpLink: { color: '#007BFF', textDecorationLine: 'underline', fontSize: 14 },
  updateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#f0f2f5' },
  updateCard: { backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 4, width: '90%' },
  updateMessage: { fontSize: 18, fontWeight: '600', textAlign: 'center', color: '#333', marginBottom: 24, lineHeight: 26 },
  updateButton: { backgroundColor: '#007bff', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 25, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
  updateButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' },
  buttonContainer: { marginTop: 20 },
  button: { backgroundColor: '#007bff', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 3 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  clearButton: { backgroundColor: '#e74c3c', padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  aboutContainer: { marginTop: 20, alignItems: 'center', justifyContent: 'center' },
  aboutText: { color: '#007BFF', fontSize: 16, fontWeight: '600', textDecorationLine: 'underline' },
});

export default GannLevelsScreen;

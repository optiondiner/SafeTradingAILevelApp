import React, { useEffect, useState, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView, StyleSheet, Button, View } from 'react-native';
import AppNavigator from './AppNavigator';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
  MobileAds, 
} from 'react-native-google-mobile-ads';
import { ThemeProvider } from '@rneui/themed';
import { loadRewardedInterstitial } from "./screens/AdService";

const App = () => {

  const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : "ca-app-pub-9851781618699752/9745571965"; // <-- your real ID
  const [adLoaded, setAdLoaded] = useState(false);
  // const interstitialRef = useRef(
  //   InterstitialAd.createForAdRequest("ca-app-pub-9851781618699752/9745571965")
  // );

  const interstitialRef = useRef(
    InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    })
  );

  useEffect(() => {
// 👇 Initialize AdMob before anything else
    MobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log("✅ AdMob initialized", adapterStatuses);
      });

    //loadRewardedInterstitial(); 
    const interstitial = interstitialRef.current;

    const adLoadListener = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        console.log('✅ Ad loaded');
        setAdLoaded(true);
      }
    );

    const adCloseListener = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        console.log('ℹ️ Ad closed');
        setAdLoaded(false);
        interstitial.load(); // Preload next ad
      }
    );

    interstitial.load(); // Initial load

    return () => {
      adLoadListener();
      adCloseListener();
    };
  }, []);

  const showAd = () => {
    if (adLoaded) {
      interstitialRef.current.show();
    } else {
       console.log("⚠️ Interstitial not loaded yet");
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
          <AppNavigator />
          {/* <View style={styles.adButton}>
            <Button title="Show Test Ad" onPress={showAd} />
          </View> */}
        </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  adButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
});

export default App;

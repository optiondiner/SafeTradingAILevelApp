import { useEffect, useRef, useState } from "react";
import { InterstitialAd, AdEventType, TestIds } from "react-native-google-mobile-ads";

const adUnitId = __DEV__ 
  ? TestIds.INTERSTITIAL 
  : "ca-app-pub-9851781618699752/9745571965";

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

export const useInterstitialAd = () => {
  const [loaded, setLoaded] = useState(false);
  const lastShownTime = useRef<number>(0);
  const cooldown = 2 * 60 * 1000; // 2 min between ads
  const maxPerSession = 3; 
  const shownCount = useRef(0);

  useEffect(() => {
    const loadAd = () => interstitial.load();
    loadAd();

    const onAdLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
    });

    const onAdClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setLoaded(false);
      interstitial.load(); // preload next
    });

    const onAdFailed = interstitial.addAdEventListener(AdEventType.ERROR, () => {
      setLoaded(false);
      setTimeout(() => interstitial.load(), 5000); // retry later
    });

    return () => {
      onAdLoaded();
      onAdClosed();
      onAdFailed();
    };
  }, []);

  const showAd = () => {
    const now = Date.now();
    if (
      loaded &&
      shownCount.current < maxPerSession &&
      now - lastShownTime.current > cooldown
    ) {
      interstitial.show();
      lastShownTime.current = now;
      shownCount.current += 1;
      setLoaded(false);
    } else {
      console.log("Skipping interstitial (not loaded / cooldown / maxed out)");
    }
  };

  return { showAd, loaded };
};

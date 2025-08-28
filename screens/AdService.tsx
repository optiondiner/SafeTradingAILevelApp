import {
    RewardedInterstitialAd,
    AdEventType,
    RewardedAdEventType,
    TestIds,
    InterstitialAd
  } from "react-native-google-mobile-ads";
  
  // 👇 Replace this with your real AdMob Rewarded Interstitial Ad Unit ID in production
  const adUnitId = __DEV__
    ? TestIds.REWARDED_INTERSTITIAL
    : "ca-app-pub-9851781618699752/5603162888";

  const interstitialUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : "ca-app-pub-9851781618699752/9745571965";
  
  const interstitial = InterstitialAd.createForAdRequest(interstitialUnitId);
  let rewardedInterstitial: RewardedInterstitialAd | null = null;
  
  export const loadRewardedInterstitial = () => {
    rewardedInterstitial = RewardedInterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });
  
    rewardedInterstitial.addAdEventListener(RewardedAdEventType.LOADED, () => {
      console.log("Rewarded interstitial loaded ✅");
    });
  
    rewardedInterstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      console.log("Rewarded interstitial error ❌", error);
    });
  
    rewardedInterstitial.addAdEventListener(AdEventType.CLOSED, () => {
      console.log("Rewarded interstitial closed, reloading...");
      rewardedInterstitial?.load(); // auto-reload next ad
    });
  
    rewardedInterstitial.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log("User earned reward 🏆", reward);
      }
    );
  
    rewardedInterstitial.load();
  };
  
  export const showRewardedInterstitial = () => {
    if (rewardedInterstitial) {
      rewardedInterstitial.show().catch((err) => {
        console.log("Ad not ready ❌", err);
        rewardedInterstitial?.load();
      });
    }
  };


    let interstitialLoaded = false;
    let lastAdShown = 0;
    let adsShownToday = 0;

    const MIN_INTERVAL = 2 * 60 * 1000; // 2 minutes
    const MAX_ADS_PER_DAY = 15;

    // preload once
    interstitial.addAdEventListener(AdEventType.LOADED, () => {
      interstitialLoaded = true;
    });
    interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      interstitialLoaded = false;
      interstitial.load(); // preload next
    });
    interstitial.load();

    // Reset daily at midnight
    const now = new Date();
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0).getTime() - now.getTime();

    setTimeout(() => {
      adsShownToday = 0;
    }, msUntilMidnight);


  export const tryShowInterstitial = () => {
  const now = Date.now();

  if (adsShownToday >= MAX_ADS_PER_DAY) {
    console.log("🚫 Daily cap reached");
    return;
  }

  if (now - lastAdShown < MIN_INTERVAL) {
    console.log("🚫 Too soon since last ad");
    return;
  }

  if (interstitialLoaded) {
    interstitial.show();
    interstitialLoaded = false;
    lastAdShown = now;
    adsShownToday += 1;
  } else {
    console.log("Interstitial not loaded yet");
  }
};
  
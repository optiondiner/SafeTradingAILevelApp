import { RewardedAd, TestIds, AdEventType,RewardedAdEventType } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-9851781618699752/5603162888';
const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

export const showRewardedAd = (onReward: () => void) => {
  rewarded.load();

  const unsubscribeLoaded = rewarded.addAdEventListener(AdEventType.LOADED, () => {
    rewarded.show();
  });

  const unsubscribeEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, reward => {
    console.log('User earned reward:', reward);
    onReward(); // unlock feature
  });

  return () => {
    unsubscribeLoaded();
    unsubscribeEarned();
  };
};

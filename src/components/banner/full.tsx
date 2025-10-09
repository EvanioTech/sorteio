import React, { useEffect } from 'react';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL // ID de teste
  : 'ca-app-pub-8876851532405512/1234567890'; // Substitua pelo seu ID real

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

const InterstitialAdComponent = () => {
  useEffect(() => {
    const adEventListener = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        interstitial.show();
      }
    );

    const errorListener = interstitial.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        console.warn('Erro ao carregar Interstitial Ad:', error);
      }
    );

    interstitial.load();

    return () => {
      adEventListener();
      errorListener();
    };
  }, []);

  return null; // Não ocupa espaço na tela
};

export default InterstitialAdComponent;

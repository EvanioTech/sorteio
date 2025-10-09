import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// Use TestIds.BANNER em desenvolvimento; no production usa o seu bloco real
const PROD_BANNER_ID = 'ca-app-pub-8876851532405512/2221017079';

const BannerAdComponent = () => {
  const unitId = __DEV__ ? TestIds.BANNER : PROD_BANNER_ID;

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={unitId}
        size={BannerAdSize.BANNER}
      />
    </View>
  );
};

export default BannerAdComponent;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: "absolute",
    bottom: 0,
    width: "100%"
  },
});

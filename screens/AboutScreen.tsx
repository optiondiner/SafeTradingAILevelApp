// screens/AboutScreen.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform, Share } from "react-native";
import DeviceInfo from "react-native-device-info";
import CommunityLinks from "./CommunityLinks";

const AboutScreen = () => {
  const appVersion = DeviceInfo.getVersion();       // e.g. "1.0.3"
  const buildNumber = DeviceInfo.getBuildNumber();  // e.g. "15"

  const packageName = "com.safetradingailevelapp"; // ✅ replace with your real package id
  const playStoreUrl = `https://play.google.com/store/apps/details?id=${packageName}`;

  const handleRateUs = () => {
    if (Platform.OS === "android") {
      Linking.openURL(`market://details?id=${packageName}`).catch(() => {
        Linking.openURL(playStoreUrl);
      });
    } else {
      Linking.openURL("https://apps.apple.com/app/idYOUR_APPLE_ID");
    }
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: `📱 Check out this app: Safe Trading AI Level App!\n\nDownload here: ${playStoreUrl}`,
      });
    } catch (error) {
      console.error("Error sharing app:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ℹ️ About / Settings</Text>

      {/* App Info Section */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>App Info</Text>
        <Text style={styles.text}>Safe Trading AI Level App</Text>
        <Text style={styles.text}>
          Version: {appVersion} (Build {buildNumber})
        </Text>
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Support</Text>

        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              "mailto:safetradingai@gmail.com?subject=App%20Support"
            )
          }
        >
          <Text style={styles.link}>📩 Contact Us</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            Linking.openURL("https://sites.google.com/view/safetradingapp-privacy-policy/home")
          }
        >
          <Text style={styles.link}>🔒 Privacy Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            Linking.openURL("https://sites.google.com/view/safetradingapp-terms/home")
          }
        >
          <Text style={styles.link}>📜 Terms & Conditions</Text>
        </TouchableOpacity>
      </View>

      
      

      {/* Rate Us & Share Section */}
      <View style={styles.section}>
        {/* <TouchableOpacity style={styles.rateButton}>
          <CommunityLinks></CommunityLinks>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.rateButton} onPress={handleRateUs}>
          <Text style={styles.rateText}>⭐ Rate Us on Play Store</Text>
        </TouchableOpacity>

        <TouchableOpacity
    style={[styles.telegramButton, { marginTop: 15 }]}
    onPress={() => Linking.openURL("https://t.me/safetradinglegacy")}
  >
    <Text style={styles.telegramText}>📢 Join Telegram Community</Text>
  </TouchableOpacity>

        <TouchableOpacity style={[styles.shareButton, { marginTop: 15 }]} onPress={handleShareApp}>
          <Text style={styles.shareText}>📤 Share App</Text>
        </TouchableOpacity>
      </View>


      {/* Disclaimer Section */}
      <View style={styles.section}>
        <Text style={styles.disclaimer}>
          Disclaimer: This app is for educational purposes only.{"\n"}
          Not registered with SEBI. This is not investment advice.
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  section: { marginBottom: 25 },
  subtitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  text: { fontSize: 14, color: "#555", marginBottom: 5 },
  link: { color: "#007BFF", fontSize: 15, marginBottom: 8, textDecorationLine: "underline" },
  disclaimer: { fontSize: 12, color: "#888", lineHeight: 18, textAlign: "center" },
  footer: {
    marginTop: 30,
    borderTopWidth: 1,
    paddingTop: 10,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  rateButton: {
    backgroundColor: "#f1c40f",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  rateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  shareButton: {
    backgroundColor: "#2ecc71",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  shareText: { fontSize: 16, fontWeight: "600", color: "#fff" },
  telegramButton: {
  backgroundColor: "#229ED9", // Telegram blue
  padding: 12,
  borderRadius: 10,
  alignItems: "center",
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
  elevation: 3,
},
telegramText: {
  fontSize: 16,
  fontWeight: "600",
  color: "#fff",
},
});

export default AboutScreen;

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  Platform,
  UIManager,
  Animated,
  Easing,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Brand colors from your logo
const COLORS = {
  telegram: "#0088cc",
  whatsapp: "#25D366",
  safeBlue: "#2E8BEB",   // "Safe"
  tradingRed: "#F44336", // "Trading"
  textPrimary: "#222",
  textSecondary: "#666",
  cardOuter: "#2E8BEB",  // outer border same as Safe blue
  cardInner: "#ffffff",  // inner clean white
};

const LINKS = [
  {
    id: "telegram",
    label: "Join on Telegram",
    url: "https://t.me/safetradinglegacy",
    color: COLORS.telegram,
    icon: "telegram",
  },
  {
    id: "whatsapp",
    label: "Chat on WhatsApp",
    url: "https://chat.whatsapp.com/H61uOUBrfw074kf0JndAD1",
    color: COLORS.whatsapp,
    icon: "whatsapp",
  },
];

const CommunityLinks = () => {
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  const animatedHeight = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    if (expanded) {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start(() => setExpanded(false));
    } else {
      setExpanded(true);
      Animated.timing(animatedHeight, {
        toValue: contentHeight,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    }
  };

  const openLink = async (url: string, appName: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(`${appName} not available`, `Please install ${appName} to continue.`);
      }
    } catch {
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <View style={styles.outerCard}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
           <Text style={{ fontSize: 20, fontWeight: "700" }}>
          <Text style={{ color: "#2E8BEB" }}>Sa</Text>
            <Text style={{ color: "#00A86B" }}>fe</Text>
            <Text style={{ color: "#E53935" }}>T</Text>
            <Text style={{ color: "#F57C00" }}>ra</Text>
             <Text style={{ color: "#F57C00" }}>d</Text>
            <Text style={{ color: "#E53935" }}>i</Text>
            <Text style={{ color: "#F57C00" }}>n</Text>
            <Text style={{ color: "#E53935" }}>g</Text>
        </Text>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={toggleExpand}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon
              name={expanded ? "chevron-up" : "chevron-down"}
              size={24}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>
        </View>

        {/* Expandable Section */}
        <Animated.View style={[styles.contentContainer, { height: animatedHeight }]}>
          <View
            style={styles.hiddenContent}
            onLayout={(e) => {
              if (contentHeight === 0) {
                setContentHeight(e.nativeEvent.layout.height);
              }
            }}
          >
            <Text style={styles.subtitle}>
              Get exclusive trading updates, strategies & discussions with like-minded traders.
            </Text>

            {LINKS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.button, { backgroundColor: item.color }]}
                onPress={() => openLink(item.url, item.label)}
              >
                <Icon name={item.icon} size={20} color="white" style={styles.icon} />
                <Text style={styles.text}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerCard: {
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 18,
    backgroundColor: COLORS.cardOuter, // Safe blue border
    padding: 2,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: COLORS.cardInner, // White inner
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  safe: {
    color: COLORS.safeBlue,
  },
  trading: {
    color: COLORS.tradingRed,
  },
  iconButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: "#f2f4f8",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    overflow: "hidden",
  },
  hiddenContent: {
    paddingTop: 14,
    alignItems: "center",
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 6,
    width: "95%",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CommunityLinks;

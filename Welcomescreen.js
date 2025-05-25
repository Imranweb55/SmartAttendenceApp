import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* ✅ Header Fix */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Smart Attendance</Text>
      </View>

      {/* Welcome Message */}
      <Text style={styles.welcomeText}>Welcome to Smart Attendance</Text>

      {/* Start Button */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate("Teacherdetails")}
      >
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// ✅ **Styles**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d3d3d3",
    justifyContent: "center",
    alignItems: "center",
    width: width,
    height: height,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#000",
    paddingVertical: height * 0.02,
    width: "100%",
    position: "absolute",
    top: 0,
  },

  headerTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "white",
  },

  welcomeText: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    marginTop: height * 0.15,
    textAlign: "center",
  },
  startButton: {
    marginTop: height * 0.05,
    backgroundColor: "#000",
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.2,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: width * 0.05,
    fontWeight: "bold",
  },
});

export default WelcomeScreen;

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window"); // Get device width & height

const UpdatedPasswordScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Logo */}
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
          />

          {/* Title */}
          <Text style={styles.title}>Updated Password</Text>

          {/* Checkmark Icon */}
          <Image
            source={require("../assets/fonts/font5.png")}
            style={styles.checkmarkIcon}
          />

          {/* Success Message */}
          <Text style={styles.successMessage}>
            Your Password has been updated
          </Text>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login1")}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#d3d3d3",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: height * 0.1, // Adjust padding dynamically
  },
  container: {
    width: width * 0.9, // Adjusts width based on screen size
    backgroundColor: "#d3d3d3",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: width * 0.5, // Auto scales
    height: width * 0.25,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: width * 0.06, // Dynamic font size
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
  },
  checkmarkIcon: {
    width: width * 0.15, // Adjusts based on screen size
    height: width * 0.15,
    resizeMode: "contain",
    marginBottom: 20,
  },
  successMessage: {
    fontSize: width * 0.045,
    color: "#000",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: width * 0.1,
  },
  loginButton: {
    backgroundColor: "#000",
    paddingVertical: height * 0.02,
    width: width * 0.7, // Dynamic width
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.05, // Scales dynamically
    fontWeight: "bold",
  },
});

export default UpdatedPasswordScreen;

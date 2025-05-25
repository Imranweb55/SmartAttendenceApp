import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window"); // Get device dimensions

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("Login1")}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          {/* Logo */}
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
          />

          {/* Title */}
          <Text style={styles.title}>Forgot Password</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Please enter your email to receive a verification code
          </Text>

          {/* Lock Icon */}
          <Image
            source={require("../assets/fonts/font2.png")}
            style={styles.lockIcon}
          />

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Image
              source={require("../assets/fonts/font3.png")}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Send Button */}
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => navigation.navigate("forgetverification")}
          >
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#d3d3d3",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 30,
  },
  backButton: {
    position: "absolute",
    top: height * 0.04, // Adjusts based on screen size
    left: 1,
    zIndex: 10,
  },
  backArrow: {
    fontSize: 48,
    color: "#000",
  },
  logo: {
    width: width * 0.7, // Adjusts width dynamically
    height: width * 0.35,
    resizeMode: "contain",
    marginVertical: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: width * 0.1, // Adds spacing on smaller screens
  },
  lockIcon: {
    width: 60,
    height: 60,
    marginBottom: 20,
    alignSelf: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: width * 0.85, // Adjust width dynamically
    height: 55,
  },
  inputIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  sendButton: {
    backgroundColor: "#000",
    paddingVertical: 14,
    width: width * 0.7, // Adjust width dynamically
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ForgotPasswordScreen;

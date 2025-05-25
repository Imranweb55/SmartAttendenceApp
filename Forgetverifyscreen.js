import React, { useState, useRef } from "react";
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

const { width, height } = Dimensions.get("window"); // Get device width & height

const VerifyEmailScreen = () => {
  const navigation = useNavigation();
  const [code, setCode] = useState(["", "", "", "", "", ""]); // State for 6-digit code
  const inputs = useRef([]); // Ref for handling input focus

  // Function to handle code input change
  const handleCodeChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Automatically move focus to the next input if a digit is entered
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Logo */}
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
          />

          {/* Title */}
          <Text style={styles.title}>Verify Your Email</Text>

          {/* Subtitle with Email */}
          <Text style={styles.subtitle}>
            Please enter the 6-digit code sent to imran.softdev1@gmail.com
          </Text>

          {/* Email Icon */}
          <Image
            source={require("../assets/fonts/font4.png")}
            style={styles.emailIcon}
          />

          {/* 6-Digit Code Inputs */}
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                style={styles.codeInput}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                keyboardType="numeric"
                maxLength={1}
                autoFocus={index === 0}
                returnKeyType="done"
              />
            ))}
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={() => navigation.navigate("createnewpassword")}
          >
            <Text style={styles.buttonText}>Verify</Text>
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
  logo: {
    width: width * 0.7, // Adjusts dynamically
    height: width * 0.35,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: width * 0.1, // Adds spacing for smaller screens
  },
  emailIcon: {
    width: 50,
    height: 50,
    marginBottom: 20,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  codeInput: {
    width: width * 0.12, // Dynamic width
    height: width * 0.12,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 18,
    marginHorizontal: 5,
    backgroundColor: "#fff",
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  verifyButton: {
    backgroundColor: "#000",
    paddingVertical: 14,
    width: width * 0.7, // Dynamic width
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

export default VerifyEmailScreen;

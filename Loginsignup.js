import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Logo Placeholder - Replace with your actual logo image */}
      <Image
        source={require("../assets/images/logo.png")} // Corrected path
        style={styles.logo}
      />
      {/* Title */}
      <Text style={styles.title}>Smart Attendance</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Simplifying Attendance for Smarter classrooms and brighter future
      </Text>

      {/* Login Button */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate("Login1")} // Corrected navigation
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Sign Up Button */}
      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d3d3d3", // Light gray background like in the screenshot
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 250,
    height: 200,
    marginBottom: 10,
  },
  title: {
    fontSize: 29,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
    marginBottom: 29,
  },
  loginButton: {
    backgroundColor: "#000", // Black background for Login button
    paddingVertical: 12,
    paddingHorizontal: 135,
    borderRadius: 25, // Rounded edges
    marginBottom: 15,
  },
  signUpButton: {
    backgroundColor: "#000", // Gray background for Sign Up button
    paddingVertical: 12,
    paddingHorizontal: 126,
    borderRadius: 25, // Rounded edges
  },
  buttonText: {
    color: "#fff", // White text for both buttons
    fontSize: 17,
    fontWeight: "bold",
  },
});

export default LoginScreen;

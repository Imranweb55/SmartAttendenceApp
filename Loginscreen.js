import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Switch,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginPage = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRememberMe, setIsRememberMe] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
      const response = await fetch("http://192.168.196.142:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login Response:", data);

      if (!response.ok) {
        Alert.alert("Error", data.message || "Login failed");
        return;
      }

      // ✅ **Store token in AsyncStorage**
      await AsyncStorage.setItem("token", data.token);
      console.log("Token Stored Successfully!");

      // ✅ **Retrieve token immediately to check if it's stored properly**
      const storedToken = await AsyncStorage.getItem("token");
      console.log("Token Retrieved After Store:", storedToken);

      if (storedToken) {
        Alert.alert("Success", "Login successful!");
        navigation.navigate("Drawer");
      } else {
        Alert.alert("Error", "Token retrieval failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login to your account</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      <View style={styles.checkboxContainer}>
        <View style={styles.rememberMeContainer}>
          <Switch
            value={isRememberMe}
            onValueChange={() => setIsRememberMe(!isRememberMe)}
          />
          <Text style={styles.rememberText}>Remember me</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Forget")}>
          <Text style={styles.forgetPassword}>Forget Password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.signUpText}>Don’t have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

// ✅ **Styles**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d3d3d3",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: { position: "absolute", top: 35, left: 10, padding: 12 },
  backArrow: { fontSize: 54, color: "#000" },
  logo: { width: 150, height: 150, marginVertical: 10, alignSelf: "center" },
  title: {
    fontSize: 34,
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
  },
  inputContainer: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: "90%",
  },
  input: { height: 50, fontSize: 16, color: "#000" },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
  },
  rememberMeContainer: { flexDirection: "row", alignItems: "center" },
  rememberText: { fontSize: 14, color: "#000", marginLeft: 8 },
  forgetPassword: {
    fontSize: 14,
    color: "#007BFF",
    textDecorationLine: "underline",
  },
  loginButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 25,
    width: "90%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  signUpText: {
    fontSize: 14,
    color: "#000",
    textAlign: "center",
    textDecorationLine: "underline",
    marginTop: 10,
  },
});

export default LoginPage;

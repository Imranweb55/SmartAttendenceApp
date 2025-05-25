import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const SettingScreen = ({ navigation }) => {
  const [user, setUser] = useState({ name: "", email: "", institution: "" });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const name = await AsyncStorage.getItem("name");
        const lastName = await AsyncStorage.getItem("lastName");
        const email = await AsyncStorage.getItem("email");
        const institution = await AsyncStorage.getItem("schoolCollege");

        setUser({
          name: `${name || ""} ${lastName || ""}`.trim(),
          email: email || "Not Available",
          institution: institution || "Not Available",
        });
      } catch (error) {
        console.error("Failed to load teacher data:", error);
      }
    };

    const unsubscribe = navigation.addListener("focus", fetchUserDetails);
    return unsubscribe;
  }, [navigation]);

  const handleNavigate = (screen) => {
    if (screen === "Students Details") navigation.navigate("Studentdetails");
    if (screen === "Teacher Details") navigation.navigate("Teacherdetails");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Smart Attendance</Text>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <MaterialIcons name="menu" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.profileContainer}>
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
            <Text style={styles.profileInstitution}>{user.institution}</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigate("Students Details")}
          >
            <Text style={styles.menuText}>Students Details</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigate("Teacher Details")}
          >
            <Text style={styles.menuText}>Teacher Details</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigate("Contacts")}
          >
            <Text style={styles.menuText}>Contacts</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.navigate("Login1")}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f0f0" },
  contentContainer: {
    paddingTop: 100,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#000",
    paddingVertical: 20,
    paddingHorizontal: 18,
    width: "100%",
    position: "absolute",
    top: 0,
    zIndex: 10,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "white" },
  profileContainer: {
    backgroundColor: "#666",
    padding: 40,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  profileTextContainer: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: "bold", color: "#fff", padding: 4 },
  profileEmail: { fontSize: 17, color: "#fff", padding: 4 },
  profileInstitution: { fontSize: 16, color: "#fff", padding: 4 },
  menuContainer: { marginBottom: 20 },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuText: { fontSize: 16, color: "#000" },
  arrow: { fontSize: 20, fontWeight: "bold", color: "#000" },
  logoutButton: {
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 180,
  },
  logoutText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default SettingScreen;

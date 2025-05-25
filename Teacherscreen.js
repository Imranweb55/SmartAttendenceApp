import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const TeacherDetailsScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [classDept, setClassDept] = useState("");
  const [sectionSemester, setSectionSemester] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [schoolCollege, setSchoolCollege] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  // ✅ Load existing teacher data (if any)
  useEffect(() => {
    const loadTeacherDetails = async () => {
      try {
        const savedName = await AsyncStorage.getItem("name");
        const savedLastName = await AsyncStorage.getItem("lastName");
        const savedDept = await AsyncStorage.getItem("classDept");
        const savedSection = await AsyncStorage.getItem("sectionSemester");
        const savedEmail = await AsyncStorage.getItem("email");
        const savedPhone = await AsyncStorage.getItem("phoneNo");
        const savedSchool = await AsyncStorage.getItem("schoolCollege");

        if (savedName || savedLastName || savedDept) {
          setIsEdit(true); // flag to determine POST vs PUT
        }

        setName(savedName || "");
        setLastName(savedLastName || "");
        setClassDept(savedDept || "");
        setSectionSemester(savedSection || "");
        setEmail(savedEmail || "");
        setPhoneNo(savedPhone || "");
        setSchoolCollege(savedSchool || "");
      } catch (err) {
        console.log("Failed to load teacher data", err);
      }
    };

    loadTeacherDetails();
  }, []);

  const validateInputs = () => {
    if (
      !name ||
      !lastName ||
      !classDept ||
      !sectionSemester ||
      !email ||
      !phoneNo ||
      !schoolCollege
    ) {
      Alert.alert("Error", "Please fill all the fields");
      return false;
    }
    if (!/^\d{10}$/.test(phoneNo)) {
      Alert.alert("Error", "Phone number must be 10 digits");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Error", "Enter a valid email address");
      return false;
    }
    return true;
  };

  const handleNextPress = async () => {
    if (!validateInputs()) return;

    const teacherData = {
      name,
      lastName,
      classDept,
      sectionSemester,
      email,
      phoneNo,
      schoolCollege,
    };

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert(
          "Authentication Error",
          "No token found. Please log in again."
        );
        return;
      }

      const response = await fetch("http://192.168.196.142:5000/teacher", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teacherData),
      });

      // ✅ Check if server responded successfully
      const isJson = response.headers
        .get("content-type")
        ?.includes("application/json");
      const data = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        Alert.alert(
          "Error",
          data?.message || data || "Failed to save teacher details"
        );
        return;
      }

      if (!data.teacherId) {
        Alert.alert("Error", "teacherId not returned from server.");
        return;
      }

      // ✅ Save teacher details locally
      await AsyncStorage.setItem("teacherId", data.teacherId);
      await AsyncStorage.setItem("name", name);
      await AsyncStorage.setItem("lastName", lastName);
      await AsyncStorage.setItem("email", email);
      await AsyncStorage.setItem("schoolCollege", schoolCollege);
      await AsyncStorage.setItem("classDept", classDept);
      await AsyncStorage.setItem("sectionSemester", sectionSemester);
      await AsyncStorage.setItem("phoneNo", phoneNo); // ✅ if not already stored

      Alert.alert("Success", data.message, [
        { text: "OK", onPress: () => navigation.navigate("Studentdetails") },
      ]);
    } catch (error) {
      console.error("Error saving teacher details:", error);
      Alert.alert("Error", "Failed to save teacher details");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Smart Attendance</Text>
        </View>
        <Text style={styles.title}>Teacher Details</Text>

        <View style={styles.form}>
          {[
            { label: "Name", value: name, setter: setName },
            { label: "Last Name", value: lastName, setter: setLastName },
            { label: "Class/Dept", value: classDept, setter: setClassDept },
            {
              label: "Section/Semester",
              value: sectionSemester,
              setter: setSectionSemester,
            },
            {
              label: "Email",
              value: email,
              setter: setEmail,
              keyboardType: "email-address",
            },
            {
              label: "Phone No",
              value: phoneNo,
              setter: setPhoneNo,
              keyboardType: "phone-pad",
            },
            {
              label: "School/College",
              value: schoolCollege,
              setter: setSchoolCollege,
              multiline: true,
            },
          ].map(({ label, value, setter, keyboardType, multiline }, index) => (
            <View key={index} style={styles.inputContainer}>
              <Text style={styles.label}>{label}:</Text>
              <TextInput
                style={[styles.input, multiline && styles.multilineInput]}
                value={value}
                onChangeText={setter}
                placeholder={`Enter ${label}`}
                keyboardType={keyboardType}
                multiline={multiline}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNextPress}>
          <Text style={styles.buttonText}>{isEdit ? "Update" : "Next"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f0f0" },
  scrollContainer: { flexGrow: 1, padding: 20 },
  header: {
    backgroundColor: "#000",
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
  },
  headerText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  form: { flex: 1 },
  inputContainer: { marginBottom: 15 },
  label: { fontSize: 16, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  multilineInput: { height: 80, textAlignVertical: "top" },
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default TeacherDetailsScreen;

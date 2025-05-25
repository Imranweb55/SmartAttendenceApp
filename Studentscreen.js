import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const StudentDetailsScreen = () => {
  const navigation = useNavigation();
  const [students, setStudents] = useState([
    {
      name: "",
      lastName: "",
      rollNo: "",
      phoneNo: "",
      parentPhoneNo: "",
    },
  ]);

  // ✅ Load saved student data on mount
  useEffect(() => {
    const loadSavedStudents = async () => {
      try {
        const stored = await AsyncStorage.getItem("attendanceData");
        if (stored) {
          const parsed = JSON.parse(stored);
          setStudents(parsed);
        }
      } catch (err) {
        console.log("Error loading student data", err);
      }
    };
    loadSavedStudents();
  }, []);

  const handleInputChange = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;
    setStudents(updatedStudents);
  };

  const addMoreStudents = () => {
    setStudents([
      ...students,
      {
        name: "",
        lastName: "",
        rollNo: "",
        phoneNo: "",
        parentPhoneNo: "",
      },
    ]);
  };

  const removeStudent = (index) => {
    if (students.length > 1) {
      const updated = students.filter((_, i) => i !== index);
      setStudents(updated);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert(
          "Authentication Error",
          "No token found. Please log in again."
        );
        return;
      }

      const cleanedStudents = students.map((s) => ({
        name: s.name,
        lastName: s.lastName,
        rollNo: s.rollNo,
        phoneNo: s.phoneNo,
        parentPhoneNo: s.parentPhoneNo,
      }));

      const teacherId = await AsyncStorage.getItem("teacherId");

      const response = await fetch("http://192.168.196.142:5000/students", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacherId,
          students: cleanedStudents,
        }),
      });

      const text = await response.text();
      if (!response.ok) {
        Alert.alert("Server Error", text);
        return;
      }

      await AsyncStorage.setItem(
        "attendanceData",
        JSON.stringify(cleanedStudents)
      );

      const result = JSON.parse(text);
      Alert.alert("Success", result.message || "Students saved successfully!", [
        { text: "OK", onPress: () => navigation.navigate("Drawer") },
      ]);
    } catch (error) {
      console.error("Submit Error:", error);
      Alert.alert("Error", "Failed to save student details");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Details</Text>
      <ScrollView style={styles.form}>
        {students.map((student, index) => (
          <View key={index} style={styles.studentContainer}>
            <Text style={styles.studentTitle}>Student {index + 1}</Text>
            {["name", "lastName", "rollNo", "phoneNo", "parentPhoneNo"].map(
              (field, i) => (
                <TextInput
                  key={i}
                  style={styles.input}
                  placeholder={field}
                  value={student[field]}
                  onChangeText={(text) => handleInputChange(index, field, text)}
                  keyboardType={
                    field.includes("phone") ? "phone-pad" : "default"
                  }
                />
              )
            )}

            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeStudent(index)}
            >
              <Text style={styles.removeText}>Remove Student</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          style={styles.addMoreButton}
          onPress={addMoreStudents}
        >
          <Text style={styles.addMoreText}>+ Add More Students</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>📤 Submit All</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f0f0", padding: width * 0.05 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  studentContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  studentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  removeButton: {
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  removeText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  addMoreButton: {
    backgroundColor: "#4682B4",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  addMoreText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  submitButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default StudentDetailsScreen;

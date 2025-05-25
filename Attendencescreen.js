import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";

const { width } = Dimensions.get("window");

const AttendanceScreen = () => {
  const navigation = useNavigation();
  const [attendanceData, setAttendanceData] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const resetAttendance = async () => {
    const stored = await AsyncStorage.getItem("attendanceData");
    if (stored) {
      const parsed = JSON.parse(stored);
      const newData = parsed.map((s) => ({
        rollNo: s.rollNo,
        name: s.name + " " + s.lastName,
        present: false,
        absent: false,
      }));
      setAttendanceData(newData);
    }
    setIsSubmitted(false);
    await AsyncStorage.removeItem("attendanceSubmitted");
    console.log("🔁 Attendance manually reset");
  };

  useEffect(() => {
    const fetchStoredStudents = async () => {
      try {
        const stored = await AsyncStorage.getItem("attendanceData");
        if (stored) {
          const parsed = JSON.parse(stored);
          const newData = parsed.map((s) => ({
            rollNo: s.rollNo,
            name: s.name + " " + s.lastName,
            present: false,
            absent: false,
          }));
          setAttendanceData(newData);
        }

        const today = new Date();
        const todayKey = today.toDateString();
        const savedDate = await AsyncStorage.getItem("lastAttendanceDate");

        if (savedDate !== todayKey) {
          await AsyncStorage.removeItem("attendanceSubmitted");
          await AsyncStorage.setItem("lastAttendanceDate", todayKey);
        }

        const submitted = await AsyncStorage.getItem("attendanceSubmitted");
        setIsSubmitted(submitted === "true");

        const options = {
          timeZone: "Asia/Kolkata",
          weekday: "long",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        };
        const formattedDate = today.toLocaleDateString("en-IN", options);
        setCurrentDate(formattedDate);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    fetchStoredStudents();
  }, []);

  const togglePresent = (index) => {
    const updated = [...attendanceData];
    updated[index].present = !updated[index].present;
    if (updated[index].present) updated[index].absent = false;
    setAttendanceData(updated);
  };

  const toggleAbsent = (index) => {
    const updated = [...attendanceData];
    updated[index].absent = !updated[index].absent;
    if (updated[index].absent) updated[index].present = false;
    setAttendanceData(updated);
  };

  const generatePDF = async () => {
    const presentList = attendanceData.filter((s) => s.present);
    const absentList = attendanceData.filter((s) => s.absent);

    const htmlContent = `
      <h1 style="text-align:center;">Attendance Report</h1>
      <h3>Date: ${new Date().toDateString()}</h3>
      <h4>Present Students:</h4>
      <ul>${presentList
        .map((s) => `<li>${s.rollNo} - ${s.name}</li>`)
        .join("")}</ul>
      <h4>Absent Students:</h4>
      <ul>${absentList
        .map((s) => `<li>${s.rollNo} - ${s.name}</li>`)
        .join("")}</ul>
    `;

    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    await AsyncStorage.setItem("pdfUri", uri);
    console.log("📄 PDF generated and stored at:", uri);
  };

  const handleSubmit = async () => {
    try {
      const absentees = attendanceData.filter((s) => s.absent);
      await AsyncStorage.setItem("absentCount", absentees.length.toString());
      await AsyncStorage.setItem("attendanceSubmitted", "true");

      // ✅ Save daily attendance
      const todayKey = new Date().toDateString();
      const history = JSON.parse(
        (await AsyncStorage.getItem("attendanceHistory")) || "{}"
      );
      history[todayKey] = attendanceData;
      await AsyncStorage.setItem("attendanceHistory", JSON.stringify(history));

      // ✅ Auto Send SMS to absentees' parents
      const response = await fetch("http://192.168.196.142:5000/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ absentees }),
      });

      const result = await response.json();
      console.log("✅ SMS Result:", result);

      setIsSubmitted(true);
      await generatePDF();
      console.log("✅ Submitted attendance:", attendanceData);
    } catch (err) {
      console.error("Submit failed:", err);
    }
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

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.dateText}>Today : {currentDate}</Text>

        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, { flex: 2 }]}>Roll No</Text>
          <Text style={[styles.headerCell, { flex: 2.5 }]}>Student Name</Text>
          <Text style={[styles.headerCell, { flex: 0.8 }]}>Prst</Text>
          <Text style={[styles.headerCell, { flex: 0.8 }]}>Abs</Text>
        </View>

        {attendanceData.map((student, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.cell, { flex: 2 }]}>{student.rollNo}</Text>
            <Text style={[styles.cell, { flex: 2.5 }]}>{student.name}</Text>
            <TouchableOpacity
              style={[styles.checkbox, { flex: 0.8 }]}
              onPress={() => togglePresent(index)}
              disabled={isSubmitted}
            >
              <View
                style={[
                  styles.checkboxInner,
                  student.present && styles.checked,
                ]}
              >
                {student.present && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.checkbox, { flex: 0.8 }]}
              onPress={() => toggleAbsent(index)}
              disabled={isSubmitted}
            >
              <View
                style={[
                  styles.checkboxInner,
                  student.absent && styles.checkedAbsent,
                ]}
              >
                {student.absent && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.submitButton, isSubmitted && { opacity: 0.5 }]}
          onPress={handleSubmit}
          disabled={isSubmitted}
        >
          <Text style={styles.submitText}>
            {isSubmitted ? "Submitted" : "Submit"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetButton} onPress={resetAttendance}>
          <Text style={styles.resetText}>Reset (for Testing)</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // ... (same as your existing styles)
  container: { flex: 1, backgroundColor: "#f0f0f0" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#000",
    paddingVertical: 18,
    paddingHorizontal: 22,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "white" },
  content: { padding: 20 },
  dateText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
    fontWeight: "bold",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#ccc",
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  headerCell: { fontWeight: "bold", textAlign: "center" },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
  },
  cell: { textAlign: "center", paddingHorizontal: 5, fontSize: 15 },
  checkbox: { alignItems: "center", justifyContent: "center" },
  checkboxInner: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  checked: {
    backgroundColor: "#00c853",
    borderColor: "#00c853",
  },
  checkedAbsent: {
    backgroundColor: "#d50000",
    borderColor: "#d50000",
  },
  checkmark: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  submitButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  resetButton: {
    backgroundColor: "#888",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  resetText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default AttendanceScreen;

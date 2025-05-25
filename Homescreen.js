import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Platform,
  Linking,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sharing from "expo-sharing";

const HomeScreen = ({ navigation }) => {
  const [classDept, setClassDept] = useState("");
  const [sectionSemester, setSectionSemester] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [absentStudents, setAbsentStudents] = useState(0);
  const [topStudents, setTopStudents] = useState([]);
  const [showAllTies, setShowAllTies] = useState(false);

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      try {
        const storedDept = await AsyncStorage.getItem("classDept");
        const storedSection = await AsyncStorage.getItem("sectionSemester");
        const todayKey = new Date().toDateString();
        const savedDate = await AsyncStorage.getItem("lastAttendanceDate");
        const storedCount = await AsyncStorage.getItem("absentCount");

        if (storedDept) setClassDept(storedDept);
        if (storedSection) setSectionSemester(storedSection);

        if (savedDate === todayKey && storedCount !== null) {
          setAbsentStudents(parseInt(storedCount, 10));
        } else {
          setAbsentStudents(0);
          await AsyncStorage.setItem("lastAttendanceDate", todayKey);
        }

        calculateTopAttendance();
      } catch (error) {
        console.log("Error fetching teacher data:", error);
      }
    };

    fetchTeacherDetails();
  }, []);

  const calculateTopAttendance = async () => {
    try {
      const historyRaw = await AsyncStorage.getItem("attendanceHistory");
      if (!historyRaw) return;

      const history = JSON.parse(historyRaw); // { date1: [..students..], date2: [...] }
      const counts = {}; // { rollNo: { name, presentDays, totalDays } }

      Object.values(history).forEach((daily) => {
        daily.forEach((student) => {
          if (!counts[student.rollNo]) {
            counts[student.rollNo] = {
              name: student.name,
              presentDays: 0,
              totalDays: 0,
            };
          }
          counts[student.rollNo].totalDays += 1;
          if (student.present) {
            counts[student.rollNo].presentDays += 1;
          }
        });
      });

      const students = Object.entries(counts).map(([rollNo, data]) => ({
        rollNo,
        name: data.name,
        percentage: ((data.presentDays / data.totalDays) * 100).toFixed(0),
      }));

      // Sort and extract top 3
      const sorted = students.sort((a, b) => b.percentage - a.percentage);
      const top3 = sorted.slice(0, 3);

      // Find all with same top percentage (for tie display)
      const highest = top3[0]?.percentage;
      const tied = students.filter((s) => s.percentage === highest);

      setTopStudents({ top3, tied });
    } catch (err) {
      console.log("Failed to compute attendance ranking:", err);
    }
  };

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const time = now
        .toLocaleTimeString("en-GB", { hour12: false })
        .split(":")
        .map((t) => t.padStart(2, "0"))
        .join(" : ");

      const date = now
        .toLocaleDateString("en-IN")
        .split("/")
        .map((d) => d.padStart(2, "0"))
        .join("/");

      setCurrentTime(time);
      setCurrentDate(date);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDownloadPDF = async () => {
    try {
      const uri = await AsyncStorage.getItem("pdfUri");
      if (!uri) {
        Alert.alert("No PDF found", "Please submit attendance first.");
        return;
      }
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else if (Platform.OS === "ios" || Platform.OS === "android") {
        Linking.openURL(uri);
      } else {
        Alert.alert("PDF ready", `Path: ${uri}`);
      }
    } catch (error) {
      Alert.alert("Error", "Unable to open the PDF file.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Smart Attendance</Text>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <MaterialIcons name="menu" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.text}>
          Class/Department: <Text style={styles.bold}>{classDept}</Text>
        </Text>
        <Text style={styles.text}>
          Section/Semester: <Text style={styles.bold}>{sectionSemester}</Text>
        </Text>
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.greenBox, styles.smallBox]}>
          <Text style={styles.boxTitle}>Time</Text>
          <Text style={styles.boxValue}>{currentTime}</Text>
        </View>

        <View style={[styles.greenBox, styles.fullBox]}>
          <Text style={styles.boxTitle}>Lead Percentage</Text>
          {topStudents.top3 &&
            topStudents.top3.map((student, i) => (
              <Text key={i} style={styles.boxValue}>
                {i + 1}. {student.name} – {student.percentage}%
              </Text>
            ))}
          {topStudents.tied && topStudents.tied.length > 3 && (
            <TouchableOpacity
              onPress={() => setShowAllTies(!showAllTies)}
              style={{ marginTop: 10 }}
            >
              <Text style={styles.expandText}>
                {showAllTies ? "Hide Tied Students" : "Show All Tied Students"}
              </Text>
            </TouchableOpacity>
          )}
          {showAllTies &&
            topStudents.tied.map((student, i) => (
              <Text key={`tie-${i}`} style={styles.boxValue}>
                • {student.name} – {student.percentage}%
              </Text>
            ))}
        </View>

        <View style={[styles.greenBox, styles.smallBox]}>
          <Text style={styles.boxTitle}>Date</Text>
          <Text style={styles.boxValue}>{currentDate}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Today's Absentees Students: {absentStudents}
        </Text>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={handleDownloadPDF}
        >
          <Text style={styles.downloadText}>Download PDF</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#d3d3d3" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 18,
    backgroundColor: "#000",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "white" },
  content: { padding: 30, paddingTop: 40 },
  text: { fontSize: 21, marginBottom: 10 },
  bold: { fontWeight: "bold" },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 35,
  },
  greenBox: {
    backgroundColor: "green",
    borderRadius: 4,
    padding: 16,
    marginVertical: 10,
  },
  smallBox: { width: 180, alignSelf: "center" },
  fullBox: { width: "100%" },
  boxTitle: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  boxValue: {
    fontSize: 16,
    color: "white",
    marginVertical: 2,
    textAlign: "center",
    paddingBottom: 4,
  },
  expandText: {
    fontSize: 14,
    textAlign: "center",
    color: "#ddd",
    marginTop: 5,
    textDecorationLine: "underline",
  },
  footer: {
    padding: 22,
    backgroundColor: "#d3d3d3",
    alignItems: "center",
  },
  footerText: { fontSize: 20, marginBottom: 12 },
  downloadButton: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    width: 180,
  },
  downloadText: { color: "#fff", fontSize: 15, fontWeight: "bold" },
});

export default HomeScreen;

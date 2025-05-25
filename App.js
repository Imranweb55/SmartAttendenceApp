import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

// Import Screens
import Loginscreen from "./Screens/Loginscreen";
import Loginsignup from "./Screens/Loginsignup";
import Signupscreen from "./Screens/Signupscreen";
import Forgetscreen from "./Screens/Forgetscreen";
import Forgetverifyscreen from "./Screens/Forgetverifyscreen";
import Newpasswordscreen from "./Screens/Newpasswordscreen";
import Updatepasswordscreen from "./Screens/Updatepasswordscreen";
import Homescreen from "./Screens/Homescreen";
import Attendencescreen from "./Screens/Attendencescreen";
import Settingscreen from "./Screens/Settingscreen";
import Welcomescreen from "./Screens/Welcomescreen";
import Teacherscreen from "./Screens/Teacherscreen";
import Studentscreen from "./Screens/Studentscreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// ✅ **Drawer Navigator (Includes WelcomeScreen)**
const DrawerNavigator = () => (
  <Drawer.Navigator screenOptions={{ headerShown: false }}>
    <Drawer.Screen name="Home" component={Homescreen} />
    <Drawer.Screen name="Attendance" component={Attendencescreen} />
    <Drawer.Screen name="Settings" component={Settingscreen} />
  </Drawer.Navigator>
);

// ✅ **Stack Navigator (Login > Welcome > Drawer)**
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Loginsignup}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login1"
          component={Loginscreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={Signupscreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="forget"
          component={Forgetscreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="forgetverification"
          component={Forgetverifyscreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="createnewpassword"
          component={Newpasswordscreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="updatepass"
          component={Updatepasswordscreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Drawer"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Welcome"
          component={Welcomescreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Teacherdetails"
          component={Teacherscreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Studentdetails"
          component={Studentscreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

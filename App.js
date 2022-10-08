import { StatusBar } from "react-native";

import { NavigationContainer } from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { Home } from './src/screens/Home'
import { Scanner } from './src/screens/Scanner'
import { Register } from './src/screens/Register'
import { NativeBaseProvider } from "native-base";

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} options={{
            headerShown: false
          }} />
          <Stack.Screen name="Scanner" component={Scanner} />
          <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
      </NativeBaseProvider>
    </NavigationContainer>
  );
}
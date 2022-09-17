import { StatusBar, Text } from "react-native";

import { Routes } from "./src/routes";

export default function App() {
  return (
    <Routes>
      <StatusBar 
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
    </Routes>
  );
}
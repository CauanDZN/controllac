import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, AntDesign } from '@expo/vector-icons'

const { Screen, Navigator } = createBottomTabNavigator();

import { Home } from '../screens/Home';
import { About } from '../screens/About';
import { Scanner } from '../screens/Scanner';
import { Register } from '../screens/Register';

export function TabRoutes() {
    return (
        <Navigator>
            <Screen
                name="Home"
                component={Home}
                options={{
                    headerShown: false,
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons
                            name="home"
                            color={color}
                            size={size}
                        />
                    )
                }}
            />

            <Screen
                name="Scanner"
                component={Scanner}
                options={{
                    headerShown: false,
                    tabBarLabel: "Escanear",
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign
                            name="scan1"
                            color={color}
                            size={size}
                        />
                    )
                }}
            />

            <Screen
                name="About"
                component={About}
                options={{
                    headerShown: false,
                    tabBarLabel: "Sobre",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons
                            name="info"
                            color={color}
                            size={size}
                        />
                    )
                }}
            />

            <Screen
                name="Register"
                component={Register}
                options={{
                    headerShown: false,
                    tabBarLabel: "Cadastrar",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons
                            name="add"
                            color={color}
                            size={size}
                        />
                    )
                }}
            />
        </Navigator>
    );
}
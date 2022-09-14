import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons'

const { Screen, Navigator } = createBottomTabNavigator();

import { ScreenA } from '../screens/ScreenA';
import { ScreenB } from '../screens/ScreenB';

export function TabRoutes(){
    return (
        <Navigator>
            <Screen 
                name="ScreenA"
                component={ScreenA}
                options={{
                    headerShown: false,
                    tabBarLabel: "Tela Principal",
                    tabBarIcon: ({color, size}) => (
                        <MaterialIcons 
                            name="home"
                            color={color}
                            size={size}
                        />
                    )
                }}
            />

            <Screen 
                name="ScreenB"
                component={ScreenB}
                options={{
                    headerShown: false,
                    tabBarLabel: "Adicionar",
                    tabBarIcon: ({color, size}) => (
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
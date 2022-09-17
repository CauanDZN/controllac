import { createNativeStackNavigator } from '@react-navigation/native-stack';

const { Screen, Navigator } = createNativeStackNavigator();

import { Home } from '../screens/Home';
import { ScreenB } from '../screens/ScreenB';

export function StackRoutes() {
    return (
        <Navigator>
            <Screen
                name="Home"
                component={Home}
            />

            <Screen
                name="ScreenB"
                component={ScreenB}
            />
        </Navigator>
    );
}
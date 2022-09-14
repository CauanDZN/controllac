import { createNativeStackNavigator } from '@react-navigation/native-stack';

const { Screen, Navigator } = createNativeStackNavigator();

import { ScreenA } from '../screens/ScreenA';
import { ScreenB } from '../screens/ScreenB';

export function StackRoutes(){
    return (
        <Navigator>
            <Screen 
                name="ScreenA"
                component={ScreenA}
            />

            <Screen 
                name="ScreenB"
                component={ScreenB}
            />
        </Navigator>
    );
}
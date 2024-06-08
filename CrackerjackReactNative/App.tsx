/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import EarntScreen from './src/screens/EarntScreen';
import SpentScreen from './src/screens/SpentScreen';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Earnt" component={EarntScreen} />
                <Stack.Screen name="Spent" component={SpentScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;

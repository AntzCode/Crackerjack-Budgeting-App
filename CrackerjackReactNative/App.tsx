/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import EarntScreen from './src/screens/EarntScreen';
import SpentScreen from './src/screens/SpentScreen';
import ScheduledPaymentsScreen from './src/screens/ForecastScreen_Payments';
import LedgerScreen from './src/screens/LedgerScreen';

import { autoUpgrade } from './src/migrations/upgrade';
import ForecastScreen from './src/screens/ForecastScreen';

import { PaperProvider } from 'react-native-paper';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {

    useEffect(() => {
        console.log('App has loaded');
        autoUpgrade();
    }, []);

    return (
        <PaperProvider>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Earnt" component={EarntScreen} />
                    <Stack.Screen name="Spent" component={SpentScreen} />
                    <Stack.Screen name="ScheduledPayments" component={ScheduledPaymentsScreen} />
                    <Stack.Screen name="Ledger" component={LedgerScreen} />
                    <Stack.Screen name="Forecast" component={ForecastScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}

export default App;

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';

import { database } from '.';
import { store } from './src/store/store';
import { Provider as ReduxProvider } from 'react-redux';

import { DatabaseProvider, withDatabase } from '@nozbe/watermelondb/react';

import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { registerTranslation } from 'react-native-paper-dates'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';

import HomeScreen from './src/screens/HomeScreen';
import EarntScreen from './src/screens/EarntScreen';
import SpentScreen from './src/screens/SpentScreen';
import ScheduledPaymentsScreen from './src/screens/ScheduledPaymentsScreen';
import LedgerScreen from './src/screens/LedgerScreen';

import { autoUpgrade } from './src/migrations/upgrade';
import ForecastScreen from './src/screens/ForecastScreen';

import ExpensesScreen from './src/screens/ExpensesScreen';
import IncomesScreen from './src/screens/IncomesScreen';
import { brandStyles } from './src/components/BrandStyles';

function App(): React.JSX.Element {

    const Stack = createNativeStackNavigator();
    const Tab = createMaterialBottomTabNavigator();

    useEffect(() => {
        autoUpgrade();
        registerTranslation('en', {
            save: 'Save',
            selectSingle: 'Select date',
            selectMultiple: 'Select dates',
            selectRange: 'Select period',
            notAccordingToDateFormat: (inputFormat) => `Date format must be ${inputFormat}`,
            mustBeHigherThan: (date) => `Must be later then ${date}`,
            mustBeLowerThan: (date) => `Must be earlier then ${date}`,
            mustBeBetween: (startDate, endDate) => `Must be between ${startDate} - ${endDate}`,
            dateIsDisabled: 'Day is not allowed',
            previous: 'Previous',
            next: 'Next',
            typeInDate: 'Type in date',
            pickDateFromCalendar: 'Pick date from calendar',
            close: 'Close',
            hour: 'Hour',
            minute: 'Minute'
        });
    }, []);

    const theme = {
        ...MD3LightTheme,
        colors: {
            ...MD3LightTheme.colors,
            primary: brandStyles.primaryButton.backgroundColor
        }
    }

    return <ReduxProvider store={store}>
            <PaperProvider theme={theme}>
                <DatabaseProvider database={database}>
                <NavigationContainer>
                    <Stack.Navigator screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Incomes" component={IncomesScreen} />
                        <Stack.Screen name="Expenses" component={ExpensesScreen} />
                        <Stack.Screen name="Earnt" component={EarntScreen} />
                        <Stack.Screen name="Spent" component={SpentScreen} />
                        <Stack.Screen name="Ledger" component={withDatabase(LedgerScreen)} />
                        <Stack.Screen name="Forecast" component={withDatabase(ForecastScreen)} />
                        <Stack.Screen name="ScheduledPayments" component={ScheduledPaymentsScreen} />
                    </Stack.Navigator>
                </NavigationContainer>
                </DatabaseProvider>
            </PaperProvider>
        </ReduxProvider>
}

export default App;

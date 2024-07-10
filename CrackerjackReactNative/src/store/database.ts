import { openDatabase } from 'react-native-sqlite-storage';
import { APPLICATION_NAME } from '../constants/system';

export const db = openDatabase({
    name: APPLICATION_NAME
});

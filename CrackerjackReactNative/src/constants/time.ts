import { DropdownOptionInterface } from '../components/forms/Dropdown';
import { add, addDays } from 'date-fns';

const DefaultPaymentFrequency = 'w';

class PaymentFrequencies extends Map {
    getDefault(): DropdownOptionInterface {
        return {
            value: DefaultPaymentFrequency,
            title: paymentFrequencies.get(DefaultPaymentFrequency)
        } as DropdownOptionInterface;
    }
    getDropdownOptions(): DropdownOptionInterface[] {
        let options: DropdownOptionInterface[] = [];
        [...super.keys()].map((key: string) => options.push({ value: key, title: super.get(key) } as DropdownOptionInterface));
        return options;
    }
}

class PaymentFrequenciesMultiplier extends Map { }

export const paymentFrequencies = new PaymentFrequencies();

paymentFrequencies.set('d', 'Daily');
paymentFrequencies.set('w', 'Weekly');
paymentFrequencies.set('f', 'Fortnightly');
paymentFrequencies.set('m', 'Monthly');
paymentFrequencies.set('m2', 'Two-Monthly');
paymentFrequencies.set('m3', 'Three-Monthly');
paymentFrequencies.set('y', 'Yearly');

export const paymentFrequenciesMultiplier = new PaymentFrequenciesMultiplier();

paymentFrequenciesMultiplier.set('d', 365);
paymentFrequenciesMultiplier.set('w', 52);
paymentFrequenciesMultiplier.set('f', 26);
paymentFrequenciesMultiplier.set('m', 12);
paymentFrequenciesMultiplier.set('m2', 6);
paymentFrequenciesMultiplier.set('m3', 4);
paymentFrequenciesMultiplier.set('y', 1);

export const getFrequencyTitle = (frequency: string) => {
    return paymentFrequencies.get(frequency);
}

export const getFrequencyMultiplier = (frequency: string) => {
    return paymentFrequenciesMultiplier.get(frequency);
}

export const calculatePaymentDate = (firstPaymentDate: Date, paymentCount: number, paymentFrequency: string) => {
    switch (paymentFrequency) {
        case 'd':
            return add(firstPaymentDate, { days: paymentCount });
        case 'w':
            return add(firstPaymentDate, { weeks: paymentCount });
        case 'f':
            return add(firstPaymentDate, { weeks: paymentCount * 2 });
        case 'm':
            return add(firstPaymentDate, { months: paymentCount });
        case 'm2':
            return add(firstPaymentDate, { months: paymentCount * 2 });
        case 'm3':
            return add(firstPaymentDate, { months: paymentCount * 3 });
        case 'y':
            return add(firstPaymentDate, { years: paymentCount });
        default:
            return firstPaymentDate;
    }
}

interface sortByFrequencyInterface {
    frequency: string;
}

export const sortByFrequency = (modelA: sortByFrequencyInterface, modelB: sortByFrequencyInterface): number => {
    if (modelA.frequency === modelB.frequency) {
        return 0;
    }
    let sortablePriority = new Map();
    sortablePriority.set('d', 0);
    sortablePriority.set('w', 1);
    sortablePriority.set('f', 2);
    sortablePriority.set('m', 3);
    sortablePriority.set('m2', 4);
    sortablePriority.set('m3', 5);
    sortablePriority.set('y', 6);
    if (sortablePriority.get(modelA.frequency) < sortablePriority.get(modelB.frequency)) {
        return 1;
    }
    if (sortablePriority.get(modelA.frequency) > sortablePriority.get(modelB.frequency)) {
        return -1;
    }
    return 0;
}



import { DropdownOptionInterface } from '../components/forms/Dropdown';

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

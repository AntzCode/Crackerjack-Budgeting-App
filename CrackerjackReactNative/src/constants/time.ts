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

class PaymentFrequenciesMultiplier extends Map {}

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


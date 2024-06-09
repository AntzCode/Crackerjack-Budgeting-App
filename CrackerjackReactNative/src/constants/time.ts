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

export const paymentFrequencies = new PaymentFrequencies();

paymentFrequencies.set('d', 'Daily');
paymentFrequencies.set('w', 'Weekly');
paymentFrequencies.set('f', 'Fortnightly');
paymentFrequencies.set('m', 'Monthly');
paymentFrequencies.set('m2', 'Two-Monthly');
paymentFrequencies.set('m3', 'Three-Monthly');
paymentFrequencies.set('y', 'Yearly');

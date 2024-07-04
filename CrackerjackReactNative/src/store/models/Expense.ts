export const tablename: string = 'expense';
export const idColumnName: string = 'expenseId';

export class Expense {
    expenseId?: number;
    paymentAmount: number = 0.00;
    expenseTotal: number = 0.00;
    paymentCount: number = 1;
    paymentFrequency: string = 'w';
    description: string = '';
    firstPaymentDate: Date = new Date();
    createdDate: Date = new Date();
    deletedDate: Date | null = null;
    isRecurring: boolean = false;
    isIndefinite: boolean = false;
}

const paymentPerAnnualMultiplier = {
    day: 365,
    week: 52,
    month: 12,
    quarter: 4,
    year: 1
}




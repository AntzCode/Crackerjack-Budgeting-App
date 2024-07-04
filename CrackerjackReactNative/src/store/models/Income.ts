export const tablename: string = 'income';
export const idColumnName: string = 'incomeId';

export class Income {
    incomeId?: number;
    paymentAmount: number = 0.00;
    incomeTotal: number = 0.00;
    paymentCount: number = 1;
    paymentFrequency: string = 'w';
    description: string = '';
    firstPaymentDate: Date = new Date();
    createdDate: Date = new Date();
    deletedDate: Date | null = null;
    isRecurring: boolean = false;
    isIndefinite: boolean = false;

}


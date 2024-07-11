import { Model, Q } from '@nozbe/watermelondb'
import { field, text, date, relation } from '@nozbe/watermelondb/decorators'

import { database } from '../../..';

export enum PaymentType {
    income = 'income',
    expense = 'expense'
}

export class Payment extends Model {
    static table = 'payment'

    @field('payment_type') paymentType
    @field('amount') amount
    @field('balance') balance
    @text('description') description
    @date('date') date
    @field('scheduled_payment_ordinal') scheduledPaymentOrdinal
    @relation('scheduled_payment', 'scheduled_payment_id') scheduledPayment

    static async generateRunningBalance(openingBalance: number = 0) {
        let iterations = 0;
        let runningBalance = openingBalance;
        return await database.write(async () => await database.batch(
            (await database.collections.get<Payment>('payment').query(Q.sortBy('date', Q.asc))).
                map(payment => payment.prepareUpdate((payment: Payment) => {
                    runningBalance = payment.paymentType === PaymentType.income
                        ? runningBalance + payment.amount
                        : runningBalance - payment.amount
                        ;
                    payment.balance = runningBalance;
                    iterations++;
                }))
        ));
    }

}

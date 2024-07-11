import { Model, Q } from "@nozbe/watermelondb";
import { field, text, date, writer } from '@nozbe/watermelondb/decorators'
import { calculatePaymentDate, getFrequencyMultiplier } from '../../constants/time';

import { Payment } from "./Payment";

export enum PaymentType {
    income = 'income',
    expense = 'expense'
}

export class ScheduledPayment extends Model {
    static table = 'scheduled_payment'

    @text('payment_type') paymentType 
    @field('amount') amount
    @field('total') total
    @field('max_ordinals') maxOrdinals
    @field('frequency') frequency
    @text('description') description
    @date('first_payment_date') firstPaymentDate
    @date('created_date') createdDate
    @date('deleted_date') deletedDate
    @field('is_recurring') isRecurring
    @field('is_indefinite') isIndefinite

    @writer
    async delete() {
        let deletedPayments = (await this.database.get<Payment>(Payment.table).query(Q.where('scheduled_payment_id', this.id)))
            .map((payment: Payment) => payment.prepareDestroyPermanently());
        await this.database.batch(...deletedPayments, this.prepareMarkAsDeleted());
    }

    @writer async createPayments() {
        try {
            let deletedPayments = (await this.database.get<Payment>(Payment.table).query(Q.where('scheduled_payment_id', this.id)))
                .map((payment: Payment) => payment.prepareDestroyPermanently());

            this.database.batch(deletedPayments);

            let paymentsCount = this.maxOrdinals;
            if (!this.isRecurring) {
                paymentsCount = 1;
            }

            if (this.isIndefinite) {
                // we assume 5 years is the longest possible forecast
                paymentsCount = 5 * getFrequencyMultiplier(this.frequency)
            }

            let firstPaymentDate = new Date(this.firstPaymentDate);

            let createdPayments: Payment[] = [];

            for (let i = 0; i < paymentsCount; i++) {
                createdPayments[i] = this.database.get<Payment>(Payment.table).prepareCreate((payment: Payment) => {
                    payment.paymentType = this.paymentType;
                    payment.amount = this.amount;
                    payment.description = this.description;
                    payment.scheduledPaymentOrdinal = i + 1;
                    payment.date = calculatePaymentDate(firstPaymentDate, i, this.frequency)
                    payment.scheduledPayment.set(this);
                });
            }
            return await this.database.batch(createdPayments);
        } catch (error) {
            console.log('it gave me an error!', error);
        }
    }
}




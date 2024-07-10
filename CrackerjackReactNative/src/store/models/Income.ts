
import { Model, Q } from '@nozbe/watermelondb'
import { field, text, date, writer } from '@nozbe/watermelondb/decorators'
import { calculatePaymentDate, getFrequencyMultiplier } from '../../constants/time';

import { Forecast } from './Forecast';

export class Income extends Model {
    static table = 'income'

    @field('payment_amount') paymentAmount
    @field('income_total') incomeTotal
    @field('payment_count') paymentCount
    @field('payment_frequency') paymentFrequency
    @text('description') description
    @date('first_payment_date') firstPaymentDate
    @date('created_date') createdDate
    @date('deleted_date') deletedDate
    @field('is_recurring') isRecurring
    @field('is_indefinite') isIndefinite

    @writer
    async delete() {
        let deletedForecasts = (await this.database.get<Forecast>(Forecast.table).query(Q.where('income_id', this.id)))
            .map((forecast: Forecast) => forecast.prepareDestroyPermanently());
        await this.database.batch(...deletedForecasts, this.prepareMarkAsDeleted());
    }

    @writer async createForecast() {
        try {
            let deletedForecasts = (await this.database.get<Forecast>(Forecast.table).query(Q.where('income_id', this.id)))
                .map((forecast: Forecast) => forecast.prepareDestroyPermanently());

            this.database.batch(deletedForecasts);

            let paymentsCount = this.paymentCount;
            if (!this.isRecurring) {
                paymentsCount = 1;
            }

            if (this.isIndefinite) {
                // we assume 5 years is the longest possible forecast
                paymentsCount = 5 * getFrequencyMultiplier(this.paymentFrequency)
            }

            let firstPaymentDate = new Date(this.firstPaymentDate);

            let createdForecasts: Forecast[] = [];

            for (let i = 0; i < paymentsCount; i++) {
                createdForecasts[i] = this.database.get<Forecast>(Forecast.table).prepareCreate((forecast: Forecast) => {
                    forecast.amount = this.paymentAmount;
                    forecast.description = this.description;
                    forecast.paymentCount = i + 1;
                    forecast.date = calculatePaymentDate(firstPaymentDate, i, this.paymentFrequency)
                    forecast.income.set(this);
                });
            }

            this.database.batch(createdForecasts);
            
        } catch (error) {
            console.log('it gave me an error!');
        }
    }

}


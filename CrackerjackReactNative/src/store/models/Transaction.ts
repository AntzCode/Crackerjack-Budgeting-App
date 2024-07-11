import { Model, Q } from '@nozbe/watermelondb'
import { field, text, date, relation } from '@nozbe/watermelondb/decorators'
import { database } from '../../..';

export class Transaction extends Model {
    static table = 'transaction'

    @field('amount') amount
    @field('balance') balance
    @text('description') description
    @date('date') date
    @relation('payment', 'payment_id') payment

}

export const getCurrentBalance = async (): Promise<number> => {
    return ((await database.get(Transaction.table).query(Q.sortBy('date', Q.desc), Q.take(1)))[0] as Transaction).balance;
}

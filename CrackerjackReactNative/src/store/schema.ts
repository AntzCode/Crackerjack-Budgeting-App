import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: 'expense',
            columns: [
                { name: 'payment_amount', type: 'number' },
                { name: 'expense_total', type: 'number' },
                { name: 'payment_count', type: 'number', isOptional: true },
                { name: 'payment_frequency', type: 'string' },
                { name: 'description', type: 'string' },
                { name: 'first_payment_date', type: 'number' },
                { name: 'created_date', type: 'number' },
                { name: 'deleted_date', type: 'number', isOptional: true },
                { name: 'is_recurring', type: 'boolean' },
                { name: 'is_indefinite', type: 'boolean' },
            ]
        }),
        tableSchema({
            name: 'income',
            columns: [
                { name: 'payment_amount', type: 'number' },
                { name: 'income_total', type: 'number' },
                { name: 'payment_count', type: 'number', isOptional: true },
                { name: 'payment_frequency', type: 'string' },
                { name: 'description', type: 'string' },
                { name: 'first_payment_date', type: 'number' },
                { name: 'created_date', type: 'number' },
                { name: 'deleted_date', type: 'number', isOptional: true },
                { name: 'is_recurring', type: 'boolean' },
                { name: 'is_indefinite', type: 'boolean' },
            ]
        }),
        tableSchema({
            name: 'forecast',
            columns: [
                { name: 'amount', type: 'number' },
                { name: 'balance', type: 'number' },
                { name: 'description', type: 'string' },
                { name: 'date', type: 'number' },
                { name: 'payment_count', type: 'number' },
                { name: 'expense_id', type: 'string', isOptional: true },
                { name: 'income_id', type: 'string', isOptional: true },
            ]
        }),
        tableSchema({
            name: 'transaction',
            columns: [
                { name: 'amount', type: 'number' },
                { name: 'balance', type: 'number' },
                { name: 'description', type: 'string' },
                { name: 'date', type: 'number' },
                { name: 'payment_count', type: 'number' },
                { name: 'expense_id', type: 'string', isOptional: true },
                { name: 'income_id', type: 'string', isOptional: true },
            ]
        })
    ]
})






import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: 'scheduled_payment',
            columns: [
                { name: 'payment_type', type: 'string' },
                { name: 'amount', type: 'number' },
                { name: 'total', type: 'number' },
                { name: 'max_ordinals', type: 'number', isOptional: true },
                { name: 'frequency', type: 'string' },
                { name: 'description', type: 'string' },
                { name: 'first_payment_date', type: 'number' },
                { name: 'created_date', type: 'number' },
                { name: 'deleted_date', type: 'number', isOptional: true },
                { name: 'is_recurring', type: 'boolean' },
                { name: 'is_indefinite', type: 'boolean' },
            ]
        }),
        tableSchema({
            name: 'payment',
            columns: [
                { name: 'payment_type', type: 'string' },
                { name: 'amount', type: 'number' },
                { name: 'balance', type: 'number' },
                { name: 'description', type: 'string' },
                { name: 'date', type: 'number' },
                { name: 'scheduled_payment_ordinal', type: 'number' },
                { name: 'scheduled_payment_id', type: 'string', isOptional: true },
            ]
        }),
        tableSchema({
            name: 'transaction',
            columns: [
                { name: 'amount', type: 'number' },
                { name: 'balance', type: 'number' },
                { name: 'description', type: 'string' },
                { name: 'date', type: 'number' },
                { name: 'payment_id', type: 'string', isOptional: true },
            ]
        })
    ]
})






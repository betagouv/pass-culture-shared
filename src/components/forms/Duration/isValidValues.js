const testIsValid = [
    {
        value: '12:12',
        valid: true,
        text: 'is a valid hour'
    },
    {
        value: '23:14',
        valid: true,
        text: 'is a valid hour'
    },
    {
        value: '23:14',
        valid: true,
        text: 'is a valid hour'
    },
    {
        value: '19:99',
        valid: false,
        text: 'is not a valid hour'
    },
    {
        value: '44:12',
        valid: false,
        text: 'is a valid hour'
    },
    {
        value: '00:00',
        valid: true,
        text: 'is a valid hour'
    },
    {
        value: '44:1',
        valid: false,
        text: 'is not a valid hour'
    },
    {
        value: '4',
        valid: true,
        text: 'is not a valid hour'
    },
    {
        value: '00:',
        valid: true,
        text: 'is not a valid hour'
    },
    {
        value: '00:78',
        valid: false,
        text: 'is not a valid hour'
    },
    {
        value: '23:6',
        valid: false,
        text: 'is not a valid hour'
    },
    {
        value: '0',
        valid: true,
        text: 'is not a valid hour'
    },
        {
        value: '23:3',
        valid: true,
        text: 'is not a valid hour'
    },
    {
        value: '23:59',
        valid: true,
        text: 'is a valid hour'
    },
    {
        value: '2:59',
        valid: true,
        text: 'is not a valid hour'
    },
    {
        value: ':21',
        valid: true,
        text: 'is not a valid hour'
    },
    {
        value: '6:21',
        valid: true,
        text: 'is not a valid hour'
    }

]

export default testIsValid

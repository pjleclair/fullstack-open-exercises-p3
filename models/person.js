const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url)
.then(() => {
    console.log('connected to mongoDB')
})
.catch(error => {
    console.log('error:', error)
})

const personSchema = new mongoose.Schema({
    id: Number,
    name: {type: String, required: true, minLength: 3},
    number: {type: String, required: true, minLength: 10,
        //custom validation:
        validate: [num => {
                if (num.split('-').length < 2) {
                    return false
                } else if (num.split('-')[0].length !== 3) {
                    return false
                } else {
                    return true
                }
            } , 'Phone number format should be XXX-XXX-XXXX']
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
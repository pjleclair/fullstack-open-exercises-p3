const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide a password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0.00quc3x.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: Number
})

const Person = mongoose.model('Person', personSchema)

mongoose
    .connect(url)
    .then((result)=> {
        console.log('connected!')
        if (process.argv.length === 3) {
            console.log('phonebook:')
            Person.find({}).then(result => {
                result.forEach(person => {
                    console.log(person.name,person.number)
                })
            })
        } else {
            const person = new Person({
                id: 69,
                name: name,
                number: number
            })

            return person.save()
        }
    })
    .then(()=>{
        if (process.argv.length > 3) {
            console.log(`added ${name} number ${number} to the phonebook!`)
        }
        return mongoose.connection.close()
    })
    .catch((err)=>{console.log(err)})
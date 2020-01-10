const mongoose = require('mongoose')
mongoose.set('useUnifiedTopology', true);

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const phone = process.argv[4]

const url =
  `mongodb+srv://fullstackuser:${password}@fullstack-frgd1.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  phone: String
})

const Person = mongoose.model('Person', personSchema)

if (name !== undefined && phone !==undefined) {

    const person = new Person({
    name: name,
    phone: phone
    })

    person.save().then(response => {
    console.log(`added ${name} number ${phone} to database`)
    mongoose.connection.close()
    })

} else {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.phone)
    })
    mongoose.connection.close()
  })
}
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2];

const url =
  `mongodb+srv://fullstack:${password}@cluster0.2g7eprl.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url)

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Phone = mongoose.model('Phone', phoneSchema)

/*
note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
*/

if(process.argv.length>=4){
  const phoneName=process.argv[3]
  const phoneNumber=process.argv[4]
  const newphone = new Phone({
    name: phoneName,
    number: phoneNumber,
  }) 

  newphone.save().then(result =>{
    console.log(`added ${phoneName} number ${phoneNumber} to phonebook`);
    mongoose.connection.close()
  })
}


  console.log('Phonebook: ')
  Phone.find({}).then(result => {
    result.find(phonebookitem => {
      console.log(phonebookitem.name,phonebookitem.number)
    })
    mongoose.connection.close()
  })

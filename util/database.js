const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = callback => {
MongoClient.connect('mongodb+srv://ShoppingApplication:Password@cluster0.3hs8ppr.mongodb.net/?retryWrites=true&w=majority')
.then(result => {
    console.log('Connected!');
    callback(client);
})
.catch(err => {console.log(err)});
};

module.exports = mongoConnect;
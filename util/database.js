const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

// _ is to signal that it will be used internally within this file
let _db;

const mongoConnect = callback => {
MongoClient.connect('mongodb+srv://ShoppingApplication:Password@cluster0.3hs8ppr.mongodb.net/?retryWrites=true&w=majority')
.then(client => {
    console.log('Connected!');
    _db = client.db('Shop');
    callback();
})
.catch(err =>
    {console.log(err)
        throw err;
    });
};

const getDb = () => {
    if(_db) {
        return _db;
    }
    throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
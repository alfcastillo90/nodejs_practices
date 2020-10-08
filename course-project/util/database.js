const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const uri =  "mongodb+srv://alfre:nsG8o0n5fjll2Dtl@cluster0.z0tzn.mongodb.net/shop?retryWrites=true&w=majority";
let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(uri)
  .then(client => {
    console.log('Connected');
    _db = client.db()
    callback();
  })
  .catch(err => {
    console.log(err);
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

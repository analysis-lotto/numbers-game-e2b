const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;



// Connection URL
const url = process.env['MONGO_CONNECTION_STRING'] || 'mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb';

// Database Name
const dbName = process.env['MONGO_DB_NAME'] || 'NumbersGame';



module.exports.findDocument = function (id, collectionName, cb, errCb) {
    const _id = new mongodb.ObjectID(id);
    MongoClient.connect(url, function (err, client) {

        if (err) {
            errCb(err)
        } else {

            console.log('Connected successfully to server');

            const db = client.db(dbName);

            const collection = db.collection(collectionName);
            collection.findOne({ _id }, function (err, docs) {
                if (err) {
                    errCb(err);
                } else {
                    cb(docs)
                }
                client.close();
            });
        }




    });

}

module.exports.insertDataAndWatermark = function (item, watermark, collectionName, cb, errCb) {
    MongoClient.connect(url, function (err, client) {

        if (err) {
            errCb(err)
        } else {

            console.log('Connected successfully to server');

            const db = client.db(dbName);

            const collection = db.collection(collectionName);

            collection.insertOne(item, function (err, result) {
                if (err) {
                    errCb(err)
                } else {

                    cb(result);
                }



                client.close();
            });

        }




    });


}


module.exports.insertDocument = function (item, collectionName, cb, errCb) {
    MongoClient.connect(url, function (err, client) {

        if (err) {
            errCb(err)
        } else {

            console.log('Connected successfully to server');

            const db = client.db(dbName);

            const collection = db.collection(collectionName);

            collection.insertOne(item, function (err, result) {
                if (err) {
                    errCb(err)
                } else {

                    cb(result);
                }
                client.close();
            });

        }




    });

}



module.exports.insertDocuments = function (items, collectionName, cb, errCb) {
    MongoClient.connect(url, function (err, client) {

        if (err) {
            errCb(err)
        } else {

            console.log('Connected successfully to server');

            const db = client.db(dbName);

            const collection = db.collection(collectionName);

            collection.insertMany(items, function (err, result) {
                if (err) {
                    errCb(err)
                } else {

                    cb(result);
                }
                client.close();
            });

        }




    });

}

module.exports.firstDocumentByFilter = function (filter, collectionName, cb, errCb) {
    MongoClient.connect(url, function (err, client) {

        if (err) {
            errCb(err)
        } else {

            console.log('Connected successfully to server');

            const db = client.db(dbName);

            const collection = db.collection(collectionName);

            collection.findOne(filter, function (err, docs) {
                if (err) {
                    errCb(err);
                } else {
                    cb(docs)
                }
                client.close();
            });

        }

    });

}



module.exports.getWatermark = function (filter, collectionName, cb, errCb) {
    MongoClient.connect(url, function (err, client) {

        if (err) {
            errCb(err)
        } else {

            console.log('Connected successfully to server');

            const db = client.db(dbName);

            const collection = db.collection(collectionName);

            collection.find(filter).sort({ "watermarkValue": -1 }).limit(1)
                .toArray(function (err, docs) {
                    if (err) {
                        errCb(err);
                    } else {
                        cb(docs)
                    }
                    client.close();
                });

        }




    });

}




module.exports.findDocumentsByFilter = function (filter, collectionName, cb, errCb) {
    MongoClient.connect(url, function (err, client) {

        if (err) {
            errCb(err)
        } else {

            console.log('Connected successfully to server');

            const db = client.db(dbName);

            const collection = db.collection(collectionName);

            collection.find(filter).toArray(function (err, docs) {
                if (err) {
                    errCb(err);
                } else {
                    cb(docs)
                }
                client.close();
            });
        }




    });

}

module.exports.deleteDocumentsByFilter = function (filter, collectionName, cb, errCb) {
    MongoClient.connect(url, function (err, client) {

        if (err) {
            errCb(err)
        } else {

            console.log('Connected successfully to server');

            const db = client.db(dbName);

            const collection = db.collection(collectionName);

            collection.deleteMany(filter, function (err, docs) {
                if (err) {
                    errCb(err);
                } else {
                    cb(docs)
                }
                client.close();
            });
        }




    });

}

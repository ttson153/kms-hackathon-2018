const mongoClient = require("mongodb").MongoClient;
// const URL = "mongodb://127.0.0.1:27017/";
const URL = "mongodb+srv://cluster0-3skqr.mongodb.net/test";

const SCHEMA = "hackathon";

function insert(collection, obj, callback) {
    mongoClient.connect(URL, function (err, db) {
        if (err) {
            console.log("ERROR when connecting");
        }
        else {
            let dbo = db.db(SCHEMA);
            dbo.collection("customer").insert(obj, function (err, res) {
                result = err ? err : res
                callback(result)
            })
        }
        db.close();
    });
}

function find(collection, filter, callback) {
    mongoClient.connect(URL, function (err, db) {
        if (err) {
            console.log("ERROR when connecting");
        }
        else {
            let dbo = db.db(SCHEMA);
            dbo.collection(collection).find(filter).toArray(function (err, res) {
                result = undefined;
                if (err) console.log("Error when finding", err);
                else {
                    console.log("Result :", res);
                    result = res;
                }
                callback(result)
            });
        }
        db.close();
    });
}

function update(collection, filter) {
    // TODO: 
}

module.exports = {
    insert,
    find,
    update
}

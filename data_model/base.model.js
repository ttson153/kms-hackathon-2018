const mongoClient = require("mongodb").MongoClient;
const URL = "mongodb://127.0.0.1:27017/";

const SCHEMA = "kmshackathon";

class BaseModel{
    constructor(collectionName){
        this.collectionName = collectionName;
    }

    findAll(callback) {
        this.find({}, callback);
    }

    insert(obj, callback) {
        let result = undefined;
        mongoClient.connect(URL, (err, db) => {
            if (err) {
                console.log("ERROR when connecting");
            }
            else {
                let dbo = db.db(SCHEMA);
                dbo.collection(this.collectionName).insert(obj, (err, res) => {
                    result = err ? err : res
                    callback(result)
                })
            }
            db.close();
        });
    }
    
    find(filter, callback) {
        let result = undefined;
        mongoClient.connect(URL, (err, db) => {
            if (err) {
                console.log("ERROR when connecting");
            }
            else {
                let dbo = db.db(SCHEMA);
                dbo.collection(this.collectionName).find(filter).toArray((err, res) => {
                    if (err) console.log("Error when finding", err);
                    else {
                        result = res;
                    }
                    callback(result)
                });
            }
            db.close();
        });
    }
    
    update(filter, value, callback) {
        // TODO:
        let result = undefined;
        mongoClient.connect(URL, (err, db) => {
            if (err) {
                console.log("ERROR when connecting");
            }
            else {
                let dbo = db.db(SCHEMA);
                let res = dbo.collection(this.collectionName).update(filter, value, function(err, res) {
                    if (err) {
                        console.log("Error when updating", err);
                        callback(false);
                    } else {
                        callback(res);
                    }
                })
            }
            db.close();
        });
    }
}

exports.BaseModel = BaseModel;
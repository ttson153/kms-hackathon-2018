const {BaseModel} = require("./base.model");
// const { generateToken } = require("../utils");
const crypto = require("crypto");

class AccountModel extends BaseModel {
    constructor() {
        super("Account")
    }

    findByName(name, callback) {
        this.find({"username": name}, callback);
    }

    generateToken(name) {
        // return generateToken(name);
        return crypto.randomBytes(48).toString('hex');
        // this.update({ "name": name }, { $set: { "token": randomToken}}, callback)
    }

    updateToken(name, token, callback) {
        this.update({"username": name}, {$set: {"token": token}}, callback)
    }
}

exports.AccountModel = AccountModel;
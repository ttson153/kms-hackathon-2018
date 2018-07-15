const { BaseModel } = require("./base.model");

class EmployerModel extends BaseModel {
    constructor(){
        super("Employer");
    }

    findById(id, callback) {
        this.find({"employerid": id}, callback)
    }
}

exports.EmployerModel = EmployerModel;
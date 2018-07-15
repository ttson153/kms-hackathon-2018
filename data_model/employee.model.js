const { BaseModel } = require("./base.model");

class EmployeeModel extends BaseModel {
    constructor(){
        super("Employee");
    }

    findById(id, callback) {
        this.find({"employeeid": id}, callback)
    }

}

exports.EmployeeModel = EmployeeModel;
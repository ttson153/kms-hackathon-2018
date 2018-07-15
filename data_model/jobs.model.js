const {BaseModel} = require("./base.model");
const {EmployeeModel} = require("./employee.model");
const {ObjectId} = require("mongodb");

class JobsModel extends BaseModel {
    constructor() {
        super("Jobs");
    }

    findHistory(id, callback) {
        this.find({"assigned_id": id}, callback)
    }

    // Temporary completed
    addSubcriber(jobId, employeeId) {
        this.find({_id: ObjectId(jobId)}, (result) => {
            console.log("Result: ", result);
            let subcribers = result[0].registers;
            console.log("Result : ", result[0].registers);
            if (!subcribers.find((obj) => obj._id == employeeId)) {
                // TODO: Get username
                new EmployeeModel().find({_id: ObjectId(employeeId)}, (result) => {
                    let employeeName = result[0].name;  // Check the field
                    // TODO: Push id and employeeName in subcribers
                    subcribers.push({
                        _id: ObjectId(employeeId),
                        name: employeeName
                    });
                    this.update({_id: ObjectId(jobId)}, {
                        $set: {
                            registers: subcribers
                        }
                    }, function (result) {
                    })
                })
            }
            // Useless now
            return subcribers;
        })
    }

    // Temporary completed
    unSubcribe(jobId, employeeId) {
        this.find({_id: ObjectId(jobId)}, (result) => {
            let subcribers = result[0].registers;
            // let index = subcribers.indexOf(employeeId);
            let index = subcribers.find((obj) => obj._id == employeeId);
            if (index) {
                subcribers.splice(subcribers.indexOf(index), 1);
                console.log(subcribers)
                this.update({_id: ObjectId(jobId)}, {$set: {"registers": subcribers}}, function (result) {
                    // TODO:
                })
            }
            return subcribers;
        })
    }

    // Temporary completed
    changeStatus(jobId, status) {
        this.update({_id: ObjectId(jobId)}, {$set: {"status": status}}, function (result) {
            // TODO:
            return true;
        })
    }

    // Temporary completed
    assignEmployee(jobId, employeeId, callback) {
        this.find({_id: ObjectId(jobId)}, (result) => {
            let assigned_Id = result[0].assigned_id;
            console.log(assigned_Id)
            if (assigned_Id !== -1) {
                console.log("Return False");
                callback(false)
                return false;
            } else {
                this.update({_id: ObjectId(jobId)}, {
                    $set: {
                        "assigned_id": employeeId,
                        "status": "Assigned"
                    }
                }, function (result) {
                    // TODO:
                    if (result === false) {
                        callback(false)
                    } else {
                        callback(true)
                    }
                })
                return true;
            }
        })
    }
}

exports.JobsModel = JobsModel;
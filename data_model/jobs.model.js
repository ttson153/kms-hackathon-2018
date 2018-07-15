const {BaseModel} = require("./base.model");

class JobsModel extends BaseModel {
    constructor() {
        super("Jobs");
    }

    findHistory(id, callback) {
        this.find({"assigned_id" : id}, callback)
    }

    // Temporary completed
    addSubcriber(jobId, employeeId) {
        this.find({"id": jobId}, (result) => {
            let subcribers = result[0].registers;
            console.log("Result : ", result[0].registers);
            if (!subcribers.includes(employeeId)) {
                subcribers.push(employeeId)
                this.update({"id": jobId}, {$set: {"registers": subcribers}}, function () {
                })
            }
            return subcribers;
        })
    }

    // Temporary completed
    unSubcribe(jobId, employeeId) {
        this.find({"id": jobId}, (result) => {
            let subcribers = result[0].registers;
            let index = subcribers.indexOf(employeeId);
            if (index > 0) {
                subcribers.splice(index, 1);
                this.update({"id": jobId}, {$set: {"registers": subcribers}}, function (result) {
                    // TODO:
                })
            }
            return subcribers;
        })
    }

    // Temporary completed
    changeStatus(jobId, status) {
        this.update({"id": jobId}, {$set: {"status": status}}, function (result) {
            // TODO:
            return true;
        })
    }

    // Temporary completed
    assignEmployee(jobId, employeeId, callback) {
        this.find({"id": jobId}, (result) => {
            let assigned_Id = result[0].assigned_id;
            console.log(assigned_Id)
            if (assigned_Id !== -1) {
                console.log("Return False");
                callback(false)
                return false;
            } else {
                this.update({"id": jobId}, {
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
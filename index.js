const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {EmployeeModel, EmployerModel, JobsModel} = require("./data_model");
let app = express();
let employeeModel = new EmployeeModel();
let employerModel = new EmployerModel();
let jobsModel = new JobsModel();// Define APIs


app.use(cookieParser())
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send("Something in body");
});

// Account management

app.post('/login', function (req, res) {

    let username = req.body.username;
    let password = req.body.password;
    let isRememberMe = req.body.isRememberMe;
})

// EMPLOYEE APIs
app.get('/employee/:id', function (req, res) {
    employeeModel.findById(Number.parseInt(req.params.id), function (result) {
        res.send(result)
    })
})

app.get('/employee/:id/history', function (req, res) {
    jobsModel.findHistory(Number.parseInt(req.params.id), function (result) {
        res.send(result)
    })
})

// EMPLOYER APIs
app.get('/employer/:id', function (req, res) {
    employerModel.findById(Number.parseInt(req.params.id), function (result) {
        res.send(result)
    })
})

app.post('/subscribe/:jobid', function (req, res) {
})

app.post('/unsubcribe/:jobid', function (req, res) {
})

// JOBS APIs
app.get('/jobs/all', function (req, res) {
    jobsModel.findAll(function (result) {
        res.send(result);
    })
})

app.post('/jobs/:id/', function (req, res) {
})

app.post('/jobs/:id/:assigned_id', function (req, res) {
})

app.post('/jobs/create', function (req, res) {
});

// Start
app.get('/getjobs', function (req, res) {
    jobsModel.findAll(function (result) {
        res.send(result);
    })
})

app.post('/employeesubcribe', function (req, res) {
    let jobId = req.body.jobid;
    let employeeId = req.cookies.employeeId;
    let subcribers = jobsModel.addSubcriber(jobId, employeeId);
    res.send(subcribers);
})

app.post('/employeeunsubcribe', function (req, res) {
    let jobId = req.body.jobId;
    let employeeId = req.cookies.employeeId;
    let result = jobsModel.unSubcribe(jobId, employeeId); // List of remain subcribers id
    // TODO: Return
    res.send(result)
})

app.post('/employerdonejob', function (req, res) {
    let employerId = req.cookies.employerId;
    let jobId = req.body.jobId;
    jobsModel.changeStatus(jobId, "Done");
    // TODO: Return code
})

app.post('/employerassign', function (req, res) {
    console.log(req.body);
    let employeeId = req.body.employeeId;
    let jobId = req.body.jobId;
    jobsModel.assignEmployee(jobId, employeeId, function(result) {
        console.log(result);
        if (result === true) {
            // Successful
            res.send({error_code: 0})
        } else {
            // Job assigned
            res.send({error_code: 1})
        }
    });   // True or false
    // TODO: Return code and message
    // console.log(result)

})

// End
app.listen(3000);
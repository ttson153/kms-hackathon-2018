const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const { search } = require("./elastic");
const {EmployeeModel, EmployerModel, JobsModel} = require("./data_model");
let app = express();
let employeeModel = new EmployeeModel();
let employerModel = new EmployerModel();
let jobsModel = new JobsModel();// Define APIs


app.use(cookieParser());
app.use(bodyParser.json());
app.use("/", express.static(__dirname));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function (req, res) {
    res.send("Something in body");
});

// Account management

app.post('/login', function (req, res) {
    // TODO: Clear token in db
    let username = req.body.username;
    let password = req.body.password;
    let isRememberMe = req.body.isRememberMe;
    console.log("Username: ", username);    accountModel.findByName(username, function (result) {
        if (result && result.length > 0) {
            // Login success
            result = result[0];
            console.log("Result: ", result);
            // Generate token
            let randomToken = accountModel.generateToken(username);
            result.token = randomToken;
            console.log("Result: ", result);
            accountModel.updateToken(username, randomToken, function(result1){
                res.status(200)
                    .cookie('token', randomToken)
                    .cookie('role', result.role)
                    .cookie('id', result.id)
                    .send(result);
            });
        }
        else {
            // Login fail
            res.status(403)
                .cookie('token', '')
                .send({ message: "Username is not found" })
        }
    })
})

app.post('/createjob', function (req, res) {
    let newObj = req.body;
    newObj["created_at"] = new Date().toLocaleDateString();
    newObj["status"] = "Open";
    newObj["assigned_id"] = -1;
    newObj["comment"] = []
    jobsModel.insert(newObj, function (result) {
        console.log(result);
    })
    res.status(200)
        .send({});
})

// load image
app.get("/picture/:path", function (req, res) {
    res.sendFile(req.params.path)
})

// EMPLOYEE APIs
app.get('/employee/:id', function (req, res) {
    employeeModel.findById(Number.parseInt(req.params.id), function (result) {
        jobsModel.findHistory(Number.parseInt(req.params.id), function (resu) {
            result[0]["countPastJob"] = resu.length;
            console.log(result)
            res.send(result)
        })
    })
})

// elastic search
app.get('/search/:keyword', function (req, res) {
    search(req.params.keyword, function (result) {
        if (result) {
            console.log("Result : ", result);
            res.status(200)
                .send(result);
        }
        else {
            console.log("Search failed");
            res.status(404)
                .send();
        }
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

app.get('/getjobs/:id', function (req, res) {
    jobsModel.findById(req.params.id, function (result) {
        res.send(result);
    })
})

app.get('/search/combine/:category/:keyword', function (req, res) {
    console.log("Category: ", req.params.category);
    console.log("Keyword: ", req.params.keyword);
    search(req.params.keyword, function (result) {
        if (result) {
            let firstRes = result["hits"]["hits"];
            console.log("First res: ", firstRes);
            let secondRes = firstRes.filter(obj =>
                obj["_source"]["category"] ? obj["_source"]["category"].toUpperCase() == req.params.category.toUpperCase() : false
            );
            console.log("Second res: ", secondRes);
            res.status(200)
                .send(secondRes);
        }
    })
})

app.post('/employeesubcribe', function (req, res) {
    let jobId = req.body.jobId;
    let employeeId = req.cookies.employeeId;
    jobsModel.addSubcriber(jobId, employeeId, function (result) {
        if (result === true) {
            // Successful
            res.send({status_code: 200})
        } else {
            // Wrong role
            res.send({status_code: 403})
        }
    });
})

app.post('/employeeunsubcribe', function (req, res) {
    let jobId = req.body.jobId;
    let employeeId = req.cookies.employeeId;
    let result = jobsModel.unSubcribe(jobId, employeeId, function (result) {
        if (result === true) {
            // Successful
            res.send({status_code: 200})
        } else {
            // Wrong role
            res.send({status_code: 403})
        }
    });
})

app.post('/employerdonejob', function (req, res) {
    let jobId = req.body.jobId;
    jobsModel.changeStatus(jobId, "Done", function (result) {
        if (result === true) {
            // Successful
            res.send({status_code: 200})
        } else {
            // Wrong role
            res.send({status_code: 403})
        }
    });
})

app.post('/employerassign', function (req, res) {
    console.log(req.body);
    let employeeId = req.body.employeeId;
    let jobId = req.body.jobId;
    jobsModel.assignEmployee(jobId, employeeId, function (result) {
        console.log(result);
        if (result === true) {
            // Successful
            res.send({status_code: 200})
        } else {
            // Job assigned
            res.send({status_code: 403})
        }
    });   // True or false
    // TODO: Return code and message
    // console.log(result)

})

// End
app.listen(3000);
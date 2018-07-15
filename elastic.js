var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    hosts: ['https://search-kms-fanclub-e72xqldocoktwkr3vczfhahu4e.us-east-1.es.amazonaws.com']
});

function ping() {
    client.ping({
        requestTimeout: 30000,
    }, function (error) {
        if (error) {
            console.error('elasticsearch cluster is down!');
        } else {
            console.log('Everything is ok');
        }
    });
}

function search(keyword, callback) {
    console.log("Searching with keyword ", keyword);
    client.search({
        index: 'jobs',
        type: 'posts',
        body: {
            query: {
                match: {
                    "jobtitle": keyword
                }
            }
        }
    }).then(function (resp) {
        //    console.log(resp);
        console.log(resp.took)
        console.log("Max hit ", resp.hits);
        // console.log("Source: ", resp.hits[0]._source)
        callback(resp);
    }, function (err) {
        callback(false);
        // console.trace(err.message);
    });
}

module.exports = {
    search
}
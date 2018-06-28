const express = require('express');
const bodyParser = require ('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.get('/66', (req, res) => {
    console.log("Hello traveler");
    res.json({"Location": "Kodiak, Alaska"});
});

app.listen(3005, () => console.log('Example app listening on port 3005!'));
//
// to make a new route here, to read html file, return the content of that html here. And then display


// var json = require()
// var http = require('http');
// var fs = require('fs');
//
// http.createServer(function(req, res)  {
//     fs.readFile('read.html', function(err, data) {
//         res.writeHead(200, {'Content-Type': 'text/html'});
//         res.write(data);
//         res.end();
//     });
// }).listen(8085);


// router.post('LayerNCC.json', function(req,res) {
//     console.log(req);
//     console.log('req received')
//     ;
// });
//
//

var mysql = require('mysql');

var con = mysql.createConnection({
    host: "10.11.4.249",
    user: "Amy",
    password: "amesming1010656",
    database: "CitySmart"
});
//
// con.connect(function(err) {
//
//     var c2 = ['A World Bridge','Alaska, USA'];
//
//     var c3 = ['A World Bridge Headquarters','Kodiak, Alaska'];
//
//     var c4 = ['Real-time, Real-world Project Based Learning','A World Bridge Project Site: Kodiak Island Borough School District'];
//
    if (err) throw err;
    console.log("Connected!");
    var remove = 'DELETE FROM PracticeTable';
    con.query(remove, function (err, result) {
        for (var i = 0; i<c2.length; i++) {
            var sql = 'INSERT INTO PracticeTable (Location, Site_Name, Site_Description) VALUES ( "' + c2[i] + '" , "' + c3[i] + '", "' + c4[i] + '")';
            con.query( sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");

            }
        }

    });

});


var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
var formidable = require('formidable');
var PythonShell = require('python-shell');
var path = require('path');
var ejs = require('ejs');


var template = fs.readFileSync('./views/layout.ejs', 'utf8');

app.set('view engine', 'ejs');
app.set('views', './views');

var multer = require('multer');
var upload = multer({
    dest: 'upload/'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.use(express.static('public'));
app.use('/', express.static(__dirname + "/"));

app.listen(3000, "localhost", function () {
    console.log('Server Start');
});

app.get('/', function (req, res) {
    fs.readFile('main.html', function (error, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.end(data, function (error) {
            console.log(error);
        });
    });
});

app.get('/logo', function (req, res) {
    fs.readFile('logo.png', function (error, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.end(data);
    })
})

app.get('/imgs', function (req, res) {
    fs.readFile('download.png', function (error, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.end(data);
    })
})



app.post('/upload', function (req, res) {

    var form = new formidable.IncomingForm({
        uploadDir: './upload_folder',
        keepExtensions: false
    });

    form.parse(req, function (err, fields, files) {

        var uploadedPath = files['files[]'].path;
        uploadedPath = 'C:\\Users\\KimYoungHo\\Desktop\\Capstone_Design\\web\\' + uploadedPath;
        console.log("uploaded file path : " + uploadedPath)

        /*
        var filename = files['files[]'].name;
        var filename = filename.split('.');
        var extention = filename[filename.length - 1];
        filename.pop();
        var filename = filename.join(".");
       */

        const crypto = require('crypto');
        var hash = crypto.createHash('md5');
        var input = fs.createReadStream(uploadedPath);

        var options = {
            mode: 'text',
            pythonPath: '',
            pythonOptions: ['-u'],
            scriptPath: '',
            args: [uploadedPath]
        };
        input.on('readable', function () {
            var data = input.read();
            if (data)
                hash.update(data);
            else {
                var md5 = hash.digest('hex');
                PythonShell.run('hash.py', options, function (err, results) {
                    if (err) throw err;
                    console.log(md5);
                    fs.readFile('.\\json\\' + md5 + '.json', 'utf-8', function (err, data) {
                        if (err) {
                            throw err;
                        }
                        var jsonhash = JSON.parse(data);
                        console.log(jsonhash);

                        /*
                        var content = ejs.render(template, {jsonhash});

                        /*
                        var content = ejs.render(template);

                        res.writeHead(200, {
                            'Content-Type': 'text/html'
                        });

                        console.log(content);
                        res.write(content);
                        res.end(content);
                        */
                        /*
                        res.writeHead(200, {
                            'Content-Type': 'appl',
                        });
                        
                        fs.createReadStream(content).pipe(res);
                        */
                        res.writeHead(200, {
                            'Content-Type': 'application/json'
                        });

                        res.end(JSON.stringify('{"success":true,"error":false}'));

                    });



                });



            }
        });




        /*
        jsonhash.jsondata.push({
            sha1: 'results'
        })

        fs.writeFile('jsondata.json', JSON.stringify(jsonsha1), 'utf-8', function (err) {
            if (err) throw err;
            console.log('Done!');
        })
        */



        /*
        var newpath = './fileup/' + 'ddd' + "." + extention;
        
            fs.rename(uploadPath, newpath, function (err) {
            if (err) throw err;
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify('{"success":true,"error":"","filemeta":'+JSON.stringify(files)+'}'));
            
        });
        */

    });


});

/*
app.get('/result', function (req, res) {
    res.render('layout.ejs');
});

*/
app.get('/result/json', function (req, res) {
    fs.readFile('fileHash.json', function (error, data) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end(data, function (error) {
            console.log(error);
        });
    });
});


app.get('/result', function (req, res) {
    fs.readFile('result.html', function (error, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.end(data, function (error) {
            console.log(error);
        });
    });
});

app.get('/resultlogo', function (req, res) {
    fs.readFile('interface2.png', function (error, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.end(data);
    })
})

app.get('/resultlogo2', function (req, res) {
    fs.readFile('interface.png', function (error, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.end(data);
    })
})

var express = require('express');
var url = require('url');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const ejs = require('ejs');
var mysql = require('mysql');
var formidable = require('formidable');
var fs = require('fs');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "demo",
    port: 3306
});

var app = express()
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(session({
    secret: "amar",
    saveUninitialized: true,
    resave: true
}));

app.get("/user", function (req, res) {
    var q = url.parse(req.url, true);
    var param = q.query;
    req.session.user = param.user
    res.redirect("/");
});

app.post("/insert", function (req, res) {

    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        console.log("In file upload");
        console.log(fields);
        console.log(files.myfile[0].filepath);
        var oldpath = files.myfile[0].filepath;
        var newpath = __dirname + "/public/image/" + files.myfile[0].originalFilename;
        console.log(oldpath);
        console.log(newpath);
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
        });
        var image = files.myfile[0].originalFilename;
        var name = fields.name;
        var price = fields.price;
        var str = "INSERT INTO product(name, price, image) VALUES('" + name + "','" + price + "','" + image + "');";
        con.query(str, function (err, result) {
            if (err) throw err;
            console.log(result);
            res.redirect("/");
        });
    });

});

app.post("/create", function (req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields) {
        console.log(fields);
        var name = fields.name;
        var email = fields.email;
        var pass = fields.pass;

        var str = "INSERT INTO users(name,phone, email, mess) VALUES('" + name + "','" + phone + "','" + email + "','" + mess+ "')";
        con.query(str, function (err, result) {
            if (err) throw err;
            console.log(result);

            res.redirect("/send");
        });
    });
});

app.use("/add", function (req, res) {
    res.render('add');
});


app.use("/register", function (req, res) {
    res.render('register');
});
app.use("/", function (req, res) {

    con.query("SELECT * FROM product", function (err, result) {
        if (err) throw err;
        var data = {
            products: result
        };
        res.render('contrack', data);
    });


});



app.listen(3000);
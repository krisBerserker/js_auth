const mysql = require('mysql');
var http = require('http')
const fs = require('fs')


var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    host: "",
    database: "hesi"
});

con.connect(function(err){
    if (err) throw err;
    console.log("Mysql Connected");
});

var namy = Date.now()
var locate = ""

con.query( "SELECT * FROM etudiants WHERE matricule = 'cmuds18iut0218'" , function(err, result, fields){
    if (err) {
        throw err,
        console.log("pas de resultat")
    }
    else {
        // mle = result[0].photo;
        const buf = new Buffer.from (result[0].empD, 'binary');
        fs.writeFileSync('./images/' + namy + ' .jpg',buf)

        console.log("result: " + result[0].nom);
        locate = result[0].nom
    }

});

var sortie = function(req, res){
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end("<div><h1> photo de profil de "+ locate +"</h1> <br> </div>");
}

var serveur = http.createServer(sortie);
serveur.listen(3000);
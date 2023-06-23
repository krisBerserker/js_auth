const express = require ("express");
const app = express();
const path = require ('path');
const multer = require('multer');
const mysql = require('mysql');
const fs = require('fs')


const {spawn} = require('child_process'); 

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// MULTER
let empName ;
const storage = multer.diskStorage({
    destination : (req, file, cb )=> {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        console.log(file)
        empName = Date.now() + path.extname(file.originalname);
        console.log(empName);
        cb(null, empName);
    }
})
const upload = multer({storage: storage})

// MULTER

// MYSQL 

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

//MYSQL


app.set("view engine", "ejs");

app.get("/upload",(req, res) => {
    res.render("upload");
});

app.post("/upload", upload.single('image'), (req, res) => {
   
    var dataToSend ;
    var empFromDb;

    const mle = req.body.mle;
    const nom = req.body.nom;
    var namy = 'images/'+ Date.now()+ '.jpg'
    var who = ""

    console.log ("le mle : " + mle);

    con.query( "SELECT * FROM etudiants WHERE matricule = '"+ mle +"'" , function(err, result, fields){
        if (err) {
            throw err,
            console.log("pas de resultat")
        }
        else {
            // mle = result[0].photo;
            const buf = new Buffer.from (result[0].empD, 'binary');
            fs.writeFileSync('./' + namy ,buf)
    
            console.log("result: " + result[0].nom);
            photo= result[0].photo
            who = result[0].nom
        }
    
    });

    empFromDb = namy
    // const python = spawn ('python3', ['script.py']); //executer le script python
    const python = spawn ('python3', ['python/app.py' , empFromDb , 'images/'+empName]);


    // recuperer les donnees du script

    python.stdout.on ('data', function(data) {
        dataToSend = data.toString();
        if (dataToSend.localeCompare("match")==1){
            console.log(dataToSend.localeCompare("match"))

            // redirections 

            // vers la photo

            res.writeHead(200, {"Content-Type": "image/jpg"});
            res.end(photo);

            // vers un lien url
            
            // res.writeHead (301, {
            //     Location: `http://localhost/moodle-latest-401/moodle/`
            // }).end();
        

        }
           else {
            console.log(dataToSend.localeCompare("match"))

            res.render("upload")
           }
        console.log ('La sortie du script python ... ' + dataToSend);

    });
    
    python.stderr.on('data', function(data) {
        dataToSend = data.toString();
        console.error('Une erreur est survenue lors de l execution du script : ' + dataToSend);
    });
    
    // fermer le processus 
    var rend ;
    python.on('close', function(code) {
        
        console.log (`le processus est ferme avec le code ${code}`)
        
    });
    
    //envoyer les donnees au navigateur 

    // res.send(dataToSend);
   
});


app.listen(3001);
console.log("3001 is the port"); 
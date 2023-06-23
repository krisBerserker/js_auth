const express = require ("express");
const app = express();
const path = require ('path');
const multer = require('multer')
const mysql = require('mysql');

const {spawn} = require('child_process'); 

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// MULTER
let testName ;
const storage = multer.diskStorage({
    destination : (req, file, cb )=> {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        console.log(file)
        testName = Date.now() + path.extname(file.originalname);
        console.log(testName);
        cb(null, testName);
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

    const mle = req.body.mle;
    const nom = req.body.nom;
    console.log ("le nom : " + nom);
    console.log ("le mle : " + mle);

    res.writeHead (301, {
        Location: `http://localhost/moodle-latest-401/moodle/`
    }).end();


    // const python = spawn ('python3', ['script.py']); //executer le script python
    // const python = spawn ('python3', ['python/app.py' , 'python/database/'+ mle +'.jpg' , 'images/'+testName]);


    // recuperer les donnees du script

    // python.stdout.on ('data', function(data) {
    //     dataToSend = data.toString();
    //     if (dataToSend.localeCompare("match")==1){
    //         console.log(dataToSend.localeCompare("match"))
    //         res.render("hello")
    //        }
    //        else {
    //         console.log(dataToSend.localeCompare("match"))

    //         res.render("upload")
    //        }
    //     console.log ('La sortie du script python ... ' + dataToSend);

    // });
    
    // python.stderr.on('data', function(data) {
    //     dataToSend = data.toString();
    //     console.error('Une erreur est survenue lors de l execution du script : ' + dataToSend);
    // });
    
    // // fermer le processus 
    // var rend ;
    // python.on('close', function(code) {
        
    //     console.log (`le processus est ferme avec le code ${code}`)
        
    // });
    
    // //envoyer les donnees au navigateur 

    // // res.send(dataToSend);
   
});


app.listen(3001);
console.log("3001 is the port"); 
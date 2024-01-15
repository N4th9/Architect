const express = require('express')
const sqlite3 = require('sqlite3');
const multer = require ('multer')

const app = express()
app.use(express.static("public"))
app.listen(3500, () => console.log("Server ready !"))

const upload = multer({ dest:"uploads/"});
app.use("/uploads", express.static('uploads'))

//*******line to update my db************
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//*********************************Check if database ok************************
const db = new sqlite3.Database('./ARCHITECT.db', (err) => {
    if(err){
        console.log("Cannot open database")
        console.log(err.message)
        throw err;
    }else{
        console.log("database open")
        console.log("http://localhost:3500")
    }
})
//**************************Display all projects*******************************
app.get("/api/Projets", (req, res)=>{
    db.all("SELECT * FROM Projets WHERE Supprime = 0;", (err, row)=>{
        res.send(row)
    })
})
//**************************INSERT NEW PROJECT*********************************
app.post("/api/Projet", (req, res) => {
    db.run("INSERT INTO Projets (Nom, Description, Supprime) values ('Nouveau projet','Description', 0);", function (err){
        res.send()
    })
})
//**************************INSERT NEW PIECE*********************************
app.post("/api/Piece/:id/piece", (req, res) => {
db.run("INSERT INTO Pieces (IdProjet, Nom, Description) values(?,'Nouvelle pièce','Description');",[req.params.id],function (err){
        if (err){
        }
        res.json({message : "Is fully added"})
    })
})
//***************************UPDATE NAME OF PROJECT***************************
app.put("/api/UpdateProjet/:id", (req, res)=>{
    db.run("UPDATE Projets SET Nom = ?, Description = ? WHERE ID = ?;",[req.body.name,req.body.description,req.params.id], (err)=>{
        if(err){
        }
        else {
            res.send(req.body)
        }
    } )
})
//***************************UPDATE NAME OF PIECE***************************
app.put("/api/UpdatePiece/:id", (req, res)=>{
    db.run("UPDATE Pieces SET Nom = ?, Description = ? WHERE ID = ?;",[req.body.Piecename,req.body.Piecedescription,req.params.id],(err)=>{
        if(err){
        }
        else {
            res.send(req.body)
        }
    })
})
//***************************DELETE A PROJECT********************************
app.delete("/api/DeleteProject/:id",(req,res)=>{
    db.run("DELETE FROM Projets WHERE ID = "+ req.params.id +";", (err)=> {
        if(err){
        }
        else {
            res.json("[PROJET EFFACE]")
        }
    })
})
//***************************DELETE A PIECE********************************
app.delete("/api/DeletePiece/:id",(req,res)=>{
    db.run("DELETE FROM Pieces WHERE ID = "+ req.params.id +";", (err)=> {
        if(err){
        }
        else {
            res.json("[PIECE EFFACE]")
        }
    })
})
//**************************UPLOAD PICTURES TO FOLDER UPLOADS******************
app.post('/uploads_img/:id', upload.single('file'), uploadpictures)
    function uploadpictures(req, res){
        console.log(req.file)
        db.run("INSERT INTO Images (Nom, PieceID) values(?, ?);",[req.file.filename,req.params.id],(err)=>{
            if(err){
            }
            else {
                res.send({message : "Is fully added"})
            }
        })
    }
//**************************SEND PICTURES TO NAVIGATOR***********************
app.get('/uploads/:id',(req,res)=>{
    db.all("SELECT Images.ID,Images.Nom FROM Images JOIN Pieces ON Pieces.ID = Images.PieceID WHERE Pieces.ID = ?",[req.params.id],(err,row)=>{
        if (err) {
        } else {
            res.send(row);
        }
    })
})
//**************************UPLOAD PLANS TO FOLDER UPLOADS******************
app.post('/uploads_plans/:id', upload.single('fileplan'), uploadplans)
    function uploadplans(req, res){
        console.log(req.file)
        db.run("INSERT INTO Plans (Nom, PieceIDPlan) values(?, ?);",[req.file.filename,req.params.id],(err)=>{
            if(err){
            }
            else {
                res.send({message : "Is fully added"})
            }
        })
}
//**************************SEND PLANS TO NAVIGATOR***********************
app.get('/uploads_SendPlan/:id',(req,res)=>{
    db.all("SELECT Plans.ID,Plans.Nom FROM Plans JOIN Pieces ON Pieces.ID = Plans.PieceIDPlan WHERE Pieces.ID = ?",[req.params.id],(err,row)=>{
        if(err){
        }
        else {
            res.send(row)
        }
    })

})
//******************Tous les plans*************************
app.get('/uploads_AllPlan/:id', async (req, res) => {
    db.all("SELECT Plans.ID,Plans.Nom,Pieces.Nom as PieceNom FROM Plans JOIN Pieces ON PieceIDPlan = Pieces.ID WHERE IdProjet = ?;",[req.params.id],(err,row)=>{
        if(err){
            return console.log(err.message)
        }
        else {
            console.log("plan bien envoyer")
            res.send(row)
        }
    })
});
//*****************Project in archives***********************
app.put("/api/ArchiveProject/:id",(req,res)=>{
    db.run("UPDATE Projets SET Supprime = 1 WHERE ID = ?;",[req.params.id],(err)=>{
        if(err){
            return console.log(err.message)
        }
        else {
            res.send(req.body)
            console.log("[Projet archivé]")
        }
    })
})
app.get("/api/ProjetsArchives", (req, res)=>{
    db.all("SELECT * FROM Projets WHERE Supprime = 1;", (err, row)=>{
        if (err){
            return console.log(err.message)
        }else{
            console.log(row)
            res.send(row)
        }
    })
})
app.put("/api/UnArchiveProject/:id",(req,res)=>{
    db.run("UPDATE Projets SET Supprime = 0 WHERE ID = ?;",[req.params.id],(err)=>{
        if(err){
            return console.log(err.message)
        }
        else {
            res.send(req.body)
            console.log("[Projet désarchivé]")
        }
    })
})
//**************************SEND DATA TO NAVIGATOR AT LOCALHOST:3500/api/Projects*********************
app.get("/api/Projets", (req, res)=>{
    db.all("SELECT * FROM Projets;", (err, row)=>{
        if (err){
            return console.log(err.message)
        }else{
            console.log(row)
            res.send(row)
        }
    })
})
app.get("/api/PiecesOfProjets/:id", (req, res) => {
    db.all("SELECT Pieces.ID,IdProjet,Pieces.Nom,Pieces.Description FROM Pieces JOIN Projets ON Projets.ID = IdProjet WHERE IdProjet = ? ;",[req.params.id], (err,rowPiece)=> {
        if(err){
            return console.log(err.message)
        }
        else{
            console.log(rowPiece)
            res.send(rowPiece)
        }
    })
})
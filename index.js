const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));

const fileDir = path.join(__dirname, "files");
if(!fs.existsSync(fileDir)){
    fs.mkdirSync(fileDir);
};

app.get("/", (req, res) => {
    fs.readdir(fileDir, (err, files) => {
        if(err){
            console.error(err);
            return;
        };
        res.render("index", {files: files});
    });
});

app.get("/files/:filename", (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, data) => {
        if(err){
            console.error(err);
            return;
        }
        res.render("info", {fileName: req.params.filename, fileData: data})
    })
});

app.get("/edit/:filename", (req, res) => {
    res.render("edit", {oldName: req.params.filename})
});

app.post("/create", (req, res) => { 
    const fileName = req.body.title.split(" ").join("") + ".txt";
    const filePath = path.join(fileDir, fileName);

    fs.writeFile(filePath, req.body.details, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`${fileName} created at ${fileDir}`);
        res.redirect("/");
    });
});

app.post("/edit", (req, res) => {
    fs.rename(`${fileDir}/${req.body.oldName}`, `${fileDir}/${req.body.newName}`, (err) => {
        console.log(req.body)
        if (err){
            console.error(err);
            return;
        };
        console.log("File renamed");
        res.redirect("/");
    });
});

app.listen(3001, () => {
    console.log("Server listening...");
});
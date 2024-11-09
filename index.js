const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
const { randomFill } = require("crypto");

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
            console.log(err);
            return;
        };
        res.render("index", {files: files});
    });
});

app.post("/create", (req, res) => {
    const fileName = req.body.title.split(" ").join("") + ".txt";
    const filePath = path.join(fileDir, fileName);

    fs.writeFile(filePath, req.body.details, (err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(`${fileName} created at ${fileDir}`);
        res.redirect("/");
    });
});

app.listen(3001, () => {
    console.log("Server listening...");
});
import express from "express";
import axios from "axios";
import fs, { read } from "fs";
import rsp from "fs/promises";
import bodyParser from "body-parser";
import { takeCoverage } from "v8";

const app = express();
const port = 3000;
/* 'F:\fullstack\Web Development Projects\Capstone3_Blog' */

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.post("/",(req,res)=>{
    res.redirect("/");
});

let date_today = new Date().getDate() + '-' + new Date().getMonth() + 1 + '-' + new Date().getFullYear() + ' T ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(); 
console.log(date_today);

app.get("/", (req,res) => {
    let title = "", title_values="", c=0;
    if (fs.readdirSync('files').length != 0) {
      
            fs.readdirSync('files').forEach(files => {
            /* console.log(files); */
            const files_data = 'files/' + files;
            /* console.log(files_data); */
            let readFolderData = JSON.parse(fs.readFileSync(files_data, 'utf-8'));
            /* console.log(readFolderData); */
            let data_title =  readFolderData.blogtitle.toString();
            let data_content = readFolderData.blogcontent;
            let data_date = readFolderData.blogdate;
            title_values= title.concat(' ,',data_title);
            c += 1
            title = title_values;
                })   
            
        console.log(title_values.split(','));  
    }
    res.render("index.ejs",{Title : title_values.split(','), length :c})  
});

app.post("/createBlog" , (req,res) => {
    /* let date_today = new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear(); /* + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(); */ 
    res.render("create.ejs",{
        date: date_today
    });
});

app.post("/saveBlog", (req,res) => 
    {
    const title= req.body.blogtitle + '.json';
    if (fs.existsSync('files/' + title.trim() + '.json')){
        console.log("Already present");
    }
    /* 
    const title= req.body.blogtitle + '.json'; */
    fs.writeFile(`files/${title}`,JSON.stringify(req.body),(err) => {});
    res.redirect("/"); 
})

app.post("/showBlog",(req,res)=>{
    var tt = req.body.title.trim();
    var filepath = 'files/' + tt + '.json';
    let blogData = JSON.parse(fs.readFileSync(filepath));
    console.log(blogData.blogtitle, blogData.blogcontent,date_today )
    res.render("update.ejs", {title: blogData.blogtitle, content: blogData.blogcontent, date: date_today});
} )

app.post("/deleteBlog", (req,res) => {
    var file_path_delete = 'files/' + req.body.blogtitle.trim()+'.json';
    fs.unlink(file_path_delete,(err) =>{
        if (err) throw err;
        else console.log('File Deleted');
    });
    res.redirect("/");
});

app.listen(port, ()=> {
    console.log(`Server running on port ${port}`);
})

/* content : tc, date : td */
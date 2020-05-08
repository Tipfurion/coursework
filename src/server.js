
    const express = require("express");
    const bodyParser = require("body-parser");
    const fs = require("fs");
    const app = express();
    const jsonParser = bodyParser.json();
    const mysql = require("mysql2");
  
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "sclad",
      //database: "sakila",
      password: "ss32281488"
    });
module.exports =  {
createServer:function(port) {
    connection.connect(function(err){
        if (err) {
          return console.error("Ошибка: " + err.message);
        }
        else{
          console.log("Подключение к серверу MySQL успешно установлено");
        }
     });
    
    app.use(express.static(__dirname + "/public"));
    app.get("/api/getTables", function(req,res){
      connection.query("SELECT DATABASE()",function(err, results){    
        if(err){
          console.log(err)
        }
        console.log(results)
      });
      connection.query("SHOW TABLES",
      function(err, results) {
        if(err){
          console.log(err)
        }         
        res.send(results)
    });

    });
    app.get("/api/getTable/:table", function(req, res){
      let table = req.params.table
      //connection.query("SELECT * FROM "+"`"+table+"`",
      connection.query("SELECT * FROM "+table,
      function(err, results) {
        if(err){
          console.log(err)
        }       
        res.send(results)
    });
    
    });
    app.post("/api/addData",jsonParser, function(req, res){
      console.log(req.body)
      connection.query("INSERT INTO "+req.body.table +" SET ?", req.body.data, function(error) {
        if (error) {
          console.log(error.message);
          res.statusCode=500
          res.send(error)            
        } 
        else {
          res.statusCode=200
          console.log('success');   
          res.send(['ok']) 
        }
      });
    });

    app.delete("/api/deleteData",jsonParser, function(req, res){
      console.log(req.body)
      let table = req.body.table;
      let str='';
      for(let i=0;i<req.body.headers.length;i++){
        str+=`${req.body.headers[i]}="${req.body.items[i]}" `
        if(i<req.body.headers.length-1){
          str+='AND '
        }
      }
      console.log(`DELETE FROM ${table} WHERE ${str}`);   
      connection.query(`DELETE FROM ${table} WHERE ${str}`, function(error) {
        if (error) {
            console.log(error.message);
            res.statusCode=500
            res.send(error)
        } 
        else {
            console.log('success');   
            res.statusCode=200
            res.send(['ok'])
        }
      
      });      
    });    
    app.put("/api/editData",jsonParser, function(req, res){
      console.log(req.body)
      let table = req.body.table;
      let whereStr='';
      let setStr='';
      for(let i=0;i<req.body.headers.length;i++){
        whereStr+=`${req.body.headers[i]}="${req.body.items[i]}" `
        setStr+=`${req.body.headers[i]}="${req.body.data[i]}" `
        if(i<req.body.headers.length-1){
          whereStr+='AND '
          setStr+=', '
        }
      }

      console.log(`UPDATE ${table} SET WHERE ${setStr}`);   
      connection.query(`UPDATE ${table} SET ${setStr} WHERE ${whereStr}`, function(error) {
        if (error) {
            console.log(error.message);
            res.statusCode=500
            res.send(error)
        } 
        else {
            console.log('success');   
            res.statusCode=200
            res.send(['ok'])
        }
      
      });      
    });        
    app.listen(port, function(){
        console.log("Сервер ожидает подключения...");
        });
    
},
  closeConnection:function() {
        connection.end(function(err) {
            if (err) {
              return console.log("Ошибка: " + err.message);
            }
            console.log("Подключение закрыто");
          });        
  },
  test:function() {
    console.log('test')
  }
}




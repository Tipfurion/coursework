
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const jsonParser = bodyParser.json();
const mysql = require("mysql2");
let dbDefaultSettings = require("./dbConfig.js")
console.log(dbDefaultSettings);

let connection = mysql.createConnection(dbDefaultSettings);
function closeConnection(){
  connection.end(function(err) {
    if (err) {
      return console.log("Ошибка: " + err.message);
    }
    console.log("Подключение закрыто");
  });     
}
module.exports = {
createServer:function(port) {
    connection.connect(function(err){
        if (err) {
          return console.error("Ошибка: " + err.message);
          //throw new error("ERROR_ERROR_ERROR_ERROR")
        }
        else{
          console.log("Подключение к серверу MySQL успешно установлено");
        }
     });
    // 
    //Uncomment next line to use web version
    //app.use(express.static(__dirname + "/public"));
    //
    app.put("/api/changeSettings",jsonParser, function(req, res){
      let settings = req.body;
      closeConnection()
      connection = mysql.createConnection(settings)
      console.log(settings);
      
      connection.connect(function(err){
        if (err) {
          return console.error("Ошибка: " + err.message);
        }
        else{
          console.log("Подключение к серверу MySQL успешно установлено");
        }
     });
     connection.on('error', function(err) {
      console.log("I'm dead");
      closeConnection()
      connection = mysql.createConnection(dbDefaultSettings)
      connection.connect(function(err){
        if (err) {
          return console.error("Ошибка: " + err.message);
        }
        else{
          console.log("Подключение к серверу MySQL успешно установлено");
        }
     });
    })
     res.send(['ok'])
    });   

    app.get("/api/getTables", function(req,res){
      connection.query("SELECT DATABASE()",function(err, results){    
        if(err){
          console.log('GET_TABLES');          
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
      connection.query("SELECT * FROM "+table,
      function(err, results) {
        if(err){
          console.log(err)
        }
        if(results.length===0){
          let database = connection.config.database
          connection.query(`SHOW COLUMNS FROM ${database}.${table}`,(err, results)=>{
            if(err){
              console.log(err)
            }
            res.send(results)         
          })
        }
        else{
          res.send(results)
        }
        
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
  closeConnection:closeConnection
}




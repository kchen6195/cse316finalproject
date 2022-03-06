var mysql = require("mysql");
var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "covid"
});

const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const url = require('url');

app.use(bodyParser.urlencoded({ extended: true }));


var labuser = 0;

app.get("/emp",(req,res) => {
    emplogin(req,res);
});

app.post("/empauth",(req,res) => {
    empauth(req,res);
});



app.get("/lab",(req,res) => {
    lablogin(req,res);
});

app.post("/labauth",(req,res) => {
    labauth(req,res);
});

app.get("/labauth",(req,res) => {
    labauthDefault(req,res);
});

app.get("/test",(req,res) => {
    testDefault(req,res);
});

app.post("/test",(req,res) => {
    test(req,res);
});

app.get("/pool",(req,res) => {
    poolDefault(req,res);
});

app.post("/pool",(req,res) => {
    pool(req,res);
});

app.get("/well",(req,res) => {
    wellDefault(req,res);
});

app.post("/well",(req,res) => {
    well(req,res);
});

port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("server started!");
});

function emplogin(req,res){
    res.writeHead(200,{"Content-Type": "text/html"});
    let html = `
<!DOCTYPE html>
<html lang="en">

<head>
    <title> Employee Login Page </title>
</head>

<body>
<h1> Employee Login Page </h1><br>

<form action="/empauth" method= "POST">
  <label for="id">Employee ID:</label><br>
  <input type="text" id="id" name="id"><br>
  <label for="pass">password:</label><br>
  <input type="password" id="pass" name="pass"><br><br>
  <input type="submit" value="Submit">
</form> 

</body>
</html>
`

res.write(html);
res.end();
}

function empauth(req,res)
{

    sql = " select * from employee where employeeID = " + req.body.id + " and passcode = "+ req.body.pass;

    con.query(sql, function(err,result){
        if (err) throw err;
        //console.log(result)
        if(result.length > 0)
        {
            
            res.writeHead(200,{"Content-Type": "text/html"});
            let html = `
            <!DOCTYPE html>
        <html lang="en">

        <style type = text/css>
table, tr, th, td {
    border: 1px solid black;
    height: 50px;
    vertical-align: bottom;
    padding: 15px;
    text-align: left;
}
</style>

        
        <head>
            <title> Employee Home </title>
        </head>
        
        <body>
        <h1> Employee Home </h1><br>
        <table>
        <tr>
            <td> Collection Date </td>
            <td> Result </td>
        <tr>
        `

        sql3 = `select testBarcode from EmployeeTest where employeeID = "`+ req.body.id+ `"`;
            con.query(sql3, function(err3,result3){
                if (err3) throw err3;

                if(result3.length > 0)
                {
                    sql4 = `select poolBarcode from poolmap where testBarcode = "`
                
                    let i = 0
                    for(let y of result3)
                    {
                        sql4+= y.testBarcode + `" `;
                        i++; 
    
                        if(i != result3.length)
                        {
                            sql4 += `or testBarcode = "`
                        }
                    }
                    
                    con.query(sql4, function(err4,result4){
                        if (err4) throw err4;
    
    
    
                        //select * from welltesting where poolBarcode = 
                        sql2 = `select * from welltesting where poolBarcode =  "`
                    
                            let i = 0
                            for(let k of result4)
                            {
                                sql2+= k.poolBarcode + `" `;
                                i++; 
    
                                if(i != result4.length)
                                {
                                    sql2 += `or poolBarcode = "`
                                }
                            }
                        
    
                        con.query(sql2, function(err2,result2){
                            if (err2) throw err2;
                            
                            for(let x of result2)
                            {
                                html += `<tr>` +
                                `<td>` + x.testingStartTime + `</td>`+
                                `<td>` + x.result + `</td>`+
                                `</tr>`     
                            }
    
                            html +=` </table> </body>
                            </html>`
                                res.write(html);
                                res.end();
    
                        });
    
    
    
                    });  
                }
                else
                {
                    html +=` </table> </body>
                            </html>`
                                res.write(html);
                                res.end();
                }
                
                });

        }
        else
        {
            res.writeHead(200,{"Content-Type": "text/html"});
            let html = `
            <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <title> Employee Login Page </title>
        </head>
        
        <body>
        <p> Wrong login info</p>

        <a href= "/emp"> BACK </a>
        
        </body>
        </html>`
            res.write(html);
            res.end();
        }
    });
   

}

function lablogin(req,res){
    res.writeHead(200,{"Content-Type": "text/html"});
    let html = `
<!DOCTYPE html>
<html lang="en">

<head>
    <title> Lab Login Page </title>
</head>

<body>
<h1> Lab Login Page </h1><br>

<form action="/labauth" method= "POST">
  <label for="id">Lab ID:</label><br>
  <input type="text" id="id" name="id"><br>
  <label for="pass">password:</label><br>
  <input type="password" id="pass" name="pass"><br><br>
  <input type="submit" value="Submit">
</form> 

</body>
</html>
`

res.write(html);
res.end();
}


function labauth(req,res)
{

    sql = " select * from labemployee where labID = " + req.body.id + " and passwrd = "+ req.body.pass;

    con.query(sql, function(err,result){
        if (err) throw err;
        //console.log(result)
        if(result.length > 0)
        {
            labuser = req.body.id;
            res.writeHead(200,{"Content-Type": "text/html"});
            let html = `
            <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <title> Lab Home </title>
        </head>
        
        <body>
        <h1> Lab Home </h1><br>

        <a href= "/test">
        <div> Test Collection </div>
        </a>

        <a href= "/pool">
        <div> Pool Mapping </div>
        </a>

        <a href= "/well">
        <div> Well Testing </div>
        </a>
        
        </body>
        </html>`
            res.write(html);
            res.end();

        }
        else
        {
            res.writeHead(200,{"Content-Type": "text/html"});
            let html = `
            <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <title> Lab Login Page </title>
        </head>
        
        <body>
        <p> Wrong login info</p>

        <a href= "/lab"> BACK </a>
        
        </body>
        </html>`
            res.write(html);
            res.end();
        }
    });
   

}

function labauthDefault(req,res)
{
    res.writeHead(200,{"Content-Type": "text/html"});
    let html = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <title> Lab Home </title>
</head>

<body>
<h1> Lab Home </h1><br>

<a href= "/test">
<div> Test Collection </div>
</a>

<a href= "/pool">
<div> Pool Mapping </div>
</a>

<a href= "/well">
<div> Well Testing </div>
</a>

</body>
</html>`
    res.write(html);
    res.end();
}

function test(req,res)
{
    
    if(req.body.type == "add")
    {

        

        var d = new Date();
        

        sql = ` INSERT INTO EmployeeTest VALUES("` + req.body.bar + `","` + req.body.id + `","`
         + d.getFullYear() +"-" + (parseInt(d.getMonth()) + 1).toString() + "-"+ d.getDate() +`","` + labuser + `")`;

         con.query(sql, function(err,result){
            if (err) {console.log(err)};
        })

     

    }
    if(req.body.type == "delete")
    {
        
        sql = ` DELETE FROM EmployeeTest where testBarcode = "` + req.body.bar +`" ` ;

        con.query(sql, function(err,result){
            if (err) {console.log(err)};
        })

       


    }
    
    testDefault(req,res);
    

    

}

function testDefault(req,res)
{

    res.writeHead(200,{"Content-Type": "text/html"});
    let html = `
    <!DOCTYPE html>
<html lang="en">

<style type = text/css>
table, tr, th, td {
    border: 1px solid black;
    height: 50px;
    vertical-align: bottom;
    padding: 15px;
    text-align: left;
}
</style>

<head>
    <title> Test Collection </title>
</head>

<body>
<h1> Test Collection </h1><br>


<form action="/test" method = "POST">
  <label for="id">Employee ID:</label>
  <input type="text" id="id" name="id"><br>
  <label for="bar">Test Barcode:</label>
  <input type="text" id="bar" name="bar"><br><br>
  <input type ="hidden" name="type" value="add">
  <input type="submit" value="Submit">
</form> 
<br>
<table>
    <tr>
        <th> Employee ID </th>
        <th> Test Barcode </th>
        <th> Delete </th>
    <tr>
`
    // make table with button
    sql = " select * from employeeTest "

    con.query(sql, function(err,result){
        if (err) throw err;
        //console.log(result)
        for(let x of result)
        {
            //console.log(html);
            html += 
            `<tr>` +
            `<td> `+ x.employeeID + ` </td>` +
            `<td> `+ x.testBarcode + ` </td>` +
            `<td> 
            <form action "/test" method = "POST">
            <input type ="hidden" name="bar" value="` + x.testBarcode + `">
            <input type ="hidden" name="type" value="delete">
            <input type ="submit" value="Delete"> </form>
            </td>`
            + `</tr>`

            //console.log(html);
        }

        
        html += "</table> ";
        html += `<a href= "/labauth"> BACK </a>`;
        res.write(html + "\n\n</body>\n</html>");
        res.end();
    });

    
}

function pool(req,res)
{
    if(req.body.type == "add")
    {
        sql = ` INSERT INTO pool VALUES("` + req.body.pool + `")`;

         con.query(sql, function(err,result){
            if (err) {console.log(err)};
        })

        let hold = req.body.test.split(" ");

        for(let x of hold)
        {
            sql = ` INSERT INTO poolmap VALUES("` + x + `","` + req.body.pool + `")`;

         con.query(sql, function(err,result){
            if (err) {console.log(err)};
        })
        }
    }
    if(req.body.type == "edit")
    {
        
        sql = ` DELETE FROM poolmap where poolBarcode="` + req.body.pool + `"`;

         con.query(sql, function(err,result){
            if (err) {console.log(err)}
         });

        let hold = req.body.test.split(" ");

        for(let x of hold)
        {
            sql = ` INSERT INTO poolmap VALUES("` + x + `","` + req.body.pool + `")`;

         con.query(sql, function(err,result){
            if (err) {console.log(err)};
        })
        } 
        
    }
    if(req.body.type == "delete")
    {


        sql = ` DELETE FROM poolmap where poolBarcode="` + req.body.radio1 + `"`;

         con.query(sql, function(err,result){
            if (err) {console.log(err)}
         });

        sql = ` DELETE FROM pool where poolBarcode="` +  req.body.pool + `"`;

         con.query(sql, function(err,result){
            if (err) {console.log(err)};
        })
    }

    poolDefault(req,res);

}

function poolDefault(req,res)
{
    res.writeHead(200,{"Content-Type": "text/html"});
    let html = `
    <!DOCTYPE html>
<html lang="en">

<style type = text/css>
table, tr, th, td {
    border: 1px solid black;
    height: 50px;
    vertical-align: bottom;
    padding: 15px;
    text-align: left;
}
</style>

<head>
    <title> Pool Mapping </title>
</head>

<body>
<h1> Pool Mapping </h1><br>


<form action="/pool" method = "POST">
  <label for="pool">Pool Barcode:</label>
  <input type="text" id="pool" name="pool"><br>
  <label for="test">Test Barcode:</label>
  <input type="text" id="test" name="test"><br><br>
  <input type="submit" name="type" value="add">
  <input type="submit" name="type" value="edit" />
</form> 
<br>
<table>
    <tr>
        <th> Pool Barcode</th>
        <th> Test Barcode </th>
    </tr>
    <form action="/pool" method = "POST">
`
    // make table with button
    sql = " select * from poolMap "

    con.query(sql, function(err,result){
        if (err) throw err;
        //console.log(result)

        let hold = [];
        

        let count = [];

        for(let x of result)
        {
            if(count.indexOf(x.poolBarcode) == -1)
            {
                count.push(x.poolBarcode);
                hold.push([]);
            }
        }

        for(let x of result)
        {
            hold[count.indexOf(x.poolBarcode)].push(x.testBarcode);
        }

        for(let x of count)
        {

            html += `<tr>` +
            `<td>
            <label>
            <input type="radio" id="` + x+`" value ="`+ x + `" name = "radio1" >`
            + x + `</label>
            
             </td>

             <td>
            <label for ="` + x +`">`;

            for(y of hold[count.indexOf(x)])
            {
                html += y + " ";
            }

            html +=       `</ label>
            </td>`
            
        }
        //console.log(html);

        html += `
        <input type="submit" name="type" value="delete" />`

        html += "</form> </tr> </table> ";
        html += ""
        html += `<a href= "/labauth"> BACK </a>`;
        res.write(html + "\n\n</body>\n</html>");
        res.end();
    });
}


function well(req,res)
{
    //edit add delete
    if(req.body.type == "add")
    {
        sql = ` INSERT INTO well VALUES("`  + req.body.well + `")`;

         con.query(sql, function(err,result){
            if (err) {console.log(err)};
        })

        var d = new Date();

        if(req.body.prog =="in progress")
        {
            sql = ` INSERT INTO WellTesting VALUES("` + req.body.pool + `","` + req.body.well + `","`  
        + d.getFullYear() +"-" + (parseInt(d.getMonth()) + 1).toString() + "-"+ d.getDate() +`",` + "null" + `,"` +  req.body.prog + `")`;
        }
        else
        {
            sql = ` INSERT INTO WellTesting VALUES("` + req.body.pool + `","` + req.body.well + `","`  
            + d.getFullYear() +"-" + (parseInt(d.getMonth()) + 1).toString() + "-"+ d.getDate() +`","` + d.getFullYear() +"-" + (parseInt(d.getMonth()) + 1).toString() + "-"+ d.getDate() 
            + `","` +  req.body.prog + `")`;
        }
        
         con.query(sql, function(err,result){
            if (err) {console.log(err)};
        })
        
    }
    if(req.body.type == "edit")
    {
        var d = new Date();
        sql = ` update welltesting set testingEndtime = "` + d.getFullYear() +"-" + (parseInt(d.getMonth()) + 1).toString() + "-"+ d.getDate() +`", result ="`  
        +  req.body.prog + `" where wellbarcode = "` + req.body.well +`"` ;

         con.query(sql, function(err,result){
            if (err) {console.log(err)};
        })
         
        
    }
    if(req.body.type == "delete")
    {


        sql = ` DELETE FROM welltesting where wellBarcode="` + req.body.radio1 + `"`;

         con.query(sql, function(err,result){
            if (err) {console.log(err)}
         });

        

        sql = ` DELETE FROM well where wellBarcode="` +  req.body.radio1 + `"`;

         con.query(sql, function(err,result){
            if (err) {console.log(err)};
        })
    }

    wellDefault(req,res);

}

function wellDefault(req,res)
{
    res.writeHead(200,{"Content-Type": "text/html"});
    let html = `
    <!DOCTYPE html>
<html lang="en">

<style type = text/css>
table, tr, th, td {
    border: 1px solid black;
    height: 50px;
    vertical-align: bottom;
    padding: 15px;
    text-align: left;
}
</style>

<head>
    <title> Well Testing </title>
</head>

<body>
<h1> Well Testing </h1><br>


<form action="/well" method = "POST">
  <label for="well">Well Barcode:</label>
  <input type="text" id="well" name="well"><br>
  <label for="Pool">Pool Barcode:</label>
  <input type="text" id="pool" name="pool"><br>
  <select name="prog" id="prog">
  <option value ="in progress"> in progress </option>
  <option value ="negative"> negative </option>
  <option value ="positive"> positive </option>
  </select>
  <br>

  <input type="submit" name="type" value="add">
  <input type="submit" name="type" value="edit" />
</form> 
<br>
<table>
    <tr>
        <th> Well Barcode</th>
        <th> Pool Barcode </th>
        <th> Result </th>
    </tr>
    <form action="/well" method = "POST">
`
    // make table with button
    sql = " select * from WellTesting "

    con.query(sql, function(err,result){
        if (err) throw err;
        //console.log(result)


        for(let x of result)
        {

            html += `<tr>` +
            `<td>
            <label>
            <input type="radio" id="` + x.wellBarcode +`" value ="`+ x.wellBarcode + `" name = "radio1" >`
            + x.wellBarcode + `</label>
            
             </td>

             <td>
            <label for ="` + x.poolBarcode +`">`
            + x.poolBarcode + 
            `</ label>
            </td>

            <td>
            <label for ="` + x.result +`">`
            + x.result + 
            `</ label>
            </td>`
            
        }
        //console.log(html);

        html += `
        <input type="submit" name="type" value="delete" />`

        html += "</form> </tr> </table> ";
        html += ""
        html += `<a href= "/labauth"> BACK </a>`;
        res.write(html + "\n\n</body>\n</html>");
        res.end();
    });
}
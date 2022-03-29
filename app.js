
var express=require("express")
var app=express()
var mongodb=require('mongodb');
app.set("view engine","pug")
//app.set('views','./views')

var bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/unicorndata',function(req,res){
var MongoClient=mongodb.MongoClient;
var connection=new MongoClient("mongodb://127.0.0.1:27017")
connection.connect(function(err,con){
 
    if(err)
    {
        console.log("connection err::",err)
    }
    else{
        var db=con.db('myintern');
        db.collection('unicorns').find().toArray(function(err,data){
            if(err){console.log("err::",err)}
            else{
           
            res.render("unicorn",{unidata:data});
            con.close()
        }
        })
    }
})
})
app.get('/unicornsort/:key',function(req,res){
    var name=req.params.key;
    var MongoClient=mongodb.MongoClient;
    var connection=new MongoClient("mongodb://127.0.0.1:27017")
    connection.connect(function(err,con){
     
        if(err)
        {
            console.log("connection err::",err)
        }
        else{
            var db=con.db('myintern');
            db.collection('unicorns').find().toArray(function(err,data){
                if(err){console.log("err::",err)}
                else{
                    data.sort(function(a,b)
                    {
                        return a[req.params.key]>b[req.params.key]?1:-1;
        
                    })
                res.render("unicorn",{unidata:data});
                con.close()
                }
            })
        }
    })



})

app.get('/unicorn/:key',function(req,res){
    var nme=req.params.key;

    console.log(nme);
    var MongoClient=mongodb.MongoClient;
    var connection=new MongoClient("mongodb://127.0.0.1:27017")
    connection.connect(function(err,con){
 
        if(err)
        {
            console.log("connection err::",err)
        }
        else{
            var db=con.db('myintern');
            db.collection('unicorns').deleteOne({name:nme},function(err,data){
                if(err)
                {
                    console.log("error::",err)
                }
                else{
                   // console.log(data);
                    con.close();
                    res.redirect('/unicorndata');
                }
            })
           
           
            // db.collection('unicorns').find().toArray(function(err,data){
            //     if(err){console.log("err::",err)}
            //     res.render("unicorn",{unidata:data});
            //     con.close()
            // })
        }
       
    })   

})
app.get("/unicornupdate/:key",function(req,res){
    var unicornname=req.params.key;

    var MongoClient=mongodb.MongoClient;
    var connection=new MongoClient("mongodb://127.0.0.1:27017")
    connection.connect(function(err,con){
 
        if(err)
        {
            console.log("connection err::",err)
        }
        else{
            var db=con.db('myintern');
            db.collection('unicorns').find().toArray(function(err,data){
                if(err)
                {
                    console.log("error::",err)
                }
                else{
                    
                    con.close();
                     res.render("updateunicorns",{unicorndata:data,uname:unicornname})
   
                 } })
            }

      })
})
app.post("/updateddata/:key",function(req,res){ 
    var unicornname=req.params.key;
    var MongoClient=mongodb.MongoClient;
    var connection=new MongoClient("mongodb://127.0.0.1:27017")
    var myloves=(req.body.loves).split(",")
    connection.connect(function(err,con){
        if(err)
        {
            console.log("error::",err)
        }
        else
        {
            var db=con.db('myintern');
            db.collection('unicorns').updateOne({name:unicornname},{$set:{name:req.body.name,dob:new Date(req.body.dob),loves:myloves,weight:req.body.weight,gender:req.body.gender,vampires:req.body.vv}},function(err,data){
                if(err)
                {
                    console.log("error::",err);
                }
                else{
                    con.close();
                    res.redirect('/unicorndata');
                }
            })


        }
    })
})

app.get("/addunicorn",function(req,res){
    res.render("addunicorn");
})
app.post("/adddata",function(req,res){

    var myloves=(req.body.loves).split(",")
    var MongoClient=mongodb.MongoClient;
    var connection=new MongoClient("mongodb://127.0.0.1:27017")
    connection.connect(function(err,con){
 
        if(err)
        {
            console.log("connection err::",err)
        }
        else{
            var db=con.db('myintern');
            db.collection('unicorns').insertOne({name:req.body.name,dob:new Date(req.body.dob),loves:myloves,weight:req.body.weight,gender:req.body.gender,vampires:req.body.vv},function(err,data){
                if(err)
                {
                    console.log("error::",err)
                }
                else
                {
                    con.close();
                    res.redirect('/unicorndata');
                }
            })
              
            }

      })

})

app.listen(3400,function(){console.log("server running on 3400..")})
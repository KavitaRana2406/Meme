const express=require('express');
const cors=require('cors'); 
const app=express();
/*const corsOptions={
     origin: '*',
     optionsSuccessStatus: 200,
}
app.use(cors(corsOptions));*/
// middleware
app.use(cors(),(req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-with,Content-Type,Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, PUT, OPTIONS"
    );
    next();
});


const monk=require('monk');
const Filter=require('bad-words');
require('dotenv').config();


const PORT = process.env.PORT || 3000;


const db=monk(process.env.MONGO_URI || 'localhost/meower');  
db.then(() =>{
    console.log("connection success");
  }).catch((e)=>{
    console.error("Error !",e);
  }); 
const mews=db.get('mews');
const filter=new Filter();



app.use(express.json());// json body parser

app.get('/',(req,res)=>{
    res.json({
        message:'hello Kavita here again and again !'
        });
    });
 
app.get('/mews', (req, res) => {
        mews
            .find()
            .then(mews => {
                res.json(mews);
            });
    });


    function isValidMew(mew){
        return mew.owner && mew.caption.toString().trim()!=='' && 
        mew.caption && mew.caption.toString().trim()!=='' && mew.umeme && mew.umeme.toString().trim()!=='';
    }
    
app.post('/mews',(req,res)=>{
    if(isValidMew(req.body)){
        //insert into db..
        const mew={
            owner: filter.clean(req.body.owner.toString()),
            caption:filter.clean(req.body.caption.toString()),
            umeme:req.body.umeme
            
        };
        
        mews
        .insert(mew)
        .then(createdMew=> {
            res.json(createdMew);
        });
    }
    else{
        res.status(422);
        res.json({
            message:'Hey ! All fields are required!'
        });
    }
    
});

app.listen(PORT,console.log(`Server is starting at ${PORT}`));
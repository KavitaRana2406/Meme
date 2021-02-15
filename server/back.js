const express=require('express');
const cors=require('cors'); // middleware
const monk=require('monk');
const Filter=require('bad-words');

const app=express();

const PORT = 3000;

const db=monk('mongodb+srv://Kavita:root@cluster0.65mfa.mongodb.net/memedb?retryWrites=true&w=majority' || 'localhost/meower');  
db.then(() =>{
    console.log("connection success");
  }).catch((e)=>{
    console.error("Error !",e);
  }); 
const mews=db.get('mews');
const filter=new Filter();


app.use(cors());
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
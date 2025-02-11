const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

// middleware


app.use(cors());
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zwdhs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// console.log(uri);


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const visaCollection =  client.db('visaDB').collection('visa');
    const applicationCollection = client.db('visaDB').collection('application')

    
    
    
    // for visa***********
    app.get('/visa', async(req,res)=>{
      const cursor = visaCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // for update
    app.get('/visa/:id',async(req,res)=>{
      const id=req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await visaCollection.findOne(query);
      res.send(result);
    })


    app.post('/visa', async(req,res)=>{
      const newVisa = req.body;
      console.log(newVisa);
      const result = await visaCollection.insertOne(newVisa);
      res.send(result);
    })

    app.put('/visa/:id',async(req,res) =>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const option = { upsert:true};
        const updatedVisa = req.body;
        const visa = {
          $set:{
            countryImage:updatedVisa.countryImage,
            countryName:updatedVisa.countryName,
            visaType:updatedVisa.visaType,
            processingTime:updatedVisa.processingTime,
            ageRestriction:updatedVisa.ageRestriction,
            fee:updatedVisa.fee,
            validity:updatedVisa.validity,
            applicationMethod:updatedVisa.applicationMethod,
            requireDocuments:updatedVisa.requireDocuments,
            description:updatedVisa.description
          }
        }
        const result = await visaCollection.updateOne(filter,visa,option)
        res.send(result);
    })

    app.delete('/visa/:id',async(req,res)=>{
      const id=req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await visaCollection.deleteOne(query);
      res.send(result);
    })

    // for application*************** 
    app.get('/application', async(req,res)=>{
      const cursor = applicationCollection.find()
      

      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/application', async(req,res)=>{
      const applicationInfo = req.body;
      console.log(applicationInfo);
      const result = await applicationCollection.insertOne(applicationInfo);
      res.send(result);
    })
    app.delete('/application/:id',async(req,res)=>{
        const id=req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await applicationCollection.deleteOne(query);
        res.send(result);
    })

 
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('coffee making server is running')
})

app.listen(port,()=>{
    console.log(`assing 10:${port}`);
})
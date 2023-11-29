const express = require('express')
const {MongoClient, ObjectId} = require('mongodb')
const PORT = 8700

const connectionString = "mongodb://127.0.0.1:27017"
const client = new MongoClient(connectionString)

const app = express()
 const jsonParser = express.json()


app.get('/api/products', async (req, res) => {
  
    
    const collection = req.app.locals.collection 

    try {
        const products = await collection.find({}).toArray()
        res.send(products)
    }
    catch(err) {
        console.log(err);
        res.sendStatus(500)
    }

})


app.post('/api/products', jsonParser, async (req, res) => {
    const collection = req.app.locals.collection 

    console.log(req.body)
    const product = {
        title: req.body.title,
        price: req.body.price
    }
    try {
        const result = await collection.insertOne(product)
        res.send(result)
    }
    catch(err) {
        console.log(err)
        res.sendStatus(500)
    }
})


app.get('/api/products/:id', async (req, res) => {
    const collection = req.app.locals.collection 


    try {
        const id = new ObjectId(req.params.id)
        const product = await collection.findOne({_id: id})
        if(product) res.send(product)
        else res.send(404)
    }
    catch(err) {
        console.log(err)
        res.sendStatus(500)
    }
})

app.put('/api/products/:id', jsonParser, async (req, res) => {
    const collection = req.app.locals.collection;

    const id = new ObjectId(req.params.id);
    const update = {
        $set: {
            title: req.body.title,
            price: req.body.price
        }
    };

    try {
        const result = await collection.updateOne({ _id: id }, update);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.delete('/api/products/:id', async (req, res) => {
    const collection = req.app.locals.collection;

    const id = new ObjectId(req.params.id);

    try {
        const result = await collection.deleteOne({ _id: id });
        res.send(result);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});






async function run() {

    try {
        await client.connect()
        console.log('Database Server is running...');
        
        app.locals.collection = client.db('productdb').collection('products')


        app.listen(PORT, () => {
            console.log(`Server is running on ${PORT}`);
        })
    }
    catch(err) {
        console.log(err);
    }

}
run()


process.on('SIGINT', async () => {
    await client.close()
    process.exit()
})

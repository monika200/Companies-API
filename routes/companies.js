const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const exp = express();
exp.use(express.json());

const mongoClient = mongodb.MongoClient;
const DB_URL = "mongodb+srv://MONIKA20:haachihaachi@cluster0.0saeo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"


router.get('/', async(req,res,next)=>{
        res.status(200).json({
            message: ' These are company details'
		})  
})

router.post('/', async (req, res) => {
	try {
		const client = await mongoClient.connect(DB_URL);
		const db = client.db('companies');
		console.log("DB connected Successfully");
		const data = {
			name: req.body.company_name,
            id : req.body.company_id,
			description:req.body.company_description,
			url_image:req.body.company_image_url,
			rating:req.body.avg_rating,
            latitude: req.body.latitude,
            longitude: req.body.longitude
		}
		const result = await db.collection('company').insertOne(data);

		console.log(result);
        res.status(200).json({
			message: "Data Inserted Successfully",
			result,
		});
		client.close();
	} catch (error) {
		console.log(error);
		res.json({ message: 'Something went wrong' });
	}
});


router.get('/companies_details', async (req, res) => {
	try {
		const client = await mongoClient.connect(DB_URL);
		const db = client.db('companies');
		const result = await db.collection('company').find().toArray();
		if (!result) {
			res.json({ message: 'null' });
		} else {
			res.json(result);
		}
		client.close();
	} catch (error) {
		console.log(error);
		res.json({ message: 'Something wend wrong' });
	}
});


router.get('/companies_details/:name', async (req, res) => {
	try {
		const client = await mongoClient.connect(DB_URL);
		const db = client.db('companies');
		const result = await db.collection('company').findOne({"name": {$regex:(req.params.name)}});
		if (!result) {
			res.json({ message: 'No Matching Company Found' });
		} else {
			res.json(result);
		}
		client.close();
	} catch (error) {
		console.log(error);
		res.json({ message: 'Something wend wrong' });
	}
});

module.exports = router;
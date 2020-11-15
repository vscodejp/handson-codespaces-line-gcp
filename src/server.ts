import { Storage } from '@google-cloud/storage';
import { Buffer } from "buffer";
import express from "express";
import { format } from 'util';
import bodyParser  from "body-parser";
import { getFilename } from './unit'
import path from 'path'

const app: express.Express = express()
const port = 8080;

app.use(bodyParser.json());
// LIFF
app.use(express.static('dist'))
app.get('/info', (req:express.Request, res:express.Response) => {
    res.json({id: process.env.MY_LIFF_ID});
});

// 
app.post('/save', (req:express.Request, res:express.Response) => {
    console.log(req.body);
    const storage = new Storage();
    const bucketName: string  = process.env.GCLOUD_STORAGE_BUCKET || ''
    const bucket = storage.bucket(bucketName);
    const base64 = req.body.image.split(',')[1];
    console.log("base64: " + base64)
    const imageBuffer = Buffer.from(base64,'base64');
    const file = bucket.file(getFilename());
    const stream = file.createWriteStream({
        metadata: {
	    contentType: 'image/jpeg'
	}
    });
    stream.on('error', (err) => {
	console.log(err);
    });
    stream.on('finish', () => {
	const publicUrl = format(
	  `https://storage.googleapis.com/${bucket.name}/${file.name}`
	);
	console.log("publicUrl: "+publicUrl);
	res.send(publicUrl);
    });
    stream.end(imageBuffer);
});

app.listen(port, () => console.log(`Server running on ${port}`));
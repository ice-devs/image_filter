import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { error } from 'console';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.

  app.get( "/filteredimage", async( req: Request, res: Response ) => {
    let { image_url } = req.query;

    let string_image_url:string = image_url

    //validates the image_url query
    if (!string_image_url){
      return res.status(400).send("Plese enter the image url")
    }

    const filteredpath:string = await filterImageFromURL(string_image_url);

    //sends the file as the response, then deletes the files from the server
    res.status(200).sendFile(filteredpath, ()=>{
      deleteLocalFiles([filteredpath])
    }); 
  })
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
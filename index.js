var mysql = require('mysql');
const http = require('http');
require('dotenv').config()

// CONFIGURATION SETTINGS FROM .ENV FILE

//NODE
const hostname = process.env.NODE_HOST;
const port = process.env.NODE_PORT; 


//MYSQL
var pool = mysql.createPool({
  connectionLimit : 25,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Based on the OpenSeaStandard
// https://docs.opensea.io/docs/metadata-standards#section-metadata-structure


//This nft model can be used if DB is not available.
// Leave unused empty. Null value generate errors on opensea.

const nft = {
  "id": 0,
  "image": "ipfs://QmTghjX986AuupFww4XfTRbddTpbEgXzKAhWYHQdt7o5BT",
  "image_data": "",
  "external_url": "https://github.com/Madeindreams/meta-node",
  "description": "This is the description of the Genesis NFT metadata provided by madeindreams MetaNode",
  "name": "Meta Node Genesis NFT",
  "animation_url": "",
  "youtube_url": "",
  "attributes": [{"trait_type": "level",  "value": "1" }]
}

 const server = http.createServer((req, res) => {
   res.statusCode = 200;
   res.setHeader('Content-Type', 'application/json');
   const id = req.url.split("/")

  // Here we determine what is the URL
  //      id[0]    /  id[1]   /   id[2]    /   id[3]    /   id[4]
  //     DOMAIN    /  nft     /   api      /   token    /    0
  // https://madeindreamc.ca/nft/api/token/0   will print the metadata for the NFT id 0

  if(id[1] == 'nft') {

    if(id[2] == 'api') {

      if(id[3] == 'token') {

        if (id[4] >= '0') {

          pool.query("SELECT * FROM nfts WHERE id = "+ id[4], function (err, result, fields) {
            if (err) throw err;
            var string = JSON.stringify(result);
            var json =  JSON.parse(string);
            console.log(json[0]);
            res.write(JSON.stringify(json[0]));
            res.end();
          });
         
        } else {
          // id[4] is not >= 0
          res.end(req.url);
        }

      }
      else{
        //id[3] is not token
      }

    }
    else {
      // id[2] is not api
      if(id[2] == 'install'){
        console.log('Runing installation...')
        res.end('Installing');
        var sql = "CREATE TABLE nfts ( id int(10) AUTO_INCREMENT PRIMARY KEY, image VARCHAR(255), image_data VARCHAR(255), external_url VARCHAR(255), description TEXT, name VARCHAR(255), attributes TEXT, animation_url VARCHAR(255), youtube_url VARCHAR(255) )";
            pool.query(sql, function (err, result) {
             if (err) throw err;
             console.log("Table created");
           });
           var sql = "INSERT INTO nfts (image, image_data, external_url, description, name, attributes, animation_url, youtube_url  ) VALUES ('"+nft.image+"', '"+nft.image_data+"', '"+nft.external_url+"', '"+nft.description+"', '"+nft.name+"', '"+nft.attributes+"', '"+nft.animation_url+"', '"+nft.youtube_url+"' )";
           pool.query(sql, function (err, result) {
           if (err) throw err;
           console.log("1 record inserted");
           });
           
      }
      else{
        // id[2] is not install
      }
    }


  } else {
    //id[1] is not nft
  }

 })


// Running the Node
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
})

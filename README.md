# meta-node
A Metadata Node for NFTs. This Node JS App uses MySQL DB to keep track of NFT Metadata. This is a centralized way
of storing and serving Metadata. You will need a MySQL DB and a host for your API. Both can be executed localy for development.

See https://docs.microsoft.com/en-us/windows/wsl/tutorials/wsl-database

## Usage

Fill in the .env_example and rename it to .env

Default to MySQL 

Install packages and Create the database

```node index```

Once the node is started reach 

http://127.0.0.1/64000/nft/install

This will create a table and insert the NFT model in it.

reach for 

http://127.0.0.1:60000/nft/api/token/1


This is based on the opensea model. Your metadata will comply with opensea standard.
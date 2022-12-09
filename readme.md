# Postgres. Elm. Authentication. Servant (P.E.A.S)

This project demonstrates a fullstack application.

### Building

This project uses the Nix package manager:
- https://nixos.org/download.html

```
$ nix-shell
$ sh make.sh
```

`nix-shell` will enter into an isolated environment which contains:
- Haskell tool chain with required packages, and some dev tools (Haskell Language Server)
- Postgres database programs.
- Elm compiler.
   
`sh make.sh` will 
- setup the database with test data and start it.
- build the Haskell backend.
- generate the Elm types from Haskell types.
- compile the Elm fronted.
- run the server on `http://localhost:8081` which responds to page and endpoint requests

### Authentication with JWT

#### JSON Web Token (JWT)
JSON Web Token (JWT) is a flexible format of a token which allows for different authentication capabilities based on how the JWT is constructed and used.

The wikipedia page provides a nice description:
- https://en.wikipedia.org/wiki/JSON_Web_Token

In a rough summary: 

- The general use case is to be able to verfy that data in the payload of the JWT did indeed get constructed by the expected and trusted JWT issuers.
  - For example the `payload` can contain the `claim` that "bob is an admin". 
  - And we want to verify this `claim` came from the expected issuer by using the `signature` of the JWT, and not from an imposter.

- JWT consists of a header, payload, and signature.
  - header: Contains JSON information that conforms to the JWT spec e.g identifies the algorithm used to generate the signature.
  - payload: Can essentially contain any data the user wants in the form of JSON, though there exist standard fields.
  - signature: 
    - The signature can be constructued with just a private key or a private/public key combo. 
    - The signature is of the header concatenated with the payload. 
    - The point of the signature it to able to be able to tell with either the public or private key, that it was indeed signed by the expected private key.

#### Authentication in this App

- In this app the user will receive a JWT upon proving that they are who they say they are i.e providing a username and password (sent over HTTPS).
- The server will construct the JWT and its signature with its private key and then send it to the client.
- The client then will uses this token to access the private endpoints.
- The server will simply verify that the JWT was signed by its own private key.

This however means that if an attacker compromises this JWT, then the attacker can simply use it to query the private endpoints. So the authentication system relies that the JWT is kept securely by the client.

Hence this relies on the trust of:
- The browser. Must ensure browsers javascript runtime/storage is sandboxed and there is no ways of leaking the token outside of the context of the webpage and webserver.
- The transimission mechanism. Must ensure HTTPS.
- The client user. Must trust that the user doesn't want to simply send the token to someone else.


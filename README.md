# jsbgen

**Java Spring Boot Code Generation**

This is a work in progress, but the intial version currently allows for the reading of a Postgres database structure to generate boilerplate Java Spring Boot code to speed up the creation of an api.  There are numerous inputs which the user can use to shape the code generation, including child and parent entities.

The code consists of a React app combined with a built in Node.js server.

* The**Node.js Express server** provides an api that can connect to a Postgres database, retrieve the needed table structures, and return them to the React app.
* The**React app** allows for the input of various options, including connect information for the database, calls the Node.js api to get the structure, and then uses multiple React components to generate the Java Spring Boot code.

The architecture is somewhat flexible in that you can add more components that can generate different kinds of Java code, and documentation will be added as to how to do this.

To run the code, either install a local Postgres server or have the connect information for one on another server, then type `npm run start` at the command prompt and this will start both the React app as well as the Node.js server.

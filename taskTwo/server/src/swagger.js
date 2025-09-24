import swaggerAutogen from "swagger-autogen";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

const doc = {
  info: {
    title: "My API",
    description: "API documentation for my todos project",
  },
  host: `localhost:${process.env.PORT}`,
};

const outputFile = "../swagger-output.json";
const routes = ["./app.js"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc);

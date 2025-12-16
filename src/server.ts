import { buildApp } from "./app";

const app = buildApp();

app.listen({ port: 3333 }, (err, address) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    
    console.log(`Server is running at ${address}`);
});
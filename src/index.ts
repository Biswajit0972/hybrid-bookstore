import 'dotenv/config'
import app from './app'
import {databaseConnection} from "./database/databaseConnection/connection";


databaseConnection().then(() =>
    app.listen(process.env.PORT, () => console.log('Server is running on port 3000'))
).catch((error) => {
    const err = error as Error;
    console.log(err.message);
});

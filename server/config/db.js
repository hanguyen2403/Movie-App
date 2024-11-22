//connect MongoDB with mongoose
import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI
        //     , {
        // useUnifiedTopology: true,
        // useNewUrlParser: true,
        // // useCreateIndex: true,
        // }
    );
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};


// const mongoose = require('mongoose');
// const uri = "mongodb+srv://hanguyenitcs2403:<db_password>@movie-app.fipux.mongodb.net/?retryWrites=true&w=majority&appName=movie-app";

// const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

// async function run() {
//   try {
//     // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
//     await mongoose.connect(uri, clientOptions);
//     await mongoose.connection.db.admin().command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await mongoose.disconnect();
//   }
// }
// run().catch(console.dir);

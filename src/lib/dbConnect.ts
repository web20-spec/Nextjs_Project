import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection : ConnectionObject = {}

async function dbConnect() : Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to database");
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {
            //autoIndex: ,   //default is true
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
        });

        connection.isConnected = db.connections[0].readyState

        console.log("Database connected successfully");

        // console.log("DB:", db);
        // console.log("db.connections:", db.connections);
        
        
        
    } catch (error) {
        console.log("Database connection failed", error);
        
        process.exit(1);
    }
}

export default dbConnect;
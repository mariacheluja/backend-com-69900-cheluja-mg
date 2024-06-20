import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/backend_com_69900_CHELUJA_MG'; // Ajusta el nombre de la base de datos local según sea necesario

const connectionString = "mongodb+srv://admin:admin@cluster0.kou88d2.mongodb.net/mydatabase?retryWrites=true&w=majority";

const initMongoDB = async () => {
    try {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB connected to ${MONGO_URL}`);   
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

// Exporta initMongoDB para que pueda ser importado en otros archivos
export { initMongoDB };



// // import mongoose from "mongoose";
// // import "dotenv/config"
// // const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/backend com 69900 CHELUJA MG' //traigo el string de coneccion de mongo atlas si no la toma toma la local




// // const connectionString = "mongodb+srv://admin:admin@cluster0.kou88d2.mongodb.net/mydatabase?retryWrites=true&w=majority";

// // const initMongoDB = async () => {
// //     try {
// //         await mongoose.connect(connectionString, {
// //             useNewUrlParser: true,
// //             useUnifiedTopology: true,
// //         });
// //         console.log("MongoDB connected");   
// //     } catch (error) {
// //         console.error("Error connecting to MongoDB:", error);
// //     }
// // }

// // // Exporta initMongoDB para que pueda ser importado en otros archivos
// // export { initMongoDB };
// // import mongoose from "mongoose";
// // import dotenv from "dotenv";
// // dotenv.config();

// // const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/backend_com_69900_CHELUJA_MG'; // Ajusta el nombre de la base de datos local según sea necesario

// // const connectionString = "mongodb+srv://admin:admin@cluster0.kou88d2.mongodb.net/mydatabase?retryWrites=true&w=majority";

// // const initMongoDB = async () => {
// //     try {
// //         await mongoose.connect(MONGO_URL, {
// //             useNewUrlParser: true,
// //             useUnifiedTopology: true,
// //         });
// //         console.log(`MongoDB connected to ${MONGO_URL}`);   
// //     } catch (error) {
// //         console.error("Error connecting to MongoDB:", error);
// //     }
// // }

// // // Exporta initMongoDB para que pueda ser importado en otros archivos
// // export { initMongoDB };
// // import mongoose from "mongoose";
// // import dotenv from "dotenv";
// // dotenv.config();

// // const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/backend_com_69900_CHELUJA_MG'; // Ajusta el nombre de la base de datos local según sea necesario

// // const initMongoDB = async () => {
// //     try {
// //         await mongoose.connect(MONGO_URL, {
// //             useNewUrlParser: true,
// //             useUnifiedTopology: true,
// //         });
// //         console.log(`MongoDB connected to ${MONGO_URL}`);   
// //     } catch (error) {
// //         console.error("Error connecting to MongoDB:", error);
// //     }
// // }

// // // Exporta initMongoDB para que pueda ser importado en otros archivos
// // export { initMongoDB };



//  import mongoose from "mongoose";

// const conectionString = "mongodb+srv://admin:admin@cluster0.kou88d2.mongodb.net/mydatabase?retryWrites=true&w=majority";

// const initMongoDB = async () => {
//     try {
//         await mongoose.connect(conectionString);
//         console.log("MongoDB connected");   
//     } catch (error) {
//         console.log(error);
//     }
        
//     }

//     initMongoDB(); 
    
//     //export default mongoose;    

// //    import mongoose from "mongoose";

// // Asegúrate de reemplazar 'admin' con la contraseña real si 'admin' no es tu contraseña
// //const connectionString = "mongodb+srv://admin:admin@cluster0.kou88d2.mongodb.net/mydatabase?retryWrites=true&w=majority";

// // const initMongoDB = async () => {
// //     try {
// //         await mongoose.connect(connectionString, {
// //             useNewUrlParser: true,
// //             useUnifiedTopology: true,
// //         });
// //         console.log("MongoDB connected");   
// //     } catch (error) {
// //         console.error("Error connecting to MongoDB:", error);
// //     }
// // }

// //initMongoDB();

// //Si deseas exportar mongoose para usarlo en otros módulos, descomenta la línea siguiente
// export default mongoose;

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Obtiene la URL de conexión a MongoDB Atlas desde las variables de entorno
const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/backend_com_69900_CHELUJA_MG';

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

// Llama a la función para iniciar la conexión
initMongoDB();

// Exporta mongoose si deseas usarlo en otros módulos
export default mongoose;

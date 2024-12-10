import mongoose from 'mongoose';

const connectDB = async () => {
  // Verifica si ya hay una conexión activa
  if (mongoose.connection.readyState >= 1) return;

  try {
    // Intenta conectar a MongoDB sin las opciones obsoletas
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conexión exitosa a MongoDB');
  } catch (error) {
    // En caso de error, muestra el error y termina el proceso
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Επιτυχής σύνδεση με βάση δεδομένων: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Σφάλμα: ${err.message}`);
    process.exit(1); 
  }
};

module.exports = connectDB;
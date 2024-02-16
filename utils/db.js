const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async (leagueID) => {
  try {
    let connectionURI;

    // If leagueID is provided, use the corresponding MONGO_URI_isl2024
    if (leagueID) {
      connectionURI = process.env[`MONGO_URI_${leagueID}`];
    } else {
      // Use the default MONGO_URI2 if no leagueID is provided
      connectionURI = process.env.MONGO_URI2;
    }

    if (!connectionURI) {
      console.error(`Invalid connection URI for leagueID ${leagueID || 'default'}`);
      process.exit(1);
    }

    // Check if there is an existing connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(connectionURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log(`Connected to MongoDB for leagueID: ${leagueID || 'default'}`);
    } else {
      // If there is an existing connection, close it first
      await mongoose.connection.close();

      // Connect to the new URI
      await mongoose.connect(connectionURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log(`Reconnected to MongoDB for leagueID: ${leagueID || 'default'}`);
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB for leagueID ${leagueID || 'default'}:`, error);
    process.exit(1);
  }
};

module.exports = connectDB;

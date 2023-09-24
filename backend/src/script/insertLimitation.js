const mongoose = require('mongoose');

// Define the MongoDB connection
mongoose.connect('mongodb://localhost:27017/limitationDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a Mongoose schema for the "limitations" collection
const limitationSchema = new mongoose.Schema({
  id: Number,
  name: String,
  description: String,
  version: String,
  status: Boolean,
});

// Create a Mongoose model based on the schema
const Limitation = mongoose.model('Limitation', limitationSchema);

// Define the data to be inserted
const data = [
  {
    id: 1,
    name: 'BATTERY_LOW',
    description: 'Battery in 10% below',
    version: 'v1.0.0',
    status: true,
  },
  {
    id: 2,
    name: 'CAMERA_DIRTY',
    description: 'Dirty camera',
    version: 'v1.0.1',
    status: true,
  },
  {
    id: 3,
    name: 'WATER_DAMAGE',
    description: 'The device has water inside',
    version: 'v2.0.0',
    status: true,
  },
  {
    id: 4,
    name: 'SLOT_FULL',
    description: 'Slot full connect by USB',
    version: 'v1.0.3',
    status: true,
  },
];

// Insert the data into the "limitations" collection

Limitation.insertMany(data)
  .then(() => {
    console.log('Data inserted successfully');
  })
  .catch((err) => {
    console.error('Error inserting data:', err);
  })
  .finally(() => {
    // Close the MongoDB connection
    mongoose.connection.close();
  });
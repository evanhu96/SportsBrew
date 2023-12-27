const mongoose = require('mongoose');

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb+srv://evanhughes66:r74JYDnfjSONT28r@cluster0.6fswh5n.mongodb.net/NBA',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

module.exports = mongoose.connection;

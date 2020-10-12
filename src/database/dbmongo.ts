import mongoose from 'mongoose';

export default mongoose.connect(
  `mongodb://${process.env.MONGO_HOST}:
  ${process.env.MONGO_PORT}/${process.env.MONGO_DB}`,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
);

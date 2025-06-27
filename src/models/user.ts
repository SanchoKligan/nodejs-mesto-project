import mongoose from 'mongoose';

type User = {
  name: string,
  about: string,
  avatar: string
};

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    about: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 200,
    },
    avatar: {
      type: String,
      required: true,
    },
  },
  { versionKey: false },
);

export default mongoose.model<User>('user', schema);

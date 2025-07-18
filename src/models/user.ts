import {
  model,
  Model,
  Schema,
  Document,
} from 'mongoose';
import { isEmail } from 'validator';
import { compare } from 'bcrypt';
import { UnauthorizedError } from '../errors';
import { AVATAR_REGEX } from '../constants/regex-patterns';

interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  about: string;
  avatar: string;
}

interface IUserModel extends Model<IUser> {
  /* eslint-disable no-unused-vars */
  findUserByCredentials(
    email: string,
    password: string
  ): Promise<IUser | null>;
  /* eslint-enable no-unused-vars */
}

const schema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v: string) => isEmail(v),
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 200,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (v: string) => AVATAR_REGEX.test(v),
      },
    },
  },
  { versionKey: false },
);

schema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

schema.static(
  'findUserByCredentials',
  async function findUserByCredentials(this: Model<IUser>, email: string, password: string) {
    const user = await this.findOne({ email }).select('+password');

    if (!user) {
      return Promise.reject(new UnauthorizedError('Неверные почта или пароль'));
    }

    const { password: userPass, ...userWithoutPass } = user.toObject?.() || null;
    const matched = await compare(password, userPass);

    if (!matched) {
      return Promise.reject(new UnauthorizedError('Неверные почта или пароль'));
    }

    return userWithoutPass;
  },
);

export default model<IUser, IUserModel>('User', schema);

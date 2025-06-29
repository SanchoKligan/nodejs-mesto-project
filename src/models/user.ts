import {
  model,
  Model,
  Schema,
  Document,
} from 'mongoose';
import { isEmail } from 'validator';
import { compare } from 'bcrypt';

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
        message: 'Некорректный формат почты: {VALUE}',
      },
    },
    password: {
      type: String,
      required: true,
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
    },
  },
  { versionKey: false },
);

schema.static(
  'findUserByCredentials',
  function findUserByCredentials(this: Model<IUser>, email: string, password: string) {
    return this.findOne({ email })
      .then((user) => {
        if (!user) {
          return Promise.reject(new Error('Неверные почта или пароль'));
        }

        return compare(password, user.password)
          .then((matched) => {
            if (!matched) {
              return Promise.reject(new Error('Неверные почта или пароль'));
            }

            return user;
          });
      });
  },
);

export default model<IUser, IUserModel>('User', schema);

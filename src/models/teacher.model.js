import { model, Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../configs/envConfig.js';

const teacherSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    dni: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    birthdate: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    institution: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    classes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Class',
      },
    ],
    generatedTokens: [
      {
        token: {
          type: String,
          required: true,
        },
        class: {
          type: Schema.Types.ObjectId,
          ref: 'Class',
          required: true,
        },
        generatedOn: {
          type: Date,
          default: Date.now,
        },
        expiresOn: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

teacherSchema.methods.generateToken = async function (classId) {
  const expirationTime = '2d';
  const token = jwt.sign(
    {
      class: classId,
      teacher: this._id,
    },
    JWT_SECRET,
    { expiresIn: expirationTime }
  );
  return token;
};

teacherSchema.statics.verifyToken = async function (token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const teacherModel = model('teacher', teacherSchema);

export { teacherModel };

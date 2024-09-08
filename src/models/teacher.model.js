import { model, Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../configs/env.config.js';

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
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    institution: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    verify: {
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

// Metodo para generar el token de acceso par los alumnos
teacherSchema.methods.generateToken = async function (classId) {
  // Generar el token de acceso
  const expirationTime = '2d';
  // Crear el token
  const token = jwt.sign(
    {
      class: classId,
      teacherId: this._id,
    },
    JWT_SECRET,
    { expiresIn: expirationTime }
  );
  return token;
};

// Metodo par verificiar un token jwt
teacherSchema.statics.verifyToken = function (token) {
  // Verificar si el token es valido
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const teacherModel = model('Teacher', teacherSchema);

export { teacherModel };

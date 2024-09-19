import { studentModel } from '../models/student.model.js';
import { teacherModel } from '../models/teacher.model.js';
import { createAccessToken } from '../libs/jwt.js';
import bcrypt from 'bcryptjs';

const loginUserService = async (userData) => {
  const { email, password } = userData;
  let user = null;
  let userType = null;

  user = await teacherModel.findOne({ email });
  userType = 'teacher';
  console.log(user);
  if (!user) {
    user = await studentModel.findOne({ email });
    userType = 'student';

    if (user.expiresAt < new Date()) {
      const deleteStudent = await studentModel.findByIdAndDelete({
        _id: user._id,
      });
      res.json({ error: ['El token de acceso ha expirado'] });
      return deleteStudent;
    }
  }

  if (!user) {
    throw new Error('Correo o contraseña incorrectos');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new Error('Correo o contraseña incorrectos');
  }

  const token = await createAccessToken({ id: user._id, userType });
  console.log(user);
  return { user, token };
};

export { loginUserService };

import {
  registerTeacherService,
  loginTeacherService,
  getTeacherProfileService,
  logoutTeacherService,
  verifyTokenService,
  generateTokenService,
} from '../services/teacherAuth.service.js';

// definir funcion para registrar un profesor
const registerTeacher = async (req, res) => {
  try {
    const { savedTeacher, token } = await registerTeacherService(req.body);
    res.cookie('token', token);
    res.status(201).json(savedTeacher);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: [error.message] });
  }
};

// definir funcion para loguear un profesor
const loginTeacher = async (req, res) => {
  // const { role, nombre, apellido , legajo } = req.body;

  // i1| f (role === 'teacher') {
  //   if (!nombre && !apellido) {
  //     return res.status(400).json({ error: ['Datos incorrectos'] });
  //   } else {
  //     // guardar los datos con el rol
  //     nombre , apellido, role teacher
  //   }
  // } else if (role === 'student') {
  //   if (!dataAlumno) {
  //     return res.status(400).json({ error: ['Datos incorrectos'] });
  //   } else {
  //     // guardar los datos con el rol stundent
  //     legajo, role student
  //   }
  // }
  try {
    const { existingTeacher, token } = await loginTeacherService(
      req.body.email,
      req.body.password
    );
    res.cookie('token', token);
    res.status(200).json(existingTeacher);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: [error.message] });
  }
};

// definir funcion para obtener el perfil de un profesor
const getTeacherProfile = async (req, res) => {
  try {
    const existingTeacher = await getTeacherProfileService(req.user.id);
    res.status(200).json(existingTeacher);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: [error.message] });
  }
};

// definir funcion para cerrar sesión de un profesor
const logoutTeacher = async (req, res) => {
  try {
    const response = logoutTeacherService();
    res.clearCookie('token', '', { expires: new Date(0) });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: ['Error en el servidor'] });
  }
};

// definir funcion para verificar un token
const verifyToken = async (req, res) => {
  try {
    const decoded = await verifyTokenService(req.cookies.token);
    res.status(200).json(decoded);
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: [error.message] });
  }
};

// definir funcion para generar un token
const generateToken = async (req, res) => {
  try {
    const response = await generateTokenService(req.user.id, req.body.classId);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: [error.message] });
  }
};

export {
  registerTeacher,
  loginTeacher,
  getTeacherProfile,
  logoutTeacher,
  verifyToken,
  generateToken,
};

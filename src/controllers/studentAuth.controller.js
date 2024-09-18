import {
  registerStudentService,
  loginStudentService,
  getStudentProfileService,
  verifyStudentTokenService,
  logoutStudentService,
} from '../services/studentAuth.service.js';

const registerStudent = async (req, res) => {
  try {
    const { savedStudent, token } = await registerStudentService(req.body);
    res.cookie('token', token);
    res.status(201).json(savedStudent);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: [error.message] });
  }
};

const loginStudent = async (req, res) => {
  try {
    const { studentFound, token } = await loginStudentService(req.body);
    res.cookie('token', token);
    res.status(200).json(studentFound);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: [error.message] });
  }
};

const getStudentProfile = async (req, res) => {
  try {
    const existingStudent = await getStudentProfileService(req.user.id);
    res.status(200).json(existingStudent);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: [error.message] });
  }
};

const verifyStudentToken = async (req, res) => {
  try {
    console.log(req.cookies.token);
    const decoded = await verifyStudentTokenService(req.cookies.token);
    res.status(200).json({
      message: 'Token válido',
      teacher: {
        id: decoded._id,
        name: decoded.firstName + ' ' + decoded.lastName,
        institution: decoded.institution,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: [error.message] });
  }
};

const logoutStudent = async (req, res) => {
  try {
    const response = logoutStudentService();
    res.clearCookie('token', '', { expires: new Date(0) });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: ['Error en el servidor'] });
  }
};

export {
  registerStudent,
  loginStudent,
  getStudentProfile,
  verifyStudentToken,
  logoutStudent,
};

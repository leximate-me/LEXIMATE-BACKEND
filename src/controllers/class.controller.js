import { classModel } from '../models/class.model.js';
import { teacherModel } from '../models/teacher.model.js';

const createClass = async (req, res) => {
  const { className, description, startDate, endDate } = req.body;
  try {
    const foundTeacher = await teacherModel.findById(req.user.id);

    if (!foundTeacher) {
      return res.status(404).json({ error: ['Usuario no encontrado'] });
    }

    const newClass = new classModel({
      className,
      description,
      startDate,
      endDate,
      teacher: foundTeacher._id,
    });

    const savedClass = await newClass.save();

    foundTeacher.classes.push(savedClass._id);
    await foundTeacher.save();

    return res.status(201).json({
      message: 'Clase creada exitosamente',
      class: savedClass,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: ['Error en el servidor'] });
  }
};

const getClasses = async (req, res) => {
  try {
    const classes = await classModel
      .find({ teacher: req.user.id })
      .populate('teacher');

    if (!classes) {
      return res.status(404).json({ error: ['No hay clases para mostrar'] });
    }

    return res.status(200).json({
      message: 'Clases encontradas',
      classes: teacher.classes,
    });
  } catch (error) {
    return res.status(500).json({ error: ['Error en el servidor'] });
  }
};

// Actualizar una clase existente
const updateClass = async (req, res) => {
  const { classId } = req.params;
  const { className, description, startDate, endDate } = req.body;

  try {
    const updatedClass = await classModel.findByIdAndUpdate(
      classId,
      { className, description, startDate, endDate },
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ error: 'Clase no encontrada' });
    }

    res.status(200).json({
      message: 'Clase actualizada exitosamente',
      class: updatedClass,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error en el servidor al actualizar la clase' });
  }
};

// Eliminar una clase
const deleteClass = async (req, res) => {
  const { classId } = req.params;

  try {
    const deletedClass = await classModel.findByIdAndDelete(classId);

    if (!deletedClass) {
      return res.status(404).json({ error: 'Clase no encontrada' });
    }

    // Remover la clase del array de clases del profesor
    const teacher = await teacherModel.findById(deletedClass.teacher);
    teacher.classes.pull(deletedClass._id);
    await teacher.save();

    res.status(200).json({
      message: 'Clase eliminada exitosamente',
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error en el servidor al eliminar la clase' });
  }
};

export { createClass, getClasses, updateClass, deleteClass };

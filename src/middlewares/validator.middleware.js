const validateSchema = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      res.status(400).json({ error: error.errors.map((err) => err.message) });
    }
  };
};

export { validateSchema };

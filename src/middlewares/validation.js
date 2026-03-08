export const validate = (schema) => async (req, res, next) => {
  try {
    const { body, params } = await schema.validateAsync(
      {
        body: req.body,
        query: req.query,
        params: req.params,
      },
      { abortEarly: false },
    );

    req.body = body;
    req.params = params;

    next();
  } catch (err) {
    console.log(err);
    return res.status(422).json({
      errMsg: 'Validation failed',
      errors: err.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message,
      })),
    });
  }
};

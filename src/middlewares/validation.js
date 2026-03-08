export const validate = (schema) => async (req, res, next) => {
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
};

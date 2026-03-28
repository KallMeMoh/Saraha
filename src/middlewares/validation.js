export const validate = (schema) => async (req, res, next) => {
  console.log({
    body: req.body,
    query: req.query,
    params: req.params,
    files: req.files,
  });
  const { body, params } = await schema.validateAsync(
    {
      body: req.body,
      query: req.query,
      params: req.params,
      files: req.files,
    },
    { abortEarly: false },
  );

  req.body = body;
  req.params = params;

  next();
};

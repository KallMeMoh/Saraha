// another file I don't like

const findOne = async ({
  Model,
  filters = {},
  select = '',
  populate = false,
  populateField = '',
}) => {
  let query = Model.findOne(filters).select(select);
  if (populate) query = query.populate(populateField);
  return await query;
};

const find = async ({
  Model,
  filters = {},
  select = '',
  populate = false,
  populateField = '',
}) => {
  let query = Model.find(filters).select(select);
  if (populate) query = query.populate(populateField);
  return await query;
};

const create = async ({ Model, data, options = {} }) => {
  const [result] = await Model.create([data], options);
  return result;
};

const exists = async ({ Model, filters = {} }) => {
  const result = await Model.exists(filters);
  return result;
};

const deleteOne = async ({ Model, filters = {} }) => {
  return await Model.deleteOne(filters);
};

export default {
  findOne,
  find,
  create,
  exists,
  deleteOne,
};

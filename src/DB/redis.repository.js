export const set = (key, value, type = 'EX', value = 120) => {
  return client.set(key, value, {
    expiration: { type, value },
  });
};

export const get = (key) => {
  return client.get(key);
};

export const mget = (key) => {
  return client.mget(key);
};

export const exists = (key) => {
  return client.exists(key);
};

export const ttl = (key) => {
  return client.ttl(key);
};

export const persist = (key) => {
  return client.persist(key);
};

export const del = (key) => {
  return client.del(key);
};

export const update = (key, value) => {
  if (client.exists(key)) return client.set(key, value);
};

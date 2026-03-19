import { client } from './redis.connection.js';

export const set = (key, value, type = 'EX', time = 120) => {
  return client.set(key, value, {
    expiration: { type, value: time },
  });
};

export const get = (key) => {
  return client.get(key);
};

export const mget = (keys) => {
  return client.mget(keys);
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
  return client.set(key, value, { condition: 'XX', expiration: 'KEEPTTL' });
};

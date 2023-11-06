import { ObjectId } from 'mongodb';

export const validateIdMongo = (id: string) => {
  return ObjectId.isValid(id);
};

import uuid from 'uuid/v1';

import * as db from './../../../dynamo/dynamo';
import withAuth from './../withAuth';

const generateItemValueGetters = (mutation, args) => mutation.attributes.reduce(
  (acc, attribute) => Object.assign(acc, {
    [attribute.name]: args[attribute.name],
  }), {
    id: uuid(),
    created_at: (new Date()).toLocaleDateString(),
  });

export const buildParams = ({ tableName }, mutation, args) => ({
  TableName: tableName,
  Item: generateItemValueGetters(mutation, args),
});

const createResolver = (config, mutation) => (_, args) => {
  const params = buildParams(config, mutation, args);

  return db.createItem(params);
};

export default withAuth(createResolver);

import Firebase from 'firebase-admin';

export function deleteField() {
  return Firebase.firestore.FieldValue.delete();
}

export function flatten(obj) {
  const ret = flattenValues(obj).reduce((a, b) => ({ ...a, [b.path]: b.value }), {});
  console.log('Flattened %s to %s', JSON.stringify(obj), JSON.stringify(ret));
  return ret;
}

function flattenValues(obj, path) {
  const type = typeof obj;

  if (obj === null || type === 'undefined') {
    return [{ path, value: deleteField() }];
  }

  if (obj instanceof Firebase.firestore.Timestamp || obj instanceof Date) {
    return obj;
  }

  if (type === 'object') {
    return Object.keys(obj).flatMap((key) => flattenValues(obj[key], path ? `${path}.${key}` : key));
  }

  return { path, value: obj };
}

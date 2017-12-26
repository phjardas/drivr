import Vue from 'vue';

export function setDeep(root, path, value) {
  if (path.length == 1) {
    Vue.set(root, path[0], value);
    return;
  }

  const [el, ...rest] = path;
  if (!root[el]) Vue.set(root, el, {});
  setDeep(root[el], rest, value);
}

export function unsetDeep(root, path) {
  if (path.length == 1) {
    delete root[path[0]];
    return;
  }

  const [el, ...rest] = path;
  if (root[el]) unsetDeep(root[el], rest);
}

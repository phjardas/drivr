import Vue from 'vue';

export function setDeep(root: any, path: string[], value: any) {
  if (path.length == 1) {
    Vue.set(root, path[0], value);
    return;
  }

  const [el, ...rest] = path;
  if (!root[el]) Vue.set(root, el, {});
  setDeep(root[el], rest, value);
}

export function unsetDeep(root: any, path: string[]) {
  if (path.length == 1) {
    Vue.delete(root, path[0]);
    return;
  }

  const [el, ...rest] = path;
  if (root[el]) unsetDeep(root[el], rest);
}

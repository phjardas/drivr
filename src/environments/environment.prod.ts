import { defaultEnvironment } from './default.env';

export { Version } from './version.model';

export const environment = { ...defaultEnvironment, production: true };

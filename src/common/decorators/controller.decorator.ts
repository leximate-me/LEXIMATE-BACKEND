const CONTROLLER_PREFIX_KEY = Symbol('prefix');

export function Controller(prefix: string = '') {
  return function (target: any) {
    Reflect.defineMetadata(CONTROLLER_PREFIX_KEY, prefix, target);
    return target;
  };
}

export function getControllerPrefix(target: any): string {
  return Reflect.getMetadata(CONTROLLER_PREFIX_KEY, target) || '';
}

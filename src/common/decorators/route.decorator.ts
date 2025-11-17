import { FastifyRequest, FastifyReply } from 'fastify';

export type RouteHandler = (
  req: FastifyRequest,
  reply: FastifyReply
) => Promise<any> | any;

export interface RouteMetadata {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  path: string;
  handler: RouteHandler;
  handlerName: string;
}

const ROUTES_METADATA_KEY = Symbol('routes');

export function Get(path: string = '') {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const routes = Reflect.getOwnMetadata(ROUTES_METADATA_KEY, target) || [];
    routes.push({
      method: 'GET',
      path,
      handler: descriptor.value,
      handlerName: propertyKey,
    });
    Reflect.defineMetadata(ROUTES_METADATA_KEY, routes, target);
    return descriptor;
  };
}

export function Post(path: string = '') {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const routes = Reflect.getOwnMetadata(ROUTES_METADATA_KEY, target) || [];
    routes.push({
      method: 'POST',
      path,
      handler: descriptor.value,
      handlerName: propertyKey,
    });
    Reflect.defineMetadata(ROUTES_METADATA_KEY, routes, target);
    return descriptor;
  };
}

export function Patch(path: string = '') {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const routes = Reflect.getOwnMetadata(ROUTES_METADATA_KEY, target) || [];
    routes.push({
      method: 'PATCH',
      path,
      handler: descriptor.value,
      handlerName: propertyKey,
    });
    Reflect.defineMetadata(ROUTES_METADATA_KEY, routes, target);
    return descriptor;
  };
}

export function Delete(path: string = '') {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const routes = Reflect.getOwnMetadata(ROUTES_METADATA_KEY, target) || [];
    routes.push({
      method: 'DELETE',
      path,
      handler: descriptor.value,
      handlerName: propertyKey,
    });
    Reflect.defineMetadata(ROUTES_METADATA_KEY, routes, target);
    return descriptor;
  };
}

export function Put(path: string = '') {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const routes = Reflect.getOwnMetadata(ROUTES_METADATA_KEY, target) || [];
    routes.push({
      method: 'PUT',
      path,
      handler: descriptor.value,
      handlerName: propertyKey,
    });
    Reflect.defineMetadata(ROUTES_METADATA_KEY, routes, target);
    return descriptor;
  };
}

export function getRoutes(target: any): RouteMetadata[] {
  return Reflect.getOwnMetadata(ROUTES_METADATA_KEY, target) || [];
}

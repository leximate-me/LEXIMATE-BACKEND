import { HttpError } from '@common/libs/http-error';

const VALIDATE_KEY = Symbol('validate');

export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'email';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  message?: string;
}

export function Validate(rules: ValidationRule[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata(VALIDATE_KEY, rules, target, propertyKey);
    return descriptor;
  };
}

export function getValidationRules(
  target: any,
  propertyKey: string
): ValidationRule[] {
  return Reflect.getMetadata(VALIDATE_KEY, target, propertyKey) || [];
}

export function validateData(
  data: any,
  rules: ValidationRule[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  rules.forEach((rule) => {
    const value = data[rule.field];

    if (
      rule.required &&
      (value === undefined || value === null || value === '')
    ) {
      errors.push(rule.message || `${rule.field} is required`);
      return;
    }

    if (value === undefined || value === null) return;

    if (rule.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errors.push(
          rule.message || `${rule.field} must be a valid email address`
        );
      }
      return;
    }

    if (rule.type && typeof value !== rule.type) {
      errors.push(rule.message || `${rule.field} must be of type ${rule.type}`);
    }

    if (rule.minLength && value.length < rule.minLength) {
      errors.push(
        rule.message ||
          `${rule.field} must be at least ${rule.minLength} characters`
      );
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      errors.push(
        rule.message ||
          `${rule.field} must be at most ${rule.maxLength} characters`
      );
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      errors.push(
        rule.message || `${rule.field} does not match the required pattern`
      );
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

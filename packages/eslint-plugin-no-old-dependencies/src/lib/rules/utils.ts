import { Literal, ObjectExpression, Property, SpreadElement } from 'estree';

export function isProperty(property: Property | SpreadElement): property is Property {
  return property.type === 'Property';
}

export function getPropertyKey(property: Property) {
  const key = property.key as Literal;
  return (key.value as string) ?? '';
}

export function getPropertyValue(property: Property) {
  const value = property.value as Literal;
  return (value.value as string) ?? '';
}

export function getProperties(object: ObjectExpression): Property[] {
  return object.properties.filter(isProperty);
}

export function hasDependencies(property: Property) {
  return getPropertyKey(property) === 'dependencies';
}

export function hasPeerDependencies(property: Property) {
  return getPropertyKey(property) === 'peerDependencies';
}

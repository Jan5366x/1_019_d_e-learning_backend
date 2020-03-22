const minCheck: Function = (toCheck: any, minLength: number) => toCheck != null &&
    (typeof toCheck === 'string' || toCheck instanceof String) && toCheck.length < minLength;
const maxCheck: Function = (toCheck: any, maxLength: number) => toCheck != null &&
    (typeof toCheck === 'string' || toCheck instanceof String) && toCheck.length > maxLength;

export { minCheck as min, maxCheck as max };
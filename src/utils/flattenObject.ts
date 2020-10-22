/**
 * Funcion para 'subir' propiedades de nivel
 * 
 */

export const flattenArray = (array: Array < any > ) => {
    const arrayMod = array.map( data  => {
        return flattenObject( data );
    } )
    
    return arrayMod;
}

const flattenObject = (obj: any, prefix = '') =>
  Object.keys(obj).reduce((acc : any, k: any) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[k] === 'object') Object.assign(acc, flattenObject(obj[k], pre + k));
    else acc[pre + k] = obj[k];
    return acc;
  }, {})
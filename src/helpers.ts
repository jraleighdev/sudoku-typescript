export function stringIsNullEmpty(value: string) : boolean {
    let result = false;
    
    if (value === null || value.trim() === '') {
        result = true;
    }
    
    return result;
}
//


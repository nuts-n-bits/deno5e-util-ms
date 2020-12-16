export function const_time_eq(str1 : string, str2 : string) {

    if(str1.length !== str2.length) return false
    const arr1 = Array.from(str1).map(x => x.charCodeAt(0))
    const arr2 = Array.from(str2).map(x => x.charCodeAt(0))
    const arr3 : number[] = []
    for(let i=0; i<arr1.length && i<arr2.length; i++) { arr3[i] = arr1[i] ^ arr2[i] }
    const sum = arr3.reduce((a,b) => a+b, 0)
    return sum === 0
}

export function unescape(escaped_string: string): string {

    let new_string = ""

    for(let i=0; i<escaped_string.length; i++) {

        if(escaped_string[i] !== "%") {
            new_string += escaped_string[i]
        }
        else {
            new_string += String.fromCharCode(parseInt(escaped_string.substr(i+1, 2), 16))
            i += 2
        }
    }

    return new_string

}

function fill_zeros(str: string, fill_to: number): string {

    const fill_this_many = fill_to - str.length

    if(fill_this_many <= 0)
        return str

    return "0".repeat(fill_this_many) + str
}

export function escape(unescaped_string: string): string {

    // priority mod/keep range
    // 5.       md       0-41
    // 8.       kp       42-43
    // 9.       md       44
    // 3.       kp       45-57  (--9)
    // 6.       md       58-63
    // 2.       kp       64-90  (@-Z)
    // 7.       md       91-94
    // 10.      kp       95
    // 11.      md       96
    // 1.       kp       97-122 (a-z)
    // 4.       md       122+


    let new_string = ""

    for(let i=0; i<unescaped_string.length; i++) {

        let code = unescaped_string.charCodeAt(i)

        if(code >= 97 && code <= 122 || code >= 64 && code <= 90 || code >= 45 && code <= 57 || code === 42 || code === 43 || code === 95)
            new_string += unescaped_string[i]

        else if(code <= 255)
            new_string += "%" + fill_zeros(unescaped_string.charCodeAt(i).toString(16).toUpperCase(), 2)

        else  // this should not happen though
            new_string += "%" + fill_zeros(unescaped_string.charCodeAt(i).toString(16).toUpperCase(), 4)
    }

    return new_string

}


if(0) {

    "this is a test for the unescape polyfill"

    let arr: any[] = []
    for(let i=0; i<10000; i++) arr[i]=i
    arr = arr.map(x => String.fromCodePoint(x))

    let brr = arr.map(x => escape(x))

    for(let i=0; i<10000; i++) {

        if(arr[i] === brr[i]) console.log(i+": ♥️ (" + arr[i] + ")")
        else console.log(i+": 🍰 (" + arr[i] + ", " + brr[i] + ")")
    }

}

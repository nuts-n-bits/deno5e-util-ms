export function is_email (str: string): boolean {

    return /^[a-zA-Z0-9._~\-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(str)
}

export function clamp<T extends bigint|number>(lower: T|null, input: T, upper: T|null): T {

    if(lower !== null && input < lower) { return lower }
    else if(upper !== null && input > upper) { return upper }
    else { return input }
}

export function random_int (lower_bound: number, upper_bound: number): number {

    let upper: number, lower: number

    if(lower_bound > upper_bound) {
        upper = lower_bound
        lower = upper_bound
    }
    else {
        upper = upper_bound
        lower = lower_bound
    }

    return Math.floor(Math.random()*(upper - lower + 1) + lower)
}

export function is_sig (str: string|null): boolean {

    return typeof str === "string" && /^[0-9a-f]{64}$/.test(str)
}

export function nice_looking_background (): string {

    let rm043 = random_int(23, 100)
    let rm129 = random_int(109, 255)
    let rm255 = random_int(255, 225)

    let rm0_359_1 = random_int(0, 359)
    let rm0_359_2 = (rm0_359_1 + random_int(110, 145)) % 360
    let rm0_359_3 = random_int(0, 359)

    let position = "position: absolute; top: 0; left: 0; right: 0; bottom:0;"
    let rgba = `${rm043},${rm129},${rm255},0.4`

    return `
<div style="z-index: -4; ${position}; background: rgba(0,0,0,0.04);"></div>
<div style="z-index: -3; ${position}; background: linear-gradient(${rm0_359_3}deg, rgba(0,0,0,0.01), transparent);"></div>
<div style="z-index: -2; ${position}; background: linear-gradient(${rm0_359_1}deg, rgba(${rgba}), rgba(225,83,132,0.6)); opacity: 0.99;"></div>
<div style="z-index: -1; ${position}; background: linear-gradient(${rm0_359_2}deg, rgba(43,29,225,0.4), rgba(255,183,132,0.5)); opacity: 0.99;"></div>
`.trim()
}

export function sanitize_html(insertee: string|number|bigint|undefined): string {

    return String(insertee)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/'/g, "&apos;")
        .replace(/"/g, "&quot;")

}

function _sanitize_html_inverse(sanitized: string): string {


    return sanitized
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&apos;/g, "'")
        .replace(/&quot;/g, "\"")
        .replace(/&amp;/g, "&")
}

export function nop (...args: any[]): void {

    return
}

export function async_sleep(microsecond: number): Promise<void> {

    return new Promise((res) => {

        setTimeout(res, microsecond)
    })
}

/**
 * Will return "YYYYMMDD"
 * If used with years less than 4 digits, will still return "YYYYMMDD", with 0 padded to the year fields.
 * If used with years with 5 digits or more, will return "YYYYMMDD", YYYY = actual year mod 10000.
 * If used with BCE dates (year<0), throws an Error.
 */
export function yyyymmdd(date: Date): string {
    if(date.getFullYear() < 0) { throw new Error("Cannot convert BCE dates to YYYYMMDD") }
    const yr = (date.getFullYear()%10000).toString()
    const mn = (date.getMonth()+1).toString()
    const dy = date.getDate().toString()
    const yrfill = yr.length >= 4 ? "" : "0".repeat(4 - yr.length)
    const mnfill = "0".repeat(2 - mn.length)
    const dyfill = "0".repeat(2 - dy.length)
    return yrfill + yr + mnfill + mn + dyfill + dy
}
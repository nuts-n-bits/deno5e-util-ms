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

export class Username_check_result {

    too_long                = false
    not_in_default_char_set = false
    leading_white           = false
    ending_white            = false
    consecutive_white       = false
    disallowed_char         = false
    all_numbers             = false

    pass (): boolean {

        return !this.too_long && !this.not_in_default_char_set && !this.leading_white &&
            !this.ending_white && !this.consecutive_white && !this.disallowed_char && !this.all_numbers
    }

    fail (): boolean {

        return !this.pass()
    }
}

export function username_check (str: string): Username_check_result {

    const ucr = new Username_check_result()

    ucr.too_long                = str.length > 256;
    ucr.not_in_default_char_set = !/^[ -~¡-¬®-ʸぁ-ヿ㐀-䶵가-힣、-〼，！？；：（ ）［］【】—一-鿏]+$/.test(str)
    ucr.leading_white           = /^[\s\n\r\t].*$/.test(str)
    ucr.ending_white            = /^.*[\s\n\r\t]$/.test(str)
    ucr.consecutive_white       = /[\s\n\r\t]{2,}/.test(str)
    ucr.disallowed_char         = /[*=@#%&?:/\\<>]+/.test(str)
    ucr.all_numbers             = /^[0-9]*$/.test(str)

    return ucr
}

export function regulate_username(str: string): string {

    const short = str.substr(0, 256);
    const only_allowed_characters = short.replace(/[^ -~¡-¬®-ʸぁ-ヿ㐀-䶵가-힣、-〼，！？；：（ ）［］【】—一-鿏]/g, "");
    const no_leading_white = only_allowed_characters.replace(/^[\s\n\r\t]+/, "");
    const no_ending_white = no_leading_white.replace(/[\s\n\r\t]+$/, "");
    const no_consecutive_white = no_ending_white.replace(/[\s\n\r\t]{2,}/g, "");
    const no_disallowed_char = no_consecutive_white.replace(/[*=@#%&?:/\\]+/g, "");

    return no_disallowed_char;
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

export function nop (...args : any[]) : void {

    return
}

export function async_sleep(microsecond : number) : Promise<void> {

    return new Promise((res) => {

        setTimeout(res, microsecond)
    })
}

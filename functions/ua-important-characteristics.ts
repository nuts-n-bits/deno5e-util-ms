
const search_space = {
    "bot": true,
    "safari": true,
    "firefox": true,
    "chrome": true,
    "edge": true,
    "msie": true,
    "mac": true,
    "intel": true,
    "linux": true,
    "android": true,
    "windows": true,
    "win64": true,
    "wow64": true,
    "trident": true,
    "gecko": true,
    "applewebkit": true,
    "bingbot": true,
    "googlebot": true,
    "zgrab": true,
    "curl": true,
    "petalbot": true,
    "alphabot": true,
    "zmeu": true,
    "7siters": true,
    "client": true,
    "unknown": true
}

export function ua_important_characteristics(ua_string: string) {

    const ua = ua_string.toLowerCase()
    const report: Array<keyof typeof search_space> = []
    Object.entries(search_space).forEach(([term, bool]) => { if(ua.indexOf(term) >= 0) { report.push(term as keyof typeof search_space) } })
    return report
}
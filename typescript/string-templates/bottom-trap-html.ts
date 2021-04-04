import { sanitize_html } from "../functions/misc.ts"
import { type_check_never } from "../protocols/assert-passthrough.ts"

export namespace BottomTrapUtilityPackage {

    export type ColorRgba = {r: number, g: number, b: number, a: number}
    export function rgba(r: number, g: number, b: number, a: number): ColorRgba { return {r, g, b, a} }
    export function body(text: string, color?: ColorRgba) { return {text, color} }
    export type TDiagStrCode = {
        styled_diag: boolean,
        fallback_color?: ColorRgba,
        body: Array<{
            text: string,
            color?: ColorRgba,
        }>
    }
    export const color_red    = rgba(255, 90 , 110, 1)
    export const color_white  = rgba(220, 220, 220, 1)
    export const color_green  = rgba(150, 245, 130, 1)
    export const color_yellow = rgba(255, 220, 100, 1)
    export const color_cyan   = rgba(20 , 255, 230, 1)
    export const color_blue   = rgba(50 , 170, 255, 1)
    export const color_purple = rgba(200, 103, 180, 1)

    export const red    = (s: string) => body(s, color_red)
    export const white  = (s: string) => body(s, color_white)
    export const green  = (s: string) => body(s, color_green)
    export const yellow = (s: string) => body(s, color_yellow)
    export const cyan   = (s: string) => body(s, color_cyan)
    export const blue   = (s: string) => body(s, color_blue)
    export const purple = (s: string) => body(s, color_purple)
}

export function bottom_trap_html (error_code: string|null, diag_string: string|null|BottomTrapUtilityPackage.TDiagStrCode, input_sanitizer = sanitize_html) {
    
    const san = input_sanitizer  
    let built_san_diag_string: string|null = null
    let styled_diag = false
    if (diag_string === null) {
        built_san_diag_string = null
    } 
    else if (typeof diag_string === "string") {
        built_san_diag_string = san(diag_string)
    }
    else if ("body" in diag_string) { 
        built_san_diag_string = ""
        styled_diag = diag_string.styled_diag
        for (const segment of diag_string.body) {
            built_san_diag_string += `<span style="color: ${rgbastr(segment.color??diag_string.fallback_color??BottomTrapUtilityPackage.color_white)}">${san(segment.text)}</span>`
        }
    }
    else {
        type_check_never(diag_string)
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="initial-scale=1, minimum-scale=1, width=device-width" />
<title>Error</title>
<style>
*        { box-sizing: border-box; }
body     { margin: 0; }
body>*   { font: 10pt "Open Sans", system-ui, sans-serif; max-width: 700px; color: rgba(0,0,0,0.6); }
h3       { font-size: 114%; font-weight: bold; margin: 2em 0 0.75em 0; }
h3.ecmp  { border-radius: 0.3em; display: inline-block; font-size: 110%; padding: 0.2em 0.6em; border: 1px solid rgba(0,0,0,0.5); margin: 0; white-space: nowrap; }
a        { color: rgba(0,0,0,0.7); }
p        { margin: 0 0 0.5em 0; }
p.link   { display: none; }
.grid    { display: grid; }
.diag    { background: rgba(0,0,0,0.04); border-radius: 0.3em; padding: 1em; white-space: pre-wrap; }
.mono    { font-family: source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace; }
.code    { background: #234; color: #ddd; word-break: break-all; }
.shuffle { position: absolute; opacity: 0; transition: opacity 0.2s; animation: shuffle_4_in_40 40s ease infinite; }
.i18n-title-container
         { position: relative; height: 4.6em; }

@keyframes shuffle_4_in_40 {
    0% {opacity: 0}
    1% {opacity: 1}
    9% {opacity: 1}
    10% {opacity: 0}
    100% {opacity: 0}
}

@media screen and (min-width: 750px) {
    body { margin: 4em; }
    .grid { 
        grid-gap: 0 3.6em;
        grid-template-columns: 1fr 1fr;
        grid-template-rows:    1fr 1fr 1fr 1fr 1fr;
        grid-template-areas:   "de en"
                               "es fr"
                               "ja ko"
                               "ru sv"
                               "zhtw zhcn";
    }
}

@media screen and (max-width: 750px) {
    body { margin: 2em; margin-bottom: 4em; }
    .grid { 
        grid-gap: 0;
        grid-template-columns: 1fr;
        grid-template-rows:    1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-template-areas:   "de"
                               "en"
                               "es"
                               "fr"
                               "ja"
                               "ko"
                               "ru"
                               "sv"
                               "zhcn"
                               "zhtw";
    }
}
</style>
</head>
<body>
<!-- 
This page is served when a server error cannot be handled gracefully.
For security reasons, details of such errors are not reported to the client and a generic error page is displayed.
-->${error_code ? `\n<h3 class="ecmp">${san(error_code)}</h3>` : ""}
<div class="grid">
    <div lang="de" style="grid-area: de">
        <h3 class="heading">Ein Fehler ist aufgetreten.</h3>
        <p class="desc">${built_san_diag_string === null ? "Es sind keine weiteren Informationen verfügbar." : "Diagnoseinformationen sind wie folgt enthalten."}</p>
    </div>
    <div lang="en" style="grid-area: en">
        <h3 class="heading">An error occurred.</h3>
        <p class="desc">${built_san_diag_string === null ? "No further information is available." : "Diagnostic information is included as follows."}</p>
    </div>
    <div lang="es" style="grid-area: es">
        <h3 class="heading">Ocurrió un error.</h3>
        <p class="desc">${built_san_diag_string === null ? "No hay mas informacion disponible." : "La información de diagnóstico se incluye de la siguiente manera."}</p>
    </div>
    <div lang="fr" style="grid-area: fr">
        <h3 class="heading">Une erreur s'est produite.</h3>
        <p class="desc">${built_san_diag_string === null ? "Aucune information supplémentaire n'est disponible." : "Les informations de diagnostic sont incluses comme suit."}</p>
    </div>
    <div lang="ja" style="grid-area: ja">
        <h3 class="heading">エラーが起きました。</h3>
        <p class="desc">${built_san_diag_string === null ? "これ以上の情報はありません。" : "診断情報は次のとおりです。"}</p>
    </div>
    <div lang="ko" style="grid-area: ko">
        <h3 class="heading">에러 발생됨.</h3>
        <p class="desc">${built_san_diag_string === null ? "더 이상의 정보가 없습니다." : "진단 정보는 다음과 같습니다."}</p>
    </div>
    <div lang="ru" style="grid-area: ru">
        <h3 class="heading">Произошла ошибка.</h3>
        <p class="desc">${built_san_diag_string === null ? "Дополнительной информации нет." : "Диагностическая информация включается следующим образом."}</p>
    </div>
    <div lang="sv" style="grid-area: sv">
        <h3 class="heading">Ett fel uppstod.</h3>
        <p class="desc">${built_san_diag_string === null ? "Ingen ytterligare information finns tillgänglig." : "Diagnosinformationen är som följer:"}</p>
    </div>
    <div lang="zh-CN" style="grid-area: zhcn">
        <h3 class="heading">发生了错误。</h3>
        <p class="desc">${built_san_diag_string === null ? "目前没有有关的更多信息。" : "诊断信息如下。"}</p>
    </div>
    <div lang="zh-TW" style="grid-area: zhtw">
        <h3 class="heading">出現錯誤。</h3>
        <p class="desc">${built_san_diag_string === null ? "目前沒有有關的更多信息。" : "診斷信息如下。"}</p>
    </div>
</div>${built_san_diag_string !== null ? `
<div class="i18n-title-container">
    <h3 class="shuffle" style="animation-delay:  0s" lang="de">Diagnoseinformationen</h3>
    <h3 class="shuffle" style="animation-delay:  4s" lang="ja">診断情報</h3>
    <h3 class="shuffle" style="animation-delay:  8s" lang="en">Diagnostic Information</h3>
    <h3 class="shuffle" style="animation-delay: 12s" lang="ko">진단 정보</h3>
    <h3 class="shuffle" style="animation-delay: 16s" lang="es">Información de Diagnóstico</h3>
    <h3 class="shuffle" style="animation-delay: 20s" lang="ru">Диагностическая Информация</h3>
    <h3 class="shuffle" style="animation-delay: 24s" lang="fr">Informations de Diagnostic</h3>
    <h3 class="shuffle" style="animation-delay: 28s" lang="zh-CN">诊断信息</h3>
    <h3 class="shuffle" style="animation-delay: 32s" lang="sv">Diagnostisk Information</h3>
    <h3 class="shuffle" style="animation-delay: 36s" lang="zh-TW">診斷信息</h3>
</div>
<div class="diag${styled_diag ? " mono code" : ""}">${built_san_diag_string}</div>` : ""}
</body>
</html>
`

}

function clamp_0_255(i: number) {
    if (i <= 0) { return 0 }
    if (i >= 255) { return 255 }
    return Math.floor(i)
}

function clamp_0_1(i: number) {
    if (i <= 0) { return 0 }
    if (i >= 1) { return 1 }
    return i
}

function rgbastr(rgba: BottomTrapUtilityPackage.ColorRgba): string {
    const r = clamp_0_255(rgba.r).toString(10)
    const g = clamp_0_255(rgba.g).toString(10)
    const b = clamp_0_255(rgba.b).toString(10)
    const a = clamp_0_1(rgba.a).toFixed(5)
    return `rgba(${r}, ${g}, ${b}, ${a})`
}
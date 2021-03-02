


function skipAd() {
    const htmlElements = document.getElementsByClassName("ytp-ad-skip-button")
    if (htmlElements[0] === undefined) { return }
    const buttons = [...htmlElements]
    buttons.map(button => {
        button.click()
        console.log("clicked ad skip button for ya")
    })
}

function autoHD() {
    const condition_1 = document.querySelector(".ytp-popup.ytp-settings-menu")
    const condition_2 = condition_1 && condition_1.computedStyleMap().get("display").value === "none"
    const condition_3 = condition_2 && [...document.getElementsByClassName("ytp-ad-skip-button")].length === 0
    const condition_4 = condition_3 && window.scrollY < 50
    const condition_5 = condition_4 && document.querySelector(".ytp-gradient-bottom")
    const condition_6 = condition_5 && document.querySelector("#search").hasFocus === false
    if(condition_6) {
        makeHD()
    }
}

function makeHD() {
    try {
        const save_style_display = document.querySelector(".ytp-gradient-bottom").style.display
        document.querySelector(".ytp-gradient-bottom").style.display = "none"
        document.querySelector(".ytp-button.ytp-settings-button").click()
        document.querySelector(".ytp-popup.ytp-settings-menu>.ytp-panel>.ytp-panel-menu").lastElementChild.click()
        document.querySelector(".ytp-quality-menu>.ytp-panel-menu").firstElementChild.click()
        document.querySelector(".ytp-gradient-bottom").style.display = save_style_display
    }
    catch (something_went_wrong_error) {
        clearInterval(autoHDIntId)
    }
}

const skipAdIntId = setInterval(skipAd, 50)
const autoHDIntId = setInterval(autoHD, 1500)
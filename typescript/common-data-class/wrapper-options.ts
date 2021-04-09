type HeaderTheme = "light" | "dark" | "transparent_on_light" | "transparent_on_dark"
type FooterTheme = HeaderTheme
type NavBarLink = {text: string, href: string}

export class WrapperOptions <TNavBarLink=NavBarLink, TFooterAdditions=string> {

    public body_ver_lim                 : boolean                 = true
    public css_commons_enable           : boolean                 = true
    public css_aesthetics_enable        : boolean                 = true
    public footer_additional_info       : Array<TFooterAdditions> = []
    public footer_bottom_text           : Array<TFooterAdditions> = []
    public footer_flex                  : boolean                 = true
    public footer_margin                : boolean                 = true
    public footer_theme                 : FooterTheme             = "light"
    public footer_ver_lim               : boolean                 = true
    public header_theme                 : HeaderTheme             = "light"
    public header_ver_lim               : boolean                 = true
    public html_lang_attr               : string                  = ""
    public icon_alt                     : string                  = ""
    public icon_source                  : string|null             = null
    public icon_style                   : {[index:string]:string} = {height: "47px", width: "47px"}
    public meta_description             : Array<string>           = []
    public nav_bar_links                : Array<TNavBarLink>      = []
    public nav_hold                     : boolean                 = true
    public nav_margin                   : boolean                 = true
    public title_segments               : Array<string>           = []
    public title_canonical              : string|null             = null

    public header_theme_darkish(): boolean {
        return this.header_theme === "dark" || this.header_theme === "transparent_on_dark"
    }

    public footer_theme_darkish(): boolean {
        return this.footer_theme === "dark" || this.footer_theme === "transparent_on_dark"
    }
}

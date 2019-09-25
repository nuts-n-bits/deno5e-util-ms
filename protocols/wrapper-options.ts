
type Header_theme = "light" | "dark" | "transparent_on_light" | "transparent_on_dark"
type Footer_theme = Header_theme
type Nav_bar_link = {text : string, href : string}

export class Wrapper_options {

    public css_commons_enable           : boolean                 = true
    public css_aesthetics_enable        : boolean                 = true
    public document_head_insert         : string                  = ""
    public footer_additional_info       : Array<string>           = []
    public footer_bottom_text           : Array<string>           = []
    public footer_flex                  : boolean                 = true
    public footer_margin                : boolean                 = true
    public footer_theme                 : Footer_theme            = "light"
    public header_theme                 : Header_theme            = "light"
    public header_ver_lim               : boolean                 = true
    public html_lang_attr               : string                  = ""
    public icon_alt                     : string                  = ""
    public icon_source                  : string|null             = null
    public icon_style                   : {[index:string]:string} = {height: "47px", width: "47px"}
    public meta_description_add         : Array<string>           = []
    public meta_description_overwrite   : string                  = ""
    public nav_bar_links                : Array<Nav_bar_link>     = []
    public nav_hold                     : boolean                 = true
    public nav_margin                   : boolean                 = true
    public title_overwrite              : string|null             = null
    public title_prepend                : Array<string>           = []
    public server_side_passthru         : Map<string,string>      = new Map()

    public username                     : string|null             = null

    public header_theme_darkish() : boolean {
        return this.header_theme === "dark" || this.header_theme === "transparent_on_dark"
    }
}



/**
 *
 *
 * App finder の使い方をここで記録する。
 *
 * const af = new App_finder (default_fallback)
 * af.find_app (null, "not registered") --> default_fallback
 *
 * af.bind_name_to_app (null, "name", app1)
 * af.bind_name_to_app (null, Symbol(), app2)
 * af.find_app (null, "name") --> app1
 *
 * af.bind_name_to_app ("www.website.com", "name", app3)
 * af.find_app ("www.website.com", "name") --> app3
 * af.find_app (null, "name") --> app1
 *
 * */

export class App_finder<App_id, App_type> {

    private readonly _app_use_by_name = new Map<App_id, App_type>()
    private readonly _app_use_by_regex : [RegExp, App_type][] = []
    private          _fall_back_app : App_type

    private readonly _host_app_use_by_name = new Map<string, Map<App_id, App_type>>()
    private readonly _host_app_use_by_regex = new Map<string, [RegExp, App_type][]>()
    private readonly _host_fall_back_app = new Map<string, App_type>()

    private readonly _host_alias = new Map<string, string>()
    private readonly _host_alias_regex : [RegExp, string][] = []
    private readonly _known_hosts = new Map<string, true>()

    constructor(general_fall_back_app : App_type) {
        // fallback アプリは唯一の必要なコンポネート。だから constructor でこれを要求する。
        this._fall_back_app = general_fall_back_app
    }

    bind_name_to_app (host : string|null, app_name : App_id|RegExp, app : App_type) : void {

        if(host === null) {
            if(app_name instanceof RegExp) this.bind_app_4(null, app_name, app)
            else this.bind_app_3(null, app_name, app)
        }
        else {
            if(app_name instanceof RegExp) this.bind_app_2(host, app_name, app)
            else this.bind_app_1(host, app_name, app)
            this._known_hosts.set(host, true)
        }
    }

    set_host_alias (host : string, alias : string|RegExp) : void {

        if(typeof alias === "string") {
            this._host_alias.set(alias, host)
        }
        else {
            this._host_alias_regex.push([alias, host])
            this._known_hosts.set(host, true)
        }
    }

    set_fall_back_app (host : string|null, app : App_type) {

        if(host === null) {
            this._fall_back_app = app
        }
        else {
            this._host_fall_back_app.set(host, app)
            this._known_hosts.set(host, true)
        }
    }

    find_app (host : string|null, app_name : App_id) : App_type {

        // ホストがなければ一般ホストのルールへ
        // ホストがあれば特定のホストのルールを試みる
        if(host) {

            // 特定のホスト名を要求した。ホストが登録したかどうかをチェックする。
            if(!this._known_hosts.has(host)) {

                // ホストが見つからない場合は alias 記録によってホスト名を調整する
                const by_alias = this._host_alias.get(host)
                if(by_alias) {
                    host = by_alias
                }
                else {
                    // ホストがまだ見つからない場合は RegEx によってホスト名を調整する
                    for(let i=0; i<this._host_alias_regex.length; i++) {
                        if(this._host_alias_regex[i][0].test(host)) {
                            host = this._host_alias_regex[i][1]
                            break
                        }
                    }
                }
            }

            // ホスト名は調整した。このホストを知ってるかい？
            if(this._known_hosts.has(host)) {

                // ホストを知ってる。この特定のホストのルールを採用。
                // まずはアプリ名によって、ホスト上でアプリを検索する。
                const host_app_dict = this._host_app_use_by_name.get(host)
                if(host_app_dict) {
                    const app = host_app_dict.get(app_name)
                    if(app) return app
                }

                // アプリ名でアプリをはっきり特定できない：アプリ名は文字列の場合はRegExでアプリ名を検索（同じホストのRegExのみを使う）。
                if(typeof app_name === "string") {
                    const host_app_dict_regex = this._host_app_use_by_regex.get(host)
                    if(host_app_dict_regex) {
                        let app : App_type|null = null
                        host_app_dict_regex.forEach(rule => rule[0].test(app_name) ? (app = rule[1]) : void null)
                        if(app) return app
                    }
                }

                // RegExを使ってもアプリが見つからない、またはアプリ名はsymbol：fallbackアプリを使う。
                const fallback_app = this._host_fall_back_app.get(host)
                if(fallback_app) return fallback_app

                // ホスト関連のfallbackがない場合：一般ホストのルールを採用。ifブランチを抜け出す。
            }
        }

        // ホストを知っていない。また、ホストを知ったけどアプリもfallbackもない。
        // まずはアプリ名によって、一般ホストのアプリを検索する。
        const app1 = this._app_use_by_name.get(app_name)
        if(app1) return app1

        // アプリ名でアプリをはっきり特定できない：アプリ名は文字列の場合はRegExでアプリ名を検索（一般ホスト）。
        if(typeof app_name === "string") {
            let app2 : App_type|null = null
            this._app_use_by_regex.forEach(rule => rule[0].test(app_name) ? (app2 = rule[1]) : void null)
            if(app2) return app2
        }

        // RegExを使ってもアプリが見つからない、またはアプリ名はsymbol：fallbackアプリを使う。
        if(this._fall_back_app) return this._fall_back_app
        else throw new Error("App finder has no fallback")  // fallbackがなければ大変(constructorに設置したはずけど)。エラーを投げる
    }

    private bind_app_1(host : string, app_name : App_id, app : App_type) : void {

        // ホストがすでにセットされた場合：NAMEーAPPマップをゲット。でなければ新しいマップを生成。
        // セット済みのマップをホストアプリマップに入らせる。これは、すでにマップがセットされても問題ない。
        const host_map = this._host_app_use_by_name.get(host) || new Map<App_id, App_type>()
        host_map.set(app_name, app)
        this._host_app_use_by_name.set(host, host_map)
    }

    private bind_app_2(host : string, app_name : RegExp, app : App_type) : void {

        // 同じパターンです。
        const arr = this._host_app_use_by_regex.get(host) || []
        arr.push([app_name, app])
        this._host_app_use_by_regex.set(host, arr)
    }

    private bind_app_3(host : null, app_name : App_id, app : App_type) : void {

        this._app_use_by_name.set(app_name, app)
    }

    private bind_app_4(host : null, app_name : RegExp, app : App_type) : void {

        this._app_use_by_regex.push([app_name, app])
    }
}

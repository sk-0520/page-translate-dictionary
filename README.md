# page-translation-dictionary

夢語るだけのREADME。

## Build

### Node

* node: `18.4.0`

### Firefox

```cmd
npm ci
npm run build:firefox
npm run output:firefox
cd dist/web-ext-artifacts
```

### Chrome

```cmd
npm ci
npm run build:chrome
npm run output:chrome
cd dist/web-ext-artifacts
```

## やりたいこと

* ブラウザ拡張機能
  * Fx だけでいい
* ページの翻訳処理を行う
* 特定のページに対するパターン定義を取り込んで翻訳する
  * 翻訳者がしんどい
  * ユーザーは自然に読める

## なぜ作るか

* 公式で日本語訳ページを作る企業あんまないでしょ
* 原文を自分で読んでも翻訳サイト使っても機微が分からん
  * 翻訳先言語の多数の目があれば、とは思いつつ誰が訳すねんっていうね

## manifest.json/package.json の関係

| manifest.json | package.json | その他 |
|:---:|:---:|:---|
| `name` | - | `locale: ext_name` |
| `short_name` | `name` | ローカライズしない想定。 `HTTP-HEADER: X-Extension` としても使用される |
| `version` | `version` |  |
| `description` | `description` | `locale: ext_description` |

* 基本的に package.json データを元に manifest.json を組み立てる
  * 項目が重複するものは package.json を正として楽ちん管理したい
* バージョンアップ時は `version` だけ変えて運用したい

### .npmrc

* `npm scripts` の `*-env` 系スクリプトはプロジェクトディレクトリ直下の `.npmrc` の環境変数を使用する。
  * **注意** 前提をいきなり覆すが、 Chrome を実行する場合 `PTD_CHROME_APPLICATION` の設定は必須となる
* `.npmrc` を使用する場合、正しいパス・設定が行われている前提となる
* Windows で動かすことが前提となっていることに注意

```properties
# npm scripts: *-env 系の環境を設定
# 変数名の先頭に PTD_ を付与すること
# 環境変数自体は

# Firefox 設定
# プロファイルディレクトリ
PTD_FIREFOX_PROFILE_DIRECTORY=X:\fx

# Chrome 設定
# アプリパス
PTD_CHROME_APPLICATION=C:\Program Files\Google\Chrome\Application\chrome.exe
# プロファイルディレクトリ
PTD_CHROME_PROFILE_DIRECTORY=X:\ch
```

## 設定項目

```jsonc
{
  // 名前
  "name": "example trans",
  // バージョン
  "version": "YYYY-MM-DD/x.xx.xxx",
  // 対象ドメイン
  "hosts": [
    "example.com",
    "www.example.com"
  ],
  // 設定情報
  "information": {
    "website": "https://",
    "repository": "https://",
    "document": "https://"
  },
  // 優先度 0: 通常, 低 < 0 < 高
  "priority": 0,
  // 変換先言語
  "language": "ja-JP",
  "event": {
    "window": [
      // window 監視対象イベント
    ],
    "document": [
      // document 監視対象イベント
      "pjax:end",
    ],
  },
  // パス
  "path": {
    // 対象パス(正規表現)
    "/": {
      // パスにクエリ部分を含めるか
      "with_search": true,
      // セレクタに対する処理
      "query": [
        // ID 指定
        {
          "selector": {
            // 該当する <meta name=* content=*> に全条件を満たす場合にセレクタが使用される。
            "meta": {
              // 判定方法
              //  partial: 部分一致
              //  forward: 前方一致
              //  backward: 後方一致
              //  perfect: 完全一致
              //  regex: 正規表現
              //  ignore: パターンを無視
              "mode": "partial",
              // 大文字小文字を区別するか
              "ignore_case": true,
              // パターン
              "pattern": "pattern",
            },
            // セレクタ種別
            //  normal: 通常
            //  common: 共通
            "mode": "normal",
            "value": "#id",
            // テキストノードの指定。 childNodes の #text だけを集計した 1 基底の番号: <span>[1]<br />[2]<br />[3]</span>
            // 負数を指定した場合は全テキストノードが対象となる(matchesによる制御を想定)
            // `-1` を指定すれば一致時点で後続終了、`-2`(負数-1未満) を指定した場合はすべて処理。
            "node": 3,
            // セレクタを全要素に適用するか
            "all": false,
            // 対象用を監視対象とするか
            "watch": false,
          },
          // 対象要素の (Element/Text).textContent
          "text": {
            "filter": {
              // 改行をどう扱うか
              //  join: 半角スペース1つに置き換える
              //  raw: そのまま
              "line_break": "join",
              // 改行以外のホワイトスペースの扱い
              //  join: 半角スペース1つに置き換える
              //  raw: そのまま
              "white_space": "",
              // トリムを実施するか
              "trim": true,
            },
            // 条件
            "matches": [
                {
                // 判定方法
                //  partial: 部分一致
                //  forward: 前方一致
                //  backward: 後方一致
                //  perfect: 完全一致
                //  regex: 正規表現 (?<NAME>) 使用可能
                "mode": "partial",
                // 大文字小文字を区別するか
                "ignore_case": true,
                // パターン
                "pattern": "pattern",
                "replace": {
                  // 置き換え方法
                  //  normal: 通常
                  //  common: 共通
                  "mode": "normal",
                  // 条件が正規表現の場合で指定がある場合 `(?<NAME>)` を `$<NAME>` で使用可能
                  "value": "text",
                  // 条件が正規表現の場合にキャプチャグループ名に対する置き換え文字列を指定(未指定・一致しない場合にもと文字列)
                  "regex": {
                    // キャプチャグループ名
                    "NAME": {
                      // キャプチャした文字列に対する置き換え
                      "A": "aaa",
                      "B": "bbb",
                    }
                  }
                }
              }
            ],
            // 置き換え(matches に該当しない場合)
            "replace": {
              "mode": "normal",
              "value": "text",
            }
          },
          // 対象要素の属性
          "attributes": {
            // 属性名
            "attribute-name": {
              // 属性値
            }
          }
        },
        {
          "selector": {
            "value": "html .class > child + next child[data-custom='xxx'] input",
          }
          // 置き換え処理
        },
        {
          // 共通セレクタの使用
          "selector": {
            "mode": "common",
            "value": "common-nav-logout",
          },
          "text": {
            "replace": {
              // 共通テキストの使用
              "mode": "common",
              "value": "common-nav-logout"
            }
          }
        }
      ],
      // 共通クエリの使用
      "import": [
        "common-query"
      ]
    }
  },
  // 共通設定
  "common": {
    // 共通セレクタ設定
    "selector": {
      "common-nav-logout": "nav a.logout",
    },
    // 共通テキスト設定
    "text": {
      "common-nav-logout": "ログアウト",
    },
    // 共通クエリ設定
    "query": {
      "common-query": {
        "selector": {
        },
        "text": {
        }
      }
    }
  }
}
```

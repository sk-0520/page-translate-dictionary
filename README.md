# page-translation-dictionary

夢語るだけのREADME。

## やりたいこと

* ブラウザ拡張機能
  * Fx だけでいい
* ページの翻訳処理を行う
* 特定のページに対するパターン定義を取り込んで翻訳する
  * 翻訳者がしんどい
  * ユーザーは自然に読める
*

## なぜ作るか

* 公式で日本語訳ページを作る企業あんまないでしょ
* 原文を自分で読んでも翻訳サイト使っても機微が分からん
  * 翻訳先言語の多数の目があれば、とは思いつつ誰が訳すねんっていうね

## Node

* node: `18.4.0`

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
  "level": 0,
  // 変換先言語
  "language": "ja-JP",
  // パス
  "path": {
    // 対象パス(正規表現)
    "/": {
      // パスにクエリ部分を含めるか
      "withSearch": true,
      // セレクタに対する処理
      "query": [
        // ID 指定
        {
          "selector": {
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
            "all": false
          },
          // 対象要素の (Element/Text).textContent
          "text": {
            "filter": {
              // 改行をどう扱うか
              //  join: 半角スペース1つに置き換える
              //  raw: そのまま
              "lineBreak": "join",
              // 改行以外のホワイトスペースの扱い
              //  join: 半角スペース1つに置き換える
              //  raw: 半角スペース1つに置き換える
              "whiteSpace": "",
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
                "ignoreCase": true,
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
          // 対象要素の value 値
          "value": {
            // value を持つものだけ
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

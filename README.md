# page-translate

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
  "domain": "(www\\.)?example\\.(com)|(net)",
  // 優先度 0: 通常, 低 < 0 < 高
  "level": 0,
  // 変換先言語
  "language": "ja-JP",
  // パス
  "path": {
    // 対象パス(正規表現)
    "/": {
      // セレクタに対する処理
      "selector": {
        // ID 指定
        "#id": {
          // 対象要素の textContent
          "text": {
            "filter": {
              // トリムを実施するか
              "trim": true,
              // 改行以外のホワイトスペースの扱い
              //  join: 半角スペース1つに置き換える
              //  raw: 半角スペース1つに置き換える
              "whiteSpace": "",
              // 改行をどう扱うか
              //  join: 半角スペース1つに置き換える
              //  raw: そのまま
              "lineBreak": "join"
            },
            // 条件
            "match": {
              // 判定方法
              //  partial: 部分一致
              //  forward: 前方一致
              //  backward: 後方一致
              //  regex: 正規表現 ?<NAME> 使用可能
              "mode": "partial",
              // 大文字小文字を区別するか
              "ignoreCase": true,
              // パターン
              "pattern": "pattern"
            },
            "replace": {
              // 置き換え方法
              //  normal: 通常
              //  common: 共通
              "mode": "normal",
              // 置き換え文字列 match が正規表現の場合で指定がある場合 ${NAME} を使用可能
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
        "html .class > child + next child[data-custom='xxx'] input" {
          // 置き換え処理
        },
        // 共通セレクタの使用
        "{common-nav-logout}" {
          "text": {
            "replace": {
              // 共通テキストの使用
              "mode": "common",
              "value": "common-nav-logout"
            }
          }
        }
      }
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
    }
  }
}
```

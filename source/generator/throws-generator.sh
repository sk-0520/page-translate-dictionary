#!/bin/bash -ue

BASE_DIR="$(cd $(dirname $0); pwd)"

OUTPUT_FILE="${BASE_DIR}/../scripts/core/throws.ts"
MANUAL_FILE="${BASE_DIR}/throws-manual.ts"

AUTO_ERROR_LIST='
NotImplementedError,Error,未実装
NotSupportedError,Error,実装が存在しない
InvalidOperationError,Error,不正処理
MismatchArgumentError,Error,引数指定が異常
ArgumentError,Error,引数が無効
ParseError,Error,パース系処理失敗
DomError,Error,DOM処理云々がダメ
ElementTypeError,DomError,指定要素の型が合わない
NotFoundDomSelectorError,DomError,セレクタで要素が見つからない
'
AUTO_ERRORS=(`echo $AUTO_ERROR_LIST`)

TIMESTMAP=`date --iso-8601="seconds"`
cat <<EOS > ${OUTPUT_FILE}
// エラー系
// GEN: ${TIMESTMAP}

// 手動 ---------------------

EOS

cat ${MANUAL_FILE} >> ${OUTPUT_FILE}
echo "" >> ${OUTPUT_FILE}
echo "// 自動 ---------------------" >> ${OUTPUT_FILE}
echo "" >> ${OUTPUT_FILE}

for (( i = 0; i < ${#AUTO_ERRORS[@]}; ++i )); do
	ERROR_ITEMS=(${AUTO_ERRORS[$i]//,/ })
	ERROR=${ERROR_ITEMS[0]}
	SUPER=${ERROR_ITEMS[1]}
	SUBJECT=${ERROR_ITEMS[2]}
	cat << EOS >> ${OUTPUT_FILE}
/**
* ${SUBJECT}
 */
export class ${ERROR} extends ${SUPER} {
	constructor(message?: string | undefined) {
		super(message);
		this.name = '${ERROR}';
	}
}

EOS
done;


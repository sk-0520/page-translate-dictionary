#!/bin/bash -ue

BASE_DIR="$(cd $(dirname $0); pwd)"

OUTPUT_DIR="${BASE_DIR}/../entry"

ENTRY_LIST='
application-options,options
background,background
page-content,page
popup-action,popup
setting-editor,editor
'
ENTRIES=(`echo $ENTRY_LIST`)

MODES="development production"
BROWSER_KINDS="firefox chrome"

TIMESTMAP=`date --iso-8601="seconds"`

for (( i = 0; i < ${#ENTRIES[@]}; ++i )); do
	ENTRY_ITEMS=(${ENTRIES[$i]//,/ })
	ENTRY_FILE_NAME=${ENTRY_ITEMS[0]}
	ENTRY_BASE_NAME=${ENTRY_ITEMS[1]}

	for MODE in ${MODES} ; do
		for BROWSER_KIND in ${BROWSER_KINDS} ; do

			IS_PRODUCTION=false
			if [ $MODE == production ] ; then
				IS_PRODUCTION=true
			fi

			SCRIPT_FILE_NAME="${ENTRY_FILE_NAME}@${BROWSER_KIND}_${MODE}.ts"
			SCRIPT_FILE_PATH="${OUTPUT_DIR}/${SCRIPT_FILE_NAME}"

			cat <<EOS > $SCRIPT_FILE_PATH
// GEN: ${TIMESTMAP}
// Mode: ${MODE}
// Browser: ${BROWSER_KIND}
import * as ${ENTRY_BASE_NAME} from '../scripts/extension/${ENTRY_BASE_NAME}/${ENTRY_BASE_NAME}';
import * as extensions from '../scripts/extension/extensions';

${ENTRY_BASE_NAME}.boot(new extensions.Extension(extensions.BrowserKind.${BROWSER_KIND^}, ${IS_PRODUCTION}));

EOS
		done
	done

done;

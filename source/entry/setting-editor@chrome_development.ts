// Mode: development
// Browser: chrome
// GEN: 2022-12-06T19:06:10+09:00
import * as editor from '../scripts/extension/editor/editor';
import * as extensions from '../scripts/extension/extensions';

editor.boot(new extensions.Extension(extensions.BrowserKind.Chrome, false));


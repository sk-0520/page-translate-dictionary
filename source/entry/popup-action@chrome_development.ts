// Mode: development
// Browser: chrome
// GEN: 2022-12-06T19:06:10+09:00
import * as popup from '../scripts/extension/popup/popup';
import * as extensions from '../scripts/extension/extensions';

popup.boot(new extensions.Extension(extensions.BrowserKind.Chrome, false));


// Mode: production
// Browser: chrome
// GEN: 2022-12-06T19:06:10+09:00
import * as background from '../scripts/extension/background/background';
import * as extensions from '../scripts/extension/extensions';

background.boot(new extensions.Extension(extensions.BrowserKind.Chrome, true));


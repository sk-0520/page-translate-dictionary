// Mode: production
// Browser: chrome
// GEN: 2022-12-06T19:06:10+09:00
import * as options from '../scripts/extension/options/options';
import * as extensions from '../scripts/extension/extensions';

options.boot(new extensions.Extension(extensions.BrowserKind.Chrome, true));


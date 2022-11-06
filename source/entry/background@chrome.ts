import * as background from '../scripts/extension/background/background';
import * as extensions from '../scripts/extension/extensions';

background.boot(new extensions.Extension(extensions.BrowserKind.Chrome));

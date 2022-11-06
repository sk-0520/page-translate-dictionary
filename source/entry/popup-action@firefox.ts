import * as popup from '../scripts/extension/popup/popup';
import * as extensions from '../scripts/extension/extensions';

popup.boot(new extensions.Extension(extensions.BrowserKind.Firefox));

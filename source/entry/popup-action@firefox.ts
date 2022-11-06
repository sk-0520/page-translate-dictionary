import * as action from '../scripts/extension/action/action';
import * as extensions from '../scripts/extension/extensions';

action.boot(new extensions.Extension(extensions.BrowserKind.Firefox));

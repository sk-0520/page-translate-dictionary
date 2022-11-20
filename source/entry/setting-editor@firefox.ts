import * as editor from '../scripts/extension/editor/editor';
import * as extensions from '../scripts/extension/extensions';

editor.boot(new extensions.Extension(extensions.BrowserKind.Firefox));

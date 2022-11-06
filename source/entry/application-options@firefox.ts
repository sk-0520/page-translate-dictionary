import * as options from '../scripts/extension/options/options';
import * as extensions from '../scripts/extension/extensions';

options.boot(new extensions.Extension(extensions.BrowserKind.Firefox));

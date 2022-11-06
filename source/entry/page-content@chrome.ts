import * as page from '../scripts/extension/page/page';
import * as extensions from '../scripts/extension/extensions';

page.boot(new extensions.Extension(extensions.BrowserKind.Chrome));

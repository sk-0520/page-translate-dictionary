import * as extensions from '../extensions';

export default abstract class Wrapper {
	constructor(protected readonly extension: extensions.Extension) {
	}
}

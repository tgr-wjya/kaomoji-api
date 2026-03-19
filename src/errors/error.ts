/**
 * Custom Error Class
 *
 * @author Tegar Wijaya Kusuma
 * @date 19 March 2026
 */

export class KaomojiNotFound extends Error {
	status = 404;
	constructor() {
		super("Kaomoji Not Found");
	}
}

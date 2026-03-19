/**
 * kaomojiService() class
 *
 * @author Tegar Wijaya Kusuma
 * @date 19 March 2026
 */

import { KAOMOJI_COLLECTION } from "../types";

export class kaomojiService {
	private readonly kaomoji = KAOMOJI_COLLECTION;

	getRandom() {
		const randomKaomoji =
			this.kaomoji[Math.floor(Math.random() * this.kaomoji.length)];
		return randomKaomoji;
	}

	getAll() {
		return this.kaomoji;
	}
}

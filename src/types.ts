/**
 * Interface for Kaomoji API
 *
 * @author Tegar Wijaya Kusuma
 * @date 19 March 2026
 */

export interface Kaomoji {
	kaomoji: string;
	name: string;
}

// TODO: Add shared request/response schemas here only if route validation starts to duplicate shape definitions.
// TODO: If the custom not-found error grows beyond kaomoji, move it to a dedicated domain/error file instead.
export const KAOMOJI_COLLECTION: Kaomoji[] = [
	{ kaomoji: "ᵔᴥᵔ", name: "happy bear" },
	{ kaomoji: "◉‿◉", name: "big eyes" },
	{ kaomoji: "(｡◕‿◕｡)", name: "cute smile" },
	{ kaomoji: "ʘ‿ʘ", name: "innocent" },
	{ kaomoji: "¯\\_(ツ)_/¯", name: "shrug" },
	{ kaomoji: "ʕ•ᴥ•ʔ", name: "bear friend" },
	{ kaomoji: "(☞ﾟヮﾟ)☞", name: "finger guns right" },
	{ kaomoji: "☜(ﾟヮﾟ☜)", name: "finger guns left" },
	{ kaomoji: "( ͡° ͜ʖ ͡°)", name: "lenny" },
	{ kaomoji: "༼ つ ◕_◕ ༽つ", name: "give me" },
	{ kaomoji: "(⌐■_■)", name: "deal with it" },
	{ kaomoji: "(づ｡◕‿‿◕｡)づ", name: "hug coming" },
	{ kaomoji: "(╯°□°)╯︵ ┻━┻", name: "table flip" },
	{ kaomoji: "ಠ_ಠ", name: "look of disapproval" },
	{ kaomoji: "ლ(ಠ益ಠλ)", name: "why" },
	{ kaomoji: "(ノಠ益ಠ)ノ彡┻━┻", name: "angry table flip" },
	{ kaomoji: "ಥ_ಥ", name: "cry" },
	{ kaomoji: "┬─┬ノ( º _ ºノ)", name: "table respect" },
	{ kaomoji: "༼ຈل͜ຈ༽", name: "lenny creeper" },
	{ kaomoji: "ᕦ(ò_óˇ)ᕤ", name: "buff" },
	{ kaomoji: "(つ ͡° ͜ʖ ͡°)つ", name: "come at me" },
];

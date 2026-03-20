/**
 * Type interface for Test Runner.
 *
 * @author Tegar Wijaya Kusuma
 * @date 20 March 2026
 */

export interface AllError {
	error: string;
	timestamp: string;
}

export interface WildcardError extends AllError {
	availableEndpoints: string[];
}

export interface ElysiaValidationError {
	type: "validation";
	on: "params" | "body" | "query" | "headers";
	property: string;
	errors: unknown[];
}

export const availableEndpointsArray = [
	"GET  /api/pet-count",
	"POST /api/pet",
	"GET  /api/kaomoji",
	"GET  /api/kaomoji/all",
	"GET  /api/kaomoji/:id",
	"GET  /api/kaomoji/search?q=",
];

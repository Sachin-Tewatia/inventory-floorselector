/**
 * Utility for normalizing navigation targets from the chatbot.
 * Ensures backend-provided paths are converted into the application's expected route format.
 */

// Tower mapping for aliases and shorthand
const TOWER_MAP = {
    "titan": "cluster10",
    "titanium": "cluster10",
    // Add more aliases as needed
};

/**
 * Normalizes a navigation target string into a valid application route.
 * 
 * Expected standard routes:
 * - /inspire
 * - /inspire/tower/:tower
 * - /inspire/tower/:tower/floor/:floor
 * - /inspire/unit/:unit
 * - /inspire/vr-tour
 */
export const normalizeNavigationTarget = (target, projectId) => {
    if (!target) return target;
    // 1. Pre-processing: Handle JSON strings and cleanup
    let input = target.toString().trim();
    if (input.startsWith("{")) {
        try {
            const parsed = JSON.parse(input);
            input = parsed.target || parsed.navigation_target || input;
        } catch (e) { /* Not JSON */ }
    }

    // Return external URLs as is
    if (input.startsWith("http")) return input;

    // 2. Identify the intent parts (tower, floor, unit, etc.)
    // We decompose the path and reconstruct it based on rules
    const parts = input.toLowerCase().split("/").filter(p => p && p !== projectId && p !== "project" && p !== "salarpuria");
    let towerId = null;
    let floorId = null;
    let unitId = null;
    let isVRTour = input.toLowerCase().includes("vr");

    // Special handling for direct floor paths like "floor/t8_3"
    if (parts.length === 2 && parts[0] === "floor" && parts[1].includes("_")) {
        const [t, f] = parts[1].split("_");
        towerId = t;
        floorId = f;
    } else {
        // Scan parts for identifiers
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];

            // Handle common shorthand like "t8_3" or "titan_3"
            if (part.includes("_")) {
                const [t, f] = part.split("_");
                if (t) {
                    towerId = t;
                }
                if (f) {
                    floorId = f;
                }
                continue;
            }

            if (part === "tower" && parts[i + 1]) {
                towerId = parts[++i];
            } else if (part === "floor" && parts[i + 1]) {
                floorId = parts[++i];
            } else if (part === "unit" && parts[i + 1]) {
                unitId = parts[++i];
            } else if (part.startsWith("cluster") || (part.startsWith("t") && /\d/.test(part))) {
                towerId = part;
            }
        }
    }

    // 3. Normalize identifiers
    if (towerId) {
        // Apply manual mappings (e.g. titan -> cluster10)
        if (TOWER_MAP[towerId]) {
            towerId = TOWER_MAP[towerId];
        }

        // Standardize "t8" to "cluster8"
        const numMatch = towerId.match(/\d+/);
        if (numMatch && towerId.startsWith("t")) {
            towerId = `cluster${numMatch[0]}`;
        }
    }

    // 4. Reconstruct path according to application routes
    let result = "/inspire";

    if (unitId) {
        result += `/unit/${unitId}`;
        if (isVRTour) result += `/vr-tour`;
    } else if (towerId) {
        result += `/tower/${towerId}`;
        if (floorId) {
            result += `/floor/${floorId}`;
        }
    } else if (isVRTour) {
        result += `/vr-tour`;
    }

    result = result.replace(/\/+/g, "/");
    return result;
};

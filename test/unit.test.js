import { generateGameId } from "../frontend/scripts/createGame";
import { generateUserId } from "../frontend/scripts/register";

import { assert, expect, test, it} from "vitest";

// Test cases must be wrapped in a test function
test("Generates size 6 game id with correct chars", () => {
    const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let gameId = generateGameId();
    expect(gameId.length).toBe(6);

    for(let i = 0; i<6; i++) {
        assert(char.includes(gameId[i]))
    }
});


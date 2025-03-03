import { generateGameId } from "../frontend/scripts/createGame";
import { assert, expect, test, it} from "vitest";

// Test cases must be wrapped in a test function
test("Generates correct game id", () => {
    const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789"
    expect(generateGameId().length).toBe(6);

    for(let i = 0; i<6; i++) {
        char.includes(generateGameId()[i])
    }
});

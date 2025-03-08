import {generateBattleNumber } from "../frontend/scripts/createGame";
import "../frontend/scripts/login";
import "../frontend/scripts/register";
import "../frontend/scripts/cookies";
import "../frontend/scripts/game.js";
import "../frontend/scripts/settings.js";
import "../frontend/scripts/state.js";

import { assert, expect, test, it} from "vitest";

// Test cases must be wrapped in a test function
test("Generates size 6 battle number with correct chars", () => {
    const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let battleNumber = generateBattleNumber();
    expect(battleNumber.length).toBe(6);

    // run test 1000 times
    for (let i = 0; i < 1000; i++) {
        for(let i = 0; i<6; i++) {
            assert(char.includes(battleNumber[i]))
        }
    }
});


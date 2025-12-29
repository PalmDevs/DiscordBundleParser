import { describe, expect, it } from "vitest";

import { getFile } from "./__test__/testingUtil";
import { GlobalEnvParser } from "./GlobalEnvParser";

describe("GlobalEnvParser", () => {
    it("parses an example discord buildenv correctly", () => {
        const parser = new GlobalEnvParser(getFile("exampleEnv.js"));
        const env = parser.getGlobalEnvObject();

        expect(env).toMatchSnapshot();
    });
});

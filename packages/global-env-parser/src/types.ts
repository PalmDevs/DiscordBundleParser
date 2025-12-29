import type { GlobalEnvParser } from "./GlobalEnvParser";

/**
 * @internal
 */
export interface NonLiteral {
    [GlobalEnvParser.SYM_UNSERIALIZABLE]: true;
    expression: string;
}

export type MaybeLiteralJsonType = JsonType | NonLiteral;
export type JsonType
    = | string
      | number
      | boolean
      | null
      | NonLiteral
      | MaybeLiteralJsonType[]
      | { [key: string]: MaybeLiteralJsonType; };

export type EnvBuildVars = Record<string, JsonType> & { [GlobalEnvParser.SYM_UNREADABLE_KEYS]: string[]; };

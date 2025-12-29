import { isPropertyAssignment, type ObjectLiteralElementLike, type ObjectLiteralExpression } from "typescript";

import { AstParser, isFunctionish, nonNull, tryParseStringOrNumberLiteral } from "@vencord-companion/ast-parser";
import { Cache } from "@vencord-companion/shared/decorators";

import type { ModuleEntry } from "./types";

function fromEntries<
    K extends PropertyKey,
    V,
>(obj: Record<K, V>, [k, v]: NoInfer<readonly [K, V]>, _idx: number, _arr: readonly [K, V][]): Record<K, V> {
    obj[k] = v;
    return obj;
}

export abstract class WebpackChunkParser extends AstParser {
    abstract getModuleObject(): ObjectLiteralExpression | undefined;

    private tryParseChunkEntry(entry: ObjectLiteralElementLike): ModuleEntry | undefined {
        if (!isPropertyAssignment(entry)) {
            return;
        }

        const moduleId = tryParseStringOrNumberLiteral(entry.name);

        if (!moduleId) {
            return;
        }

        const moduleValue = entry.initializer;

        if (!isFunctionish(moduleValue)) {
            return;
        }

        return [moduleId, moduleValue.getText()];
    }

    @Cache()
    public getDefinedModules(): Record<string, string> | undefined {
        return this
            .getModuleObject()
            ?.properties
            .map(this.tryParseChunkEntry.bind(this))
            .filter(nonNull)
            .reduce(fromEntries<string, string>, {});
    }
}


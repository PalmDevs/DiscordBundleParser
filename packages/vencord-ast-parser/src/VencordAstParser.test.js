"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var VencordAstParser_1 = require("./VencordAstParser");
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var promises_1 = require("fs/promises");
var path_1 = require("path");
var vitest_1 = require("vitest");
var __dirname = import.meta.dirname;
var VENCORD_DIR = (0, path_1.join)(__dirname, "__test__", ".vencord-source");
var VENCORD_REV = "8807564053c7b4cc05c763e2dc7171f5d61e39c7";
function parserFor(path) {
    path = (0, path_1.join)(__dirname, "__test__", path);
    return new VencordAstParser_1.VencordAstParser((0, fs_1.readFileSync)(path, "utf-8"), path);
}
var IS_WINDOWS = process.platform === "win32";
(0, vitest_1.describe)("VencordAstParser", function () {
    return __awaiter(this, void 0, void 0, function () {
        var pluginParsers, _a, _b;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, ensureVencordDownloaded()];
                case 1:
                    _c.sent();
                    _b = (_a = Promise).all;
                    return [4 /*yield*/, collectPluginPaths()];
                case 2: return [4 /*yield*/, _b.apply(_a, [(_c.sent()).map(function (path) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = VencordAstParser_1.VencordAstParser.bind;
                                    return [4 /*yield*/, (0, promises_1.readFile)(path, "utf-8")];
                                case 1: return [2 /*return*/, new (_a.apply(VencordAstParser_1.VencordAstParser, [void 0, _b.sent(), path]))()];
                            }
                        }); }); })])];
                case 3:
                    pluginParsers = _c.sent();
                    (0, vitest_1.describe)("getPluginName", function () {
                        (0, vitest_1.it)("parses all plugin names to non-null values", function () {
                            for (var _i = 0, pluginParsers_1 = pluginParsers; _i < pluginParsers_1.length; _i++) {
                                var parser = pluginParsers_1[_i];
                                var name_1 = parser.getPluginName();
                                (0, vitest_1.expect)(name_1, "Parsing plugin name failed for plugin at path ".concat(parser.path)).to.be.a("string");
                            }
                        });
                        (0, vitest_1.it)("parses all plugin names correctly", function () {
                            var names = pluginParsers.map(function (parser) { return parser.getPluginName(); });
                            // sort to keep snapshot sane && stable
                            (0, vitest_1.expect)(names.toSorted())
                                .toMatchSnapshot();
                        });
                        vitest_1.it.skip("gets the correct plugin name for a weird plugin", function () {
                            var parser = parserFor("pluginImports.ts");
                            (0, vitest_1.expect)(parser.getPluginName()).to.equal("2");
                        });
                    });
                    (0, vitest_1.describe)("getPatches()", function () {
                        vitest_1.it.skipIf(IS_WINDOWS)("gets the patches for all plugins", function () {
                            return __awaiter(this, void 0, void 0, function () {
                                var patches;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            patches = Object.fromEntries(pluginParsers.map(function (parser) { var _a; return [(_a = parser.getPluginName()) !== null && _a !== void 0 ? _a : vitest_1.assert.fail("Plugin name is missing"), parser.getPatches()]; }));
                                            return [4 /*yield*/, (0, vitest_1.expect)(JSON.stringify(patches, null, 4))
                                                    .toMatchFileSnapshot((0, path_1.join)(__dirname, "__snapshots__", "allPatches.json"))];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        });
                    });
                    return [2 /*return*/];
            }
        });
    });
});
function waitForProcess(process) {
    return new Promise(function (res, rej) {
        process.on("exit", function (code) {
            if (code === 0) {
                res();
            }
            else {
                rej(new Error("Child process exited with code: ".concat(code)));
            }
        });
    });
}
function ensureVencordDownloaded() {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, exists(VENCORD_DIR)];
                case 1:
                    _a = (_b.sent());
                    if (!_a) return [3 /*break*/, 3];
                    return [4 /*yield*/, isDirectory(VENCORD_DIR)];
                case 2:
                    _a = (_b.sent());
                    _b.label = 3;
                case 3:
                    if (_a) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, waitForProcess((0, child_process_1.exec)("git clone https://github.com/vendicated/vencord.git ".concat(VENCORD_DIR)))];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, waitForProcess((0, child_process_1.exec)("git checkout --detach ".concat(VENCORD_REV), {
                            cwd: VENCORD_DIR,
                        }))];
                case 5:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function resolvePluginEntrypoint(pluginEntry) {
    return __awaiter(this, void 0, void 0, function () {
        var pluginEntryPath, path;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pluginEntryPath = (0, path_1.join)(pluginEntry.parentPath, pluginEntry.name);
                    if (pluginEntry.isFile()) {
                        return [2 /*return*/, pluginEntryPath];
                    }
                    path = (0, path_1.join)(pluginEntryPath, "index.ts");
                    return [4 /*yield*/, exists(path)];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 2];
                    return [2 /*return*/, path];
                case 2: return [4 /*yield*/, exists(path = (0, path_1.join)(pluginEntryPath, "index.tsx"))];
                case 3:
                    if (_a.sent()) {
                        return [2 /*return*/, path];
                    }
                    _a.label = 4;
                case 4: throw new Error("No valid entry point found");
            }
        });
    });
}
function collectPluginPaths() {
    return __awaiter(this, void 0, void 0, function () {
        var basePluginDir, pluginDirs, _i, pluginDirs_1, dir, _a, pluginFiles;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    basePluginDir = (0, path_1.join)(VENCORD_DIR, "src", "plugins");
                    pluginDirs = [basePluginDir, (0, path_1.join)(basePluginDir, "_api"), (0, path_1.join)(basePluginDir, "_core")];
                    _i = 0, pluginDirs_1 = pluginDirs;
                    _b.label = 1;
                case 1:
                    if (!(_i < pluginDirs_1.length)) return [3 /*break*/, 4];
                    dir = pluginDirs_1[_i];
                    _a = vitest_1.assert;
                    return [4 /*yield*/, isDirectory(dir)];
                case 2:
                    _a.apply(void 0, [_b.sent()]);
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [4 /*yield*/, Promise.all(pluginDirs.map(function (dir) { return (0, promises_1.readdir)(dir, { withFileTypes: true }); }))];
                case 5:
                    pluginFiles = _b.sent();
                    return [4 /*yield*/, Promise.all(pluginFiles
                            .flat()
                            .filter(function (dir) {
                            // don't match index.ts at root of plugin tree, it's not a plugin
                            return dir.name[0] !== "_" && dir.name !== "index.ts";
                        })
                            .map(resolvePluginEntrypoint))];
                case 6: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
function exists(path) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, promises_1.stat)(path)];
                case 1: return [2 /*return*/, !!(_b.sent())];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * **PATH MUST EXIST**
 *
 * \@throws if the path doesnt exist
 *
 * use {@link exists} to check if it exists
 */
function isDirectory(path) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, promises_1.stat)(path)];
                case 1: return [2 /*return*/, (_a.sent()).isDirectory()];
            }
        });
    });
}

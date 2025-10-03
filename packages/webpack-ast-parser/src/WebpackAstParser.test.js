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
var Position_1 = require("@vencord-companion/shared/Position");
var Range_1 = require("@vencord-companion/shared/Range");
var testingUtil_1 = require("./testingUtil");
var util_1 = require("./util");
var WebpackAstParser_1 = require("./WebpackAstParser");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var posix = require("node:path/posix");
var vitest_1 = require("vitest");
var __dirname = import.meta.dirname;
(0, vitest_1.describe)("WebpackAstParser", function () {
    var normalModule = (0, testingUtil_1.getFile)("webpack/module.js");
    (0, vitest_1.it)("constructs", function () {
        new WebpackAstParser_1.WebpackAstParser(normalModule);
    });
    (0, vitest_1.describe)("module id", function () {
        (0, vitest_1.it)("parses the module ID", function () {
            var parser = new WebpackAstParser_1.WebpackAstParser(normalModule);
            (0, vitest_1.expect)(parser.moduleId).to.equal("317269");
        });
        (0, vitest_1.it)("fails to parse a malformed module id", function () {
            var parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)("webpack/badModule/badModule1.js"));
            (0, vitest_1.expect)(parser.moduleId).to.be.null;
        });
        (0, vitest_1.it)("parses the module ID", function () {
            var parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)("webpack/badModule/badModule2.js"));
            (0, vitest_1.expect)(parser.moduleId).to.be.null;
        });
    });
    (0, vitest_1.describe)("export parsing", function () {
        // TODO: add length check for wreq.d args
        (0, vitest_1.describe)("wreq.d", function () {
            (0, vitest_1.it)("parses a simple module", function () {
                var parser = new WebpackAstParser_1.WebpackAstParser(normalModule);
                var map = parser.getExportMap();
                (0, vitest_1.expect)(map).to.have.keys("TB", "VY", "ZP");
                for (var expName in map) {
                    (0, vitest_1.expect)(map[expName]).to.have.length(2);
                    // both should be truthy
                    (0, vitest_1.expect)(map[expName][0] || map[expName][1], "Both are not truthy").to.be.ok;
                }
                // the `ZP` of
                // ```js
                // n.d(t, {
                //     ZP: () => ident
                // })
                // ```
                (0, vitest_1.expect)(map.TB[0]).to.deep.equal(new Range_1.Range(4, 8, 4, 10));
                (0, vitest_1.expect)(map.VY[0]).to.deep.equal(new Range_1.Range(5, 8, 5, 10));
                (0, vitest_1.expect)(map.ZP[0]).to.deep.equal(new Range_1.Range(6, 8, 6, 10));
                // the identifier where its used
                (0, vitest_1.expect)(map.TB[1]).to.deep.equal(new Range_1.Range(162, 13, 162, 14));
                (0, vitest_1.expect)(map.VY[1]).to.deep.equal(new Range_1.Range(183, 13, 183, 14));
                (0, vitest_1.expect)(map.ZP[1]).to.deep.equal(new Range_1.Range(87, 13, 87, 14));
            });
            (0, vitest_1.it)("parses a module with a string literal export", function () {
                var parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)("webpack/wreq.d/simpleString.js"));
                var map = parser.getExportMap();
                (0, vitest_1.expect)(map).to.have.keys("STRING_EXPORT");
                (0, vitest_1.expect)(map.STRING_EXPORT).to.deep.equal([new Range_1.Range(5, 8, 5, 21), new Range_1.Range(7, 12, 7, 31)]);
            });
            (0, vitest_1.it)("parses a module with an object literal export", function () {
                var _a;
                var parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)("webpack/wreq.d/objectExport.js"));
                var map = parser.getExportMap();
                (0, vitest_1.expect)(map).to.deep.equal({
                    EO: [
                        new Range_1.Range(5, 8, 5, 10),
                        new Range_1.Range(124, 13, 124, 14),
                    ],
                    ZP: (_a = {
                            getName: [
                                new Range_1.Range(156, 8, 156, 15),
                                new Range_1.Range(53, 13, 53, 14),
                            ],
                            useName: [
                                new Range_1.Range(157, 8, 157, 15),
                                new Range_1.Range(62, 13, 62, 14),
                            ],
                            isNameConcealed: [
                                new Range_1.Range(158, 8, 158, 23),
                                new Range_1.Range(158, 25, 158, 29),
                            ],
                            getUserTag: [
                                new Range_1.Range(159, 8, 159, 18),
                                new Range_1.Range(142, 13, 142, 14),
                            ],
                            useUserTag: [
                                new Range_1.Range(160, 8, 160, 18),
                                new Range_1.Range(160, 20, 160, 34),
                            ],
                            getFormattedName: [
                                new Range_1.Range(164, 8, 164, 24),
                                new Range_1.Range(81, 13, 81, 14),
                            ],
                            getGlobalName: [
                                new Range_1.Range(165, 8, 165, 21),
                                new Range_1.Range(72, 13, 72, 14),
                            ],
                            humanizeStatus: [
                                new Range_1.Range(166, 8, 166, 22),
                                new Range_1.Range(90, 13, 90, 14),
                            ],
                            useDirectMessageRecipient: [
                                new Range_1.Range(167, 8, 167, 33),
                                new Range_1.Range(147, 13, 147, 14),
                            ]
                        },
                        _a[WebpackAstParser_1.WebpackAstParser.SYM_CJS_DEFAULT] = [new Range_1.Range(155, 12, 155, 13)],
                        _a),
                });
            });
            (0, vitest_1.it)("parses a module with an exported object with a computed property", function () {
                var _a, _b;
                var parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)("webpack/wreq.d/computedPropInObj.js"));
                var map = parser.getExportMap();
                (0, vitest_1.expect)(map).to.deep.equal({
                    Z: (_a = {
                            "[n(231338).Et.GET_PLATFORM_BEHAVIORS]": (_b = {
                                    handler: [
                                        new Range_1.Range(8, 12, 8, 19),
                                        new Range_1.Range(8, 21, 8, 26),
                                    ]
                                },
                                _b[WebpackAstParser_1.WebpackAstParser.SYM_CJS_DEFAULT] = [new Range_1.Range(7, 47, 7, 48)],
                                _b)
                        },
                        _a[WebpackAstParser_1.WebpackAstParser.SYM_CJS_DEFAULT] = [new Range_1.Range(6, 12, 6, 13)],
                        _a),
                });
            });
            (0, vitest_1.it)("parses a module with a class export", function () {
                var _a;
                var parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)("webpack/wreq.d/classExport.js"));
                var map = parser.getExportMap();
                (0, vitest_1.expect)(map).to.deep.equal({
                    U: (_a = {
                            isDispatching: [new Range_1.Range(35, 8, 35, 21)],
                            dispatch: [new Range_1.Range(38, 8, 38, 16)],
                            dispatchForStoreTest: [new Range_1.Range(55, 8, 55, 28)],
                            flushWaitQueue: [new Range_1.Range(60, 8, 60, 22)],
                            _dispatchWithDevtools: [new Range_1.Range(88, 8, 88, 29)],
                            _dispatchWithLogging: [new Range_1.Range(91, 8, 91, 28)],
                            _dispatch: [new Range_1.Range(112, 8, 112, 17)],
                            addInterceptor: [new Range_1.Range(127, 8, 127, 22)],
                            wait: [new Range_1.Range(130, 8, 130, 12)],
                            subscribe: [new Range_1.Range(134, 8, 134, 17)],
                            unsubscribe: [new Range_1.Range(139, 8, 139, 19)],
                            register: [new Range_1.Range(144, 8, 144, 16)],
                            createToken: [new Range_1.Range(147, 8, 147, 19)],
                            addDependencies: [new Range_1.Range(150, 8, 150, 23)]
                        },
                        _a[WebpackAstParser_1.WebpackAstParser.SYM_CJS_DEFAULT] = [
                            new Range_1.Range(5, 8, 5, 9),
                            new Range_1.Range(34, 10, 34, 11),
                            new Range_1.Range(153, 8, 153, 19),
                        ],
                        _a),
                });
            });
        });
        (0, vitest_1.describe)("e.exports", function () {
            (0, vitest_1.it)("parses a module with an object literal export (class names)", function () {
                var _a;
                var parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)("webpack/e.exports/objLiteral.js"));
                var map = parser.getExportMap();
                (0, vitest_1.expect)(map).to.deep.equal((_a = {
                        productListingsHeader: [
                            new Range_1.Range(5, 8, 5, 29),
                            new Range_1.Range(5, 31, 5, 61),
                        ],
                        productListings: [
                            new Range_1.Range(6, 8, 6, 23),
                            new Range_1.Range(6, 25, 6, 49),
                        ],
                        addButton: [
                            new Range_1.Range(7, 8, 7, 17),
                            new Range_1.Range(7, 19, 7, 37),
                        ],
                        addButtonInner: [
                            new Range_1.Range(8, 8, 8, 22),
                            new Range_1.Range(8, 24, 8, 47),
                        ]
                    },
                    _a[WebpackAstParser_1.WebpackAstParser.SYM_CJS_DEFAULT] = [new Range_1.Range(4, 16, 4, 17)],
                    _a));
            });
            (0, vitest_1.it)("parses a single string export", function () {
                var _a;
                var parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)("webpack/e.exports/string.js"));
                var map = parser.getExportMap();
                (0, vitest_1.expect)(map).to.deep.equal((_a = {},
                    _a[WebpackAstParser_1.WebpackAstParser.SYM_CJS_DEFAULT] = [new Range_1.Range(4, 16, 4, 46)],
                    _a));
            });
            (0, vitest_1.it)("parses a re-export", function () {
                var _a;
                var parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)("webpack/e.exports/identReExport.js"));
                var map = parser.getExportMap();
                (0, vitest_1.expect)(map).to.deep.equal((_a = {},
                    _a[WebpackAstParser_1.WebpackAstParser.SYM_CJS_DEFAULT] = [new Range_1.Range(4, 12, 4, 21)],
                    _a));
            });
            (0, vitest_1.it)("parses exports in an intermediate variable", function () {
                var _a;
                var parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)("webpack/e.exports/ident.js"));
                var map = parser.getExportMap();
                (0, vitest_1.expect)(map).to.deep.equal((_a = {
                        headerContainer: [
                            new Range_1.Range(5, 8, 5, 23),
                            new Range_1.Range(5, 25, 5, 49),
                        ],
                        closeContainer: [
                            new Range_1.Range(6, 8, 6, 22),
                            new Range_1.Range(6, 24, 6, 47),
                        ],
                        closeIcon: [
                            new Range_1.Range(7, 8, 7, 17),
                            new Range_1.Range(7, 19, 7, 37),
                        ],
                        headerImage: [
                            new Range_1.Range(8, 8, 8, 19),
                            new Range_1.Range(8, 21, 8, 41),
                        ],
                        headerImageContainer: [
                            new Range_1.Range(9, 8, 9, 28),
                            new Range_1.Range(9, 30, 9, 59),
                        ],
                        confirmationContainer: [
                            new Range_1.Range(10, 8, 10, 29),
                            new Range_1.Range(10, 31, 10, 61),
                        ],
                        purchaseConfirmation: [
                            new Range_1.Range(11, 8, 11, 28),
                            new Range_1.Range(11, 30, 11, 88),
                        ],
                        confirmationTitle: [
                            new Range_1.Range(12, 8, 12, 25),
                            new Range_1.Range(12, 27, 12, 53),
                        ],
                        confirmationSubtitle: [
                            new Range_1.Range(13, 8, 13, 28),
                            new Range_1.Range(13, 30, 13, 59),
                        ]
                    },
                    _a[WebpackAstParser_1.WebpackAstParser.SYM_CJS_DEFAULT] = [new Range_1.Range(4, 12, 4, 13)],
                    _a));
            });
            (0, vitest_1.it)("parses a function expression", function () {
                var _a;
                var parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)("webpack/e.exports/function.js"));
                var map = parser.getExportMap();
                (0, vitest_1.expect)(map).to.deep.equal((_a = {},
                    _a[WebpackAstParser_1.WebpackAstParser.SYM_CJS_DEFAULT] = [new Range_1.Range(9, 16, 9, 27)],
                    _a));
            });
            (0, vitest_1.it)("parses a module with a class default export", function () {
                var _a, _b;
                var parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)("webpack/e.exports/classExport.js"));
                var map = parser.getExportMap();
                (0, vitest_1.expect)(map).to.deep.equal((_a = {},
                    _a[WebpackAstParser_1.WebpackAstParser.SYM_CJS_DEFAULT] = (_b = {
                            isDispatching: [new Range_1.Range(35, 8, 35, 21)],
                            dispatch: [new Range_1.Range(38, 8, 38, 16)],
                            dispatchForStoreTest: [new Range_1.Range(55, 8, 55, 28)],
                            flushWaitQueue: [new Range_1.Range(60, 8, 60, 22)],
                            _dispatchWithDevtools: [new Range_1.Range(88, 8, 88, 29)],
                            _dispatchWithLogging: [new Range_1.Range(91, 8, 91, 28)],
                            _dispatch: [new Range_1.Range(112, 8, 112, 17)],
                            addInterceptor: [new Range_1.Range(127, 8, 127, 22)],
                            wait: [new Range_1.Range(130, 8, 130, 12)],
                            subscribe: [new Range_1.Range(134, 8, 134, 17)],
                            unsubscribe: [new Range_1.Range(139, 8, 139, 19)],
                            register: [new Range_1.Range(144, 8, 144, 16)],
                            createToken: [new Range_1.Range(147, 8, 147, 19)],
                            addDependencies: [new Range_1.Range(150, 8, 150, 23)]
                        },
                        _b[WebpackAstParser_1.WebpackAstParser.SYM_CJS_DEFAULT] = [
                            new Range_1.Range(34, 10, 34, 11),
                            new Range_1.Range(153, 8, 153, 19),
                        ],
                        _b),
                    _a));
            });
            (0, vitest_1.it)("parses everything else", function () {
                var _a;
                var parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)("webpack/e.exports/everythingElse.js"));
                var map = parser.getExportMap();
                (0, vitest_1.expect)(map).to.deep.equal((_a = {},
                    _a[WebpackAstParser_1.WebpackAstParser.SYM_CJS_DEFAULT] = [new Range_1.Range(5, 16, 5, 44)],
                    _a));
            });
        });
        (0, vitest_1.describe)("exports", function () {
            (0, vitest_1.it)("Parses exports properly", function () {
                var parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)("webpack/exports/module.js"));
                var keys = [
                    "Deflate",
                    "deflate",
                    "deflateRaw",
                    "gzip",
                ];
                var map = parser.getExportMap();
                (0, vitest_1.expect)(map).to.have.keys(keys);
                keys.forEach(function (key) {
                    (0, vitest_1.expect)(map[key]).to.have.length(3);
                });
                keys.forEach(function (key, i) {
                    (0, vitest_1.expect)(map[key][0]).to.deep.equal(new Range_1.Range(101 + i, 6, 101 + i, 6 + key.length));
                    (0, vitest_1.expect)(map[key][1]).to.deep.equal(new Range_1.Range(101 + i, 9 + key.length, 101 + i, 10 + key.length));
                });
                (0, vitest_1.expect)(map.Deflate[2]).to.deep.equal(new Range_1.Range(18, 13, 18, 14));
                (0, vitest_1.expect)(map.deflate[2]).to.deep.equal(new Range_1.Range(49, 13, 49, 14));
                (0, vitest_1.expect)(map.deflateRaw[2]).to.deep.equal(new Range_1.Range(56, 13, 56, 14));
                (0, vitest_1.expect)(map.gzip[2]).to.deep.equal(new Range_1.Range(60, 13, 60, 14));
            });
        });
        (0, vitest_1.describe)("stores", function () {
            (0, vitest_1.it)("generates the proper export map for a store exported with wreq.d", function () {
                var _a;
                var parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)("webpack/stores/store1.js"));
                var map = parser.getExportMap();
                (0, vitest_1.expect)(map).to.deep.equal({
                    Z: (_a = {
                            initialize: [new Range_1.Range(11, 8, 11, 18)],
                            isVisible: [new Range_1.Range(18, 8, 18, 17)]
                        },
                        _a[WebpackAstParser_1.WebpackAstParser.SYM_CJS_DEFAULT] = [
                            new Range_1.Range(4, 8, 4, 9),
                            new Range_1.Range(32, 16, 32, 17),
                            new Range_1.Range(10, 10, 10, 11),
                        ],
                        _a[WebpackAstParser_1.WebpackAstParser.SYM_HOVER] = "EnablePublicGuildUpsellNoticeStore",
                        _a),
                });
            });
            (0, vitest_1.it)("generates the proper export map for a store constructed with no arguments", function () {
                var _a;
                var parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)("webpack/stores/store2.js"));
                var map = parser.getExportMap();
                (0, vitest_1.expect)(map).to.have.keys("default", "mergeUser", "ASSISTANT_WUMPUS_VOICE_USER");
                (0, vitest_1.expect)(map.default).to.deep.equal((_a = {
                        initialize: [new Range_1.Range(212, 8, 212, 18)],
                        takeSnapshot: [new Range_1.Range(215, 8, 215, 20)],
                        handleLoadCache: [new Range_1.Range(224, 8, 224, 23)],
                        getUserStoreVersion: [new Range_1.Range(38, 12, 38, 13)],
                        getUser: [new Range_1.Range(241, 8, 241, 15)],
                        getUsers: [new Range_1.Range(245, 8, 245, 16)],
                        forEach: [new Range_1.Range(248, 8, 248, 15)],
                        findByTag: [new Range_1.Range(253, 8, 253, 17)],
                        filter: [new Range_1.Range(260, 8, 260, 14)],
                        getCurrentUser: [new Range_1.Range(270, 8, 270, 22)]
                    },
                    _a[WebpackAstParser_1.WebpackAstParser.SYM_CJS_DEFAULT] = [
                        new Range_1.Range(7, 8, 7, 15),
                        new Range_1.Range(286, 17, 286, 19),
                        new Range_1.Range(211, 10, 211, 12),
                        new Range_1.Range(273, 8, 282, 9),
                    ],
                    _a[WebpackAstParser_1.WebpackAstParser.SYM_HOVER] = "UserStore",
                    _a));
                (0, vitest_1.expect)(map.ASSISTANT_WUMPUS_VOICE_USER).to.deep.equal([
                    new Range_1.Range(6, 8, 6, 35),
                    new Range_1.Range(39, 12, 39, 31),
                ]);
                (0, vitest_1.expect)(map.mergeUser).to.deep.equal([
                    new Range_1.Range(8, 8, 8, 17),
                    new Range_1.Range(118, 13, 118, 14),
                ]);
            });
            (0, vitest_1.it)("generates the proper export map for a store with no initialize method", function () {
                var _a;
                var parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)("webpack/stores/store3.js"));
                var map = parser.getExportMap();
                (0, vitest_1.expect)(map).to.deep.equal({
                    Z: (_a = {
                            getGuild: [new Range_1.Range(199, 8, 199, 16)],
                            getGuilds: [new Range_1.Range(203, 8, 203, 17)],
                            getGuildIds: [new Range_1.Range(206, 8, 206, 19)],
                            // getGuildCount: [new Range(209, 8, 209, 21)],
                            getGuildCount: [new Range_1.Range(4, 8, 4, 9)],
                            // isLoaded: [new Range(212, 8, 212, 16)],
                            isLoaded: [new Range_1.Range(52, 12, 52, 14)],
                            getGeoRestrictedGuilds: [new Range_1.Range(53, 12, 53, 14)],
                            getAllGuildsRoles: [new Range_1.Range(218, 8, 218, 25)],
                            getRoles: [new Range_1.Range(221, 8, 221, 16)],
                            getRole: [new Range_1.Range(225, 8, 225, 15)]
                        },
                        _a[WebpackAstParser_1.WebpackAstParser.SYM_CJS_DEFAULT] = [
                            new Range_1.Range(6, 8, 6, 9),
                            new Range_1.Range(231, 16, 231, 17),
                            new Range_1.Range(198, 10, 198, 11),
                        ],
                        _a[WebpackAstParser_1.WebpackAstParser.SYM_HOVER] = "GuildStore",
                        _a),
                });
            });
            (0, vitest_1.it)("generates the proper export map for a store with getters", function () {
                var _a;
                var parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)("webpack/stores/getter.js"));
                var map = parser.getExportMap();
                // Change when parsing is fixed to only return to constants
                (0, vitest_1.expect)(map).to.deep.equal({
                    Z: (_a = {},
                        _a[WebpackAstParser_1.WebpackAstParser.SYM_CJS_DEFAULT] = [
                            new Range_1.Range(4, 8, 4, 9),
                            new Range_1.Range(24, 16, 24, 17),
                            new Range_1.Range(9, 10, 9, 11),
                        ],
                        _a.keepOpen = [new Range_1.Range(8, 12, 8, 14)],
                        _a.enabled = [new Range_1.Range(7, 12, 7, 14)],
                        _a[WebpackAstParser_1.WebpackAstParser.SYM_HOVER] = "SoundboardOverlayStore",
                        _a),
                });
            });
            vitest_1.it.skip("generates the proper export map for a store exported with wreq.t", function () {
                // I've never seen a store exported with wreq.t
            });
            vitest_1.it.skip("generates the proper export map for a store exported with wreq.e", function () {
                // I've never seen a store exported with wreq.e
            });
        });
    });
    (0, vitest_1.describe)("hover text parsing", function () {
        (0, vitest_1.it)("finds hover text 1", function () {
            var parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)("webpack/stores/store1.js"));
            var hover = parser.findHoverText(["Z"]);
            (0, vitest_1.expect)(hover).to.equal("EnablePublicGuildUpsellNoticeStore");
        });
        (0, vitest_1.it)("finds hover text 2", function () {
            var parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)("webpack/stores/store2.js"));
            var hover = parser.findHoverText(["default"]);
            (0, vitest_1.expect)(hover).to.equal("UserStore");
        });
        (0, vitest_1.it)("finds hover text 3", function () {
            var parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)("webpack/stores/store3.js"));
            var hover = parser.findHoverText(["Z"]);
            (0, vitest_1.expect)(hover).to.equal("GuildStore");
        });
        (0, vitest_1.it)("finds hover text 4", function () {
            var parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)("webpack/stores/getter.js"));
            var hover = parser.findHoverText(["Z"]);
            (0, vitest_1.expect)(hover).to.equal("SoundboardOverlayStore");
        });
    });
    (0, vitest_1.describe)("import parsing", function () {
        (0, vitest_1.it)("parses an only re-exported export properly", function () {
            var parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)("webpack/imports/reExport.js"));
            var test = parser.getUsesOfImport("999001", "foo");
            (0, vitest_1.expect)(test).to.deep.equal([new Range_1.Range(5, 21, 5, 24)]);
        });
        (0, vitest_1.it)("parses a re-export with other uses", function () {
            var parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)("webpack/imports/reExport.js"));
            var test = parser.getUsesOfImport("999001", "bar");
            (0, vitest_1.expect)(test).to.have.deep.members([new Range_1.Range(6, 22, 6, 25), new Range_1.Range(10, 18, 10, 21)]);
        });
        (0, vitest_1.it)("returns [] when there are no uses of that export for that module", function () {
            var parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)("webpack/imports/reExport.js"));
            var test = parser.getUsesOfImport("999001", "baz");
            (0, vitest_1.expect)(test).to.deep.equal([]);
        });
        (0, vitest_1.it)("returns [] when the module ID is not imported", function () {
            var parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)("webpack/imports/reExport.js"));
            var text = parser.getUsesOfImport("999003", "foo");
            (0, vitest_1.expect)(text).to.deep.equal([]);
        });
        (0, vitest_1.it)("returns [] when there are no uses of that export for that module 2", function () {
            var parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)("webpack/imports/indirectCall.js"));
            var test = parser.getUsesOfImport("999002", "bar");
            (0, vitest_1.expect)(test).to.deep.equal([]);
        });
        (0, vitest_1.it)("returns [] when the module ID is not imported 2", function () {
            var parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)("webpack/imports/indirectCall.js"));
            var text = parser.getUsesOfImport("999004", "foo");
            (0, vitest_1.expect)(text).to.deep.equal([]);
        });
        (0, vitest_1.it)("parses an indirect call properly", function () {
            var parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)("webpack/imports/indirectCall.js"));
            var test = parser.getUsesOfImport("999002", "foo");
            (0, vitest_1.expect)(test).to.deep.equal([new Range_1.Range(9, 22, 9, 25)]);
        });
        (0, vitest_1.it)("throws when wreq is not used", function () {
            var parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)("webpack/imports/noWreq.js"));
            // args should not matter as it should throw before
            (0, vitest_1.expect)(parser.getUsesOfImport.bind(parser)).to.throw("Wreq is not used in this file");
        });
        (0, vitest_1.it)("parses node default exports correctly", function () {
            var parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)("webpack/imports/nodeModule.js"));
            var test = parser.getUsesOfImport("999005", WebpackAstParser_1.WebpackAstParser.SYM_CJS_DEFAULT);
            (0, vitest_1.expect)(test).to.have.deep.members([new Range_1.Range(20, 15, 20, 19), new Range_1.Range(15, 8, 15, 12)]);
        });
        (0, vitest_1.it)("parsed named node exports correctly", function () {
            var parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)("webpack/imports/nodeModule.js"));
            var test = parser.getUsesOfImport("999005", "qux");
            (0, vitest_1.expect)(test).to.have.deep.members([new Range_1.Range(19, 13, 19, 16), new Range_1.Range(16, 20, 16, 23)]);
        });
    });
    (0, vitest_1.describe)("cache parsing", function () {
        (0, vitest_1.beforeAll)(function () {
            return __awaiter(this, void 0, void 0, function () {
                function generateModDeps() {
                    return __awaiter(this, void 0, void 0, function () {
                        var modmap, ret, _i, modmap_1, _a, id, text, parser, deps, _b, _c, syncDep, _d, _e, lazyDep;
                        var _this = this;
                        var _f, _g;
                        return __generator(this, function (_h) {
                            switch (_h.label) {
                                case 0: return [4 /*yield*/, Promise.all(Object.entries(modulesOnDisk)
                                        .map(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                                        var _c;
                                        var id = _b[0], path = _b[1];
                                        return __generator(this, function (_d) {
                                            switch (_d.label) {
                                                case 0:
                                                    _c = [id];
                                                    return [4 /*yield*/, (0, promises_1.readFile)(path, "utf-8")];
                                                case 1: return [2 /*return*/, _c.concat([_d.sent()])];
                                            }
                                        });
                                    }); }))];
                                case 1:
                                    modmap = _h.sent();
                                    ret = makeDepsMap();
                                    for (_i = 0, modmap_1 = modmap; _i < modmap_1.length; _i++) {
                                        _a = modmap_1[_i], id = _a[0], text = _a[1];
                                        parser = new WebpackAstParser_1.WebpackAstParser(text);
                                        {
                                            deps = parser.getModulesThatThisModuleRequires();
                                            for (_b = 0, _c = (_f = deps === null || deps === void 0 ? void 0 : deps.sync) !== null && _f !== void 0 ? _f : []; _b < _c.length; _b++) {
                                                syncDep = _c[_b];
                                                ret[syncDep].syncUses.push(id);
                                            }
                                            for (_d = 0, _e = (_g = deps === null || deps === void 0 ? void 0 : deps.lazy) !== null && _g !== void 0 ? _g : []; _d < _e.length; _d++) {
                                                lazyDep = _e[_d];
                                                ret[lazyDep].lazyUses.push(id);
                                            }
                                        }
                                    }
                                    return [2 /*return*/, [ret]];
                            }
                        });
                    });
                }
                var modulesOnDisk, _a, _b, mainDeps;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _b = (_a = Object).fromEntries;
                            return [4 /*yield*/, (0, promises_1.readdir)((0, node_path_1.join)(__dirname, "__test__", ".modules"))];
                        case 1:
                            modulesOnDisk = _b.apply(_a, [(_c.sent())
                                    .filter(function (x) { return x.endsWith(".js"); })
                                    .map(function (fullPath) { return [(0, node_path_1.basename)(fullPath, ".js"), (0, node_path_1.join)(__dirname, "__test__", ".modules", fullPath)]; })]);
                            WebpackAstParser_1.WebpackAstParser.setDefaultModuleCache({
                                getLatestModuleFromNum: function (_id) {
                                    return Promise.reject(new Error("Not implemented"));
                                },
                                getModuleFilepath: function (id) {
                                    var fullPath = modulesOnDisk[String(id)];
                                    return fullPath && (0, node_path_1.relative)(__dirname, fullPath)
                                        .replaceAll("\\", "/");
                                },
                                getModuleFromNum: function (id) {
                                    return __awaiter(this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(__dirname, "__test__", ".modules", "".concat(id, ".js")), "utf-8")];
                                                case 1: return [2 /*return*/, _a.sent()];
                                            }
                                        });
                                    });
                                },
                            });
                            return [4 /*yield*/, generateModDeps()];
                        case 2:
                            mainDeps = (_c.sent())[0];
                            WebpackAstParser_1.WebpackAstParser.setDefaultModuleDepManager({
                                getModDeps: function (moduleId) {
                                    return mainDeps[moduleId];
                                },
                            });
                            return [2 /*return*/];
                    }
                });
            });
        });
        function makeLineRange(file, y1, x1, len) {
            if (len === void 0) { len = 1; }
            file = "".concat(file, ".js");
            return {
                locationType: "file_path",
                filePath: posix.join("__test__", ".modules", file),
                range: new Range_1.Range(y1, x1, y1, x1 + len),
            };
        }
        (0, vitest_1.describe)("re-export handling", function () {
            (0, vitest_1.it)("handles re-exports across wreq.d", function () {
                return __awaiter(this, void 0, void 0, function () {
                    var parser, locs;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)(".modules/333333.js"));
                                return [4 /*yield*/, parser.generateReferences(new Position_1.Position(5, 8))];
                            case 1:
                                locs = _a.sent();
                                (0, vitest_1.expect)(locs).to.have.deep.members([
                                    makeLineRange(222222, 18, 29),
                                    makeLineRange(111111, 24, 34),
                                    makeLineRange(444444, 5, 20),
                                    makeLineRange(555555, 39, 30),
                                    makeLineRange(555555, 44, 30),
                                    makeLineRange(555555, 22, 34),
                                    makeLineRange(555555, 27, 34),
                                ]);
                                return [2 /*return*/];
                        }
                    });
                });
            });
            vitest_1.it.todo("handles re-exports across wreq.t", function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/];
                    });
                });
            });
            vitest_1.it.todo("handles re-exports across wreq.e", function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/];
                    });
                });
            });
        });
        (0, vitest_1.it)("finds a simple use in only one file", function () {
            return __awaiter(this, void 0, void 0, function () {
                var parser, locs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)(".modules/222222.js"));
                            return [4 /*yield*/, parser.generateReferences(new Position_1.Position(6, 8))];
                        case 1:
                            locs = _a.sent();
                            (0, vitest_1.expect)(locs).to.deep.equal([makeLineRange(111111, 16, 26)]);
                            return [2 /*return*/];
                    }
                });
            });
        });
        (0, vitest_1.it)("finds a simple export in more than one file", function () {
            return __awaiter(this, void 0, void 0, function () {
                var parser, locs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)(".modules/222222.js"));
                            return [4 /*yield*/, parser.generateReferences(new Position_1.Position(5, 8))];
                        case 1:
                            locs = _a.sent();
                            (0, vitest_1.expect)(locs).to.have.deep.members([
                                makeLineRange(111111, 16, 18),
                                makeLineRange(111111, 16, 40),
                                makeLineRange(999999, 13, 41),
                            ]);
                            return [2 /*return*/];
                    }
                });
            });
        });
        vitest_1.it.todo("finds all uses of a default e.exports", function () {
        });
        /**
         * ```js
         * function foo() {
         * }
         * function bar() {
         * }
         * foo.bar = bar;
         * e.exports = foo;
         * ```
         */
        (0, vitest_1.it)("finds all uses of a default e.exports where the exports are assigned to the default export first", function () {
            return __awaiter(this, void 0, void 0, function () {
                var parser, locs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)(".modules/111113.js"));
                            return [4 /*yield*/, parser.generateReferences(new Position_1.Position(5, 8))];
                        case 1:
                            locs = _a.sent();
                            (0, vitest_1.expect)(locs).to.deep.equal([makeLineRange(111111, 31, 28, 3)]);
                            return [2 /*return*/];
                    }
                });
            });
        });
        (0, vitest_1.it)("finds all uses of a default e.exports where the exports are assigned to the default export first 2", function () {
            return __awaiter(this, void 0, void 0, function () {
                var parser, locs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)(".modules/111113.js"));
                            return [4 /*yield*/, parser.generateReferences(new Position_1.Position(8, 8))];
                        case 1:
                            locs = _a.sent();
                            (0, vitest_1.expect)(locs).to.deep.equal([makeLineRange(111111, 32, 28, 3)]);
                            return [2 /*return*/];
                    }
                });
            });
        });
        (0, vitest_1.it)("finds all uses of a default e.exports where the exports are assigned to the default export first 3", function () {
            return __awaiter(this, void 0, void 0, function () {
                var parser, locs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)(".modules/111113.js"));
                            return [4 /*yield*/, parser.generateReferences(new Position_1.Position(11, 8))];
                        case 1:
                            locs = _a.sent();
                            (0, vitest_1.expect)(locs).to.deep.equal([makeLineRange(111111, 33, 28, 3)]);
                            return [2 /*return*/];
                    }
                });
            });
        });
        (0, vitest_1.it)("finds uses of a class export as a component (class itself, not a method or instance)", function () {
            return __awaiter(this, void 0, void 0, function () {
                var parser, locs, locs2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)(".modules/555555.js"));
                            return [4 /*yield*/, parser.generateReferences(new Position_1.Position(11, 10))];
                        case 1:
                            locs = _a.sent();
                            return [4 /*yield*/, parser.generateReferences(new Position_1.Position(6, 8))];
                        case 2:
                            locs2 = _a.sent();
                            (0, vitest_1.expect)(locs).to.not.be.empty;
                            (0, vitest_1.expect)(locs2).to.not.be.empty;
                            (0, util_1.TAssert)(locs);
                            (0, util_1.TAssert)(locs2);
                            (0, vitest_1.expect)(locs).to.have.deep.members(locs2);
                            (0, vitest_1.expect)(locs).to.have.deep.members([makeLineRange(333333, 12, 52)]);
                            return [2 /*return*/];
                    }
                });
            });
        });
        (0, vitest_1.describe)("definitions", function () {
            (0, vitest_1.describe)("wreq.d", function () {
                (0, vitest_1.it)("finds the use of a simple import", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var parser, defs;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)(".modules/111111.js"));
                                    return [4 /*yield*/, parser.generateDefinitions(new Position_1.Position(21, 29))];
                                case 1:
                                    defs = _a.sent();
                                    (0, vitest_1.expect)(defs)
                                        .toMatchSnapshot();
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                (0, vitest_1.it)("finds the use of a simple import 2", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var parser, defs;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)(".modules/111111.js"));
                                    return [4 /*yield*/, parser.generateDefinitions(new Position_1.Position(24, 34))];
                                case 1:
                                    defs = _a.sent();
                                    (0, vitest_1.expect)(defs)
                                        .toMatchSnapshot();
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
            });
            (0, vitest_1.describe)("from wreq(number)", function () {
                (0, vitest_1.it)("finds the module for a simple wreq call", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var parser, def;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)(".modules/333333.js"));
                                    return [4 /*yield*/, parser.generateDefinitions(new Position_1.Position(9, 18))];
                                case 1:
                                    def = _a.sent();
                                    (0, vitest_1.expect)(def)
                                        .toMatchSnapshot();
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                (0, vitest_1.it)("returns undefined for a module that doesn't exist", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var parser, def;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)(".modules/333333.js"));
                                    return [4 /*yield*/, parser.generateDefinitions(new Position_1.Position(8, 18))];
                                case 1:
                                    def = _a.sent();
                                    (0, vitest_1.expect)(def).to.be.undefined;
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                (0, vitest_1.it)("finds the module for a wreq call not in imports", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var parser, def;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)(".modules/444444.js"));
                                    return [4 /*yield*/, parser.generateDefinitions(new Position_1.Position(8, 18))];
                                case 1:
                                    def = _a.sent();
                                    (0, vitest_1.expect)(def)
                                        .toMatchSnapshot();
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
            });
        });
        (0, vitest_1.describe)("stores", function () {
            vitest_1.it.todo("finds all uses of a store from the class name", function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/];
                    });
                });
            });
        });
        (0, vitest_1.describe)("hover text cross-module", function () {
            (0, vitest_1.it)("finds the hover text for a store from another module", function () {
                return __awaiter(this, void 0, void 0, function () {
                    var parser, hover;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)(".modules/555555.js"));
                                return [4 /*yield*/, parser.generateHover(new Position_1.Position(38, 8))];
                            case 1:
                                hover = _a.sent();
                                (0, vitest_1.expect)(hover)
                                    .toMatchSnapshot();
                                return [2 /*return*/];
                        }
                    });
                });
            });
            (0, vitest_1.it)("finds the hover text for a store from another module", function () {
                return __awaiter(this, void 0, void 0, function () {
                    var parser, hover, hover2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                parser = new WebpackAstParser_1.WebpackAstParser((0, testingUtil_1.getFile)(".modules/111111.js"));
                                return [4 /*yield*/, parser.generateHover(new Position_1.Position(15, 23))];
                            case 1:
                                hover = _a.sent();
                                return [4 /*yield*/, parser.generateHover(new Position_1.Position(30, 23))];
                            case 2:
                                hover2 = _a.sent();
                                (0, vitest_1.expect)(hover)
                                    .toMatchSnapshot();
                                (0, vitest_1.expect)(hover2)
                                    .toMatchSnapshot();
                                return [2 /*return*/];
                        }
                    });
                });
            });
        });
    });
    (0, vitest_1.describe)("flux parsing", function () {
        var fluxModule = (0, testingUtil_1.getFile)("webpack/flux/dispatcherClass.js");
        (0, vitest_1.it)("identifies the flux dispatcher module", function () {
            var parser = new WebpackAstParser_1.WebpackAstParser(fluxModule);
            (0, vitest_1.expect)(parser.isFluxDispatcherModule()).to.equal("U");
        });
    });
});
function makeDepsMap() {
    var target = {};
    return new Proxy(target, {
        get: function (target, prop, rec) {
            if (typeof prop === "string" && prop.match(/\d+/)) {
                if (!Reflect.has(target, prop)) {
                    var val = {
                        lazyUses: [],
                        syncUses: [],
                    };
                    Reflect.set(target, prop, val, rec);
                    return val;
                }
            }
            return Reflect.get(target, prop, rec);
        },
    });
}

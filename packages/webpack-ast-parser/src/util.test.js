"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testingUtil_1 = require("./testingUtil");
var util_1 = require("./util");
var vitest_1 = require("vitest");
var randomData = (0, testingUtil_1.getFile)("random");
(0, vitest_1.describe)("isWebpackModule", function () {
    (0, vitest_1.it)("fails on random data", function () {
        (0, vitest_1.expect)((0, util_1.isWebpackModule)(randomData)).to.be.false;
    });
    (0, vitest_1.it)("throws on an object", function () {
        // @ts-expect-error it should throw a type error
        (0, vitest_1.expect)(function () { return (0, util_1.isWebpackModule)({}); }).to.throw();
    });
    (0, vitest_1.it)("fails on an empty string", function () {
        (0, vitest_1.expect)((0, util_1.isWebpackModule)("")).to.be.false;
    });
    (0, vitest_1.it)("works on a module", function () {
        var file = (0, testingUtil_1.getFile)("util/webpackHeader.js");
        (0, vitest_1.expect)((0, util_1.isWebpackModule)(file)).to.be.true;
    });
    (0, vitest_1.it)("works on an extracted find", function () {
        var file = (0, testingUtil_1.getFile)("util/extractedFindHeader.js");
        (0, vitest_1.expect)((0, util_1.isWebpackModule)(file)).to.be.true;
    });
});

"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.cachedDb = void 0;
exports.getDb = getDb;
exports.initDb = initDb;
exports.withDb = withDb;
exports.defineHooks = defineHooks;
var slintorm_1 = require("slintorm");
var schema_1 = require("./schema");
var register_1 = require("../models/register");
function getDb() {
    if (exports.cachedDb)
        return exports.cachedDb;
    throw new Error("Database not initialized. Call initDb() first.");
}
function initDb() {
    return __awaiter(this, void 0, void 0, function () {
        var orm;
        return __generator(this, function (_a) {
            if (exports.cachedDb)
                return [2 /*return*/, exports.cachedDb];
            orm = new slintorm_1.default({
                driver: "sqlite",
                databaseUrl: "./test.db",
                logs: process.env.NODE_ENV === "development",
                dir: "./src/lib",
                modelMap: {},
                schema: schema_1.schema,
            });
            (0, register_1.registerModels)(orm);
            // if (process.env.NODE_ENV !== "edge") {
            //   await orm.migrate();
            // }
            exports.cachedDb = orm.DB;
            return [2 /*return*/, exports.cachedDb];
        });
    });
}
function withDb(fn) {
    return __awaiter(this, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, initDb()];
                case 1:
                    db = _a.sent();
                    return [2 /*return*/, fn(db)];
            }
        });
    });
}
// ──────────────────────────────────────────────
//  Lifecycle hooks helper
// ──────────────────────────────────────────────
function defineHooks() {
    return {
        onCreateBefore: function (data) {
            var now = new Date().toISOString();
            return __assign(__assign({}, data), { createdAt: now, updatedAt: now });
        },
        onUpdateBefore: function (_old, newData) {
            return __assign(__assign({}, newData), { updatedAt: new Date().toISOString() });
        },
    };
}
function testdb() {
    return __awaiter(this, void 0, void 0, function () {
        var ng, fetched;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.cachedDb.ABTest.insert({
                        name: "Test AB Test",
                        description: "This is a test AB test",
                        workspaceId: 1,
                        status: "draft",
                        variants: { variantA: "some value", variantB: "another value" },
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    })];
                case 1:
                    ng = _a.sent();
                    console.log("Inserted ABTest:", ng);
                    console.log("Inserted ABTest:", ng);
                    return [4 /*yield*/, exports.cachedDb.ABTest.get({ id: ng === null || ng === void 0 ? void 0 : ng.id })];
                case 2:
                    fetched = _a.sent();
                    console.log("Fetched ABTest:", fetched);
                    return [2 /*return*/];
            }
        });
    });
}
testdb().catch(function (err) {
    console.error("Error in testdb:", err);
});

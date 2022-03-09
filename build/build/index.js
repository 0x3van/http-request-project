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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
exports.__esModule = true;
var axios_1 = require("axios");
var fs_1 = require("fs");
var funcs_1 = require("./funcs");
var png_to_rgba_1 = require("png-to-rgba");
var randomstring_1 = require("randomstring");
var sharp_1 = require("sharp");
(function (size) { return __awaiter(void 0, void 0, void 0, function () {
    var params, data, _a, _b, _c, _d, _e, _f, _g, _h, _j, key;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                params = new URLSearchParams();
                params.append('thumb_data', funcs_1["default"].toDataURL(fs_1["default"].readFileSync('./image.png')));
                params.append('thumb_data', funcs_1["default"].toDataURL(fs_1["default"].readFileSync('./image.jpg')));
                _b = (_a = funcs_1["default"]).getData;
                _c = [process.argv[2] || randomstring_1["default"].generate({
                        length: 10,
                        charset: 'alphabetic'
                    }).toLowerCase()];
                _e = (_d = funcs_1["default"]).graphToDesmos;
                _g = (_f = funcs_1["default"]).compressGraph;
                _j = (_h = png_to_rgba_1["default"]).PNGToRGBAArray;
                return [4 /*yield*/, (0, sharp_1["default"])(fs_1["default"].readFileSync('./image.png'))
                        .resize({
                        width: size,
                        height: size,
                        fit: 'contain',
                        position: 'left bottom',
                        background: {
                            r: 255,
                            g: 255,
                            b: 255,
                            alpha: 0.0
                        }
                    })
                        .toBuffer()];
            case 1:
                data = _b.apply(_a, _c.concat([_e.apply(_d, [_g.apply(_f, [_j.apply(_h, [_k.sent()]).rgba])])]));
                for (key in data) {
                    params.append(key, data[key]);
                }
                console.log("Sending #bytes ".concat(params.toString().length));
                (0, axios_1["default"])({
                    url: "https://www.desmos.com/api/v1/calculator/save",
                    "headers": {
                        "accept": "application/json, text/javascript, */*; q=0.01",
                        "accept-language": "en-US,en;q=0.9",
                        "cache-control": "no-cache",
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "pragma": "no-cache",
                        "sec-ch-ua": "\"Opera GX\";v=\"81\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"95\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "x-requested-with": "XMLHttpRequest",
                        "Referer": "https://www.desmos.com/calculator",
                        "Referrer-Policy": "strict-origin-when-cross-origin"
                    },
                    "data": params.toString(),
                    "method": "POST"
                }).then(function (res) {
                    res.data.url = "https://desmos.com/calculator/".concat(res.data.hash);
                    res.data.length = params.toString().length;
                    console.log(res.data);
                });
                return [2 /*return*/];
        }
    });
}); })(125);

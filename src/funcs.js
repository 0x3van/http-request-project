"use strict";
exports.__esModule = true;
var crypto_1 = require("crypto");
/*
  desmos expression format: {
                type: 'expression',
                id: incrementing number,
                color: hex color,
                latex: `{START_X}\\le x\\le{END_X}\\left\\{{START_Y}\\le y\\le{END_Y}\\right\\}`
            }

            x is left to right
            y is bottom to top
*/
function imageToGraph(img) {
    var _a, _b;
    var res = [];
    var image = img.reverse();
    for (var i = 0; i < image.length; i++) {
        for (var j = 0; j < image[i].length; j++) {
            if (image[i][j].reduce(function (a, c) { return a + c; }, 0) === 0)
                continue;
            res.push({
                type: 'expression',
                id: i + j,
                color: "#".concat(image[i][j].splice(0, 3).map(function (a) { return a.toString(16).padStart(2, '0'); }).join('')),
                latex: "".concat(round(j * .1), "\\le x\\le").concat(round((j + 1) * .1), "\\left\\{").concat(round(i * .1), "\\le y\\le").concat(round((i + 1) * .1), "\\right\\}"),
                fillOpacity: ((_a = image[i][j]) === null || _a === void 0 ? void 0 : _a[3]) ? round(image[i][j][3] / 255) : '1',
                lineOpacity: ((_b = image[i][j]) === null || _b === void 0 ? void 0 : _b[3]) ? round(image[i][j][3] / 255) : '1',
                lineWidth: '2'
            });
        }
    }
    return res;
}
function compressColors(color, precision) {
    if (precision === void 0) { precision = 4; }
    var res = [];
    for (var i = 0; i < color.length; i++) {
        res.push([]);
        for (var j = 0; j < color[i].length; j++) {
            var r = color[i][j][0];
            var g = color[i][j][1];
            var b = color[i][j][2];
            var a = color[i][j][3];
            res[i].push([
                Math.round(r / precision) * precision,
                Math.round(g / precision) * precision,
                Math.round(b / precision) * precision,
                a
            ]);
        }
    }
    return res;
}
function compressGraph(img) {
    var res = [];
    var image = img.reverse();
    for (var i = 0; i < image.length; i++) {
        var _loop_1 = function (j) {
            if (image[i][j].reduce(function (a, c) { return a + c; }, 0) === 0)
                return "continue";
            var color = image[i][j];
            var width = 1;
            var height = 1;
            var x = j;
            var y = i;
            if (image[i][j].reduce(function (a, c) { return a + c; }, 0) === 0)
                return "continue";
            for (var k = j; k < image[i].length; k++) {
                if (image[i][k].reduce(function (a, c) { return a + c; }, 0) === 0)
                    break;
                if (image[i][k].every(function (a, b) { return a === color[b]; })) {
                    width++;
                }
                else {
                    break;
                }
            }
            for (var k = i; k < image.length; k++) {
                if (image[k][j].reduce(function (a, c) { return a + c; }, 0) === 0)
                    break;
                if (image[k][j].every(function (a, b) { return a === color[b]; })) {
                    height++;
                }
                else {
                    break;
                }
            }
            if (width === 1 && height === 1)
                return "continue";
            res.push({
                position: { x: x, y: y },
                dimensions: { width: width, height: height },
                color: color
            });
        };
        for (var j = 0; j < image[i].length; j++) {
            _loop_1(j);
        }
    }
    return res;
}
function graphToDesmos(graph) {
    var res = [];
    for (var i = 0; i < graph.length; i++) {
        var _a = graph[i], position = _a.position, dimensions = _a.dimensions, color = _a.color;
        var x = position.x, y = position.y;
        var width = dimensions.width, height = dimensions.height;
        if (color.length === 3) {
            color.push(255);
        }
        res.push({
            type: 'expression',
            id: i,
            color: "#".concat(color.map(function (a) { return a.toString(16).padStart(2, '0'); }).join('')),
            latex: "".concat(round(x * .1), "\\le x\\le").concat(round((x + width) * .1), "\\left\\{").concat(round(y * .1), "\\le y\\le").concat(round((y + height) * .1), "\\right\\}"),
            fillOpacity: "1",
            lineOpacity: "1",
            lineWidth: "2"
        });
    }
    return res;
}
function getData(id, list) {
    if (id.length !== 10)
        throw new Error('Invalid ID');
    return {
        "calc_state": JSON.stringify({
            "version": 9,
            "randomSeed": crypto_1["default"].randomBytes(16).toString('hex'),
            "graph": {
                "viewport": {
                    "xmin": -100,
                    "ymin": -170.88827258320127,
                    "xmax": 100,
                    "ymax": 170.88827258320127
                }
            },
            "expressions": {
                list: list
            }
        }),
        "graph_hash": id,
        "is_update": "false",
        "lang": "en",
        "my_graphs": "false"
    };
}
function genPoints(x, y) {
    var r = [];
    for (var i = 0; i < x; i++) {
        for (var j = 0; j < y; j++) {
            r.push({
                type: "expression",
                id: i + j,
                color: "#" + crypto_1["default"].randomBytes(3).toString('hex'),
                latex: "\\frac{".concat(i + 1, "y}{x}=\\sin\\left(").concat(j + 1, "x^{2}+y^{2}\\right)"),
                fillOpacity: "1",
                lineOpacity: "1",
                lineWidth: "2"
            });
        }
    }
    return r;
}
function RGBtoHex(_a) {
    var r = _a[0], g = _a[1], b = _a[2];
    if ([r, g, b].reduce(function (a, c) { return a || c === null || c === undefined; }, false))
        throw new Error('Invalid color');
    if (r > 255 || g > 255 || b > 255)
        throw new Error('Invalid color');
    return "#".concat(r.toString(16).padStart(2, '0')).concat(g.toString(16).padStart(2, '0')).concat(b.toString(16).padStart(2, '0'));
}
function toDataURL(img) {
    return "data:image/png;base64,".concat(img.toString('base64'));
}
function round(num) {
    return Math.round(num * 10) / 10;
}
exports["default"] = {
    getData: getData,
    imageToGraph: imageToGraph,
    genPoints: genPoints,
    toDataURL: toDataURL,
    round: round,
    compressGraph: compressGraph,
    graphToDesmos: graphToDesmos,
    RGBtoHex: RGBtoHex,
    compressColors: compressColors
};

'use strict';

var SquircleMode;
(function (SquircleMode) {
    SquircleMode["simple"] = "simple";
    SquircleMode["fixed"] = "fixed";
    SquircleMode["relative"] = "relative";
})(SquircleMode || (SquircleMode = {}));
const SquircleDefaultProps = { c: 5, p1: 8, p2: 32, r1: 0.059, r2: 0.332, mode: SquircleMode.simple };
const RATIO = 0.1765;
function radiusFromC(c) {
    const byRatio = (val) => ({ r1: val * RATIO, r2: val });
    switch (Number(c)) {
        case 1:
            return byRatio(0.0375);
        case 2:
            return byRatio(0.0750);
        case 3:
            return byRatio(0.1500);
        case 4:
            return byRatio(0.2984);
        case 5:
            return byRatio(0.3320);
        case 6:
            return byRatio(0.3656);
        case 7:
            return byRatio(0.3992);
        case 8:
            return byRatio(0.4328);
        case 9:
            return byRatio(0.4664);
        case 10:
            return byRatio(0.500);
        default:
            return byRatio(0.3320);
    }
}
function createSquirclePath(props = SquircleDefaultProps) {
    const { width = 100, height = 100, r1, r2, p1, p2, c, mode } = props;
    const isSimple = mode === SquircleMode.simple;
    const isFixed = mode === SquircleMode.fixed;
    const radius = Math.min(width, height);
    const normalized1 = isFixed ? p1 : r1 * radius;
    const normalized2 = isFixed ? p2 : r2 * radius;
    const radius1 = isSimple ? radiusFromC(c).r1 * radius : Math.min(normalized1, normalized2);
    const radius2 = isSimple ? radiusFromC(c).r2 * radius : normalized2;
    return `
    M 0, ${radius2}
    C 0, ${radius1} ${radius1}, 0 ${radius2}, 0
    L ${width - radius2}, 0
    C ${width - radius1}, 0 ${width}, ${radius1} ${width}, ${radius2}
    L ${width}, ${height - radius2}
    C ${width}, ${height - radius1} ${width - radius1}, ${height} ${width - radius2}, ${height}
    L ${radius2}, ${height}
    C ${radius1}, ${height} 0, ${height - radius1} 0, ${height - radius2}
    L 0, ${radius2}
  `;
}
function createSquircleSVG(props) {
    const d = createSquirclePath(props);
    return `<path id="Squircle" fill="#C4C4C4" d="${d}" />`;
}

const isSquircle = node => node.getPluginData('c');
const squircleProps = node => {
    const mode = node.getPluginData('mode');
    const c = node.getPluginData('c');
    const p1 = node.getPluginData('p1');
    const p2 = node.getPluginData('p2');
    const r1 = node.getPluginData('r1');
    const r2 = node.getPluginData('r2');
    const { id, width, height } = node;
    return { id, width, height, mode, c, p1, p2, r1, r2 };
};
figma.currentPage.selection = figma.currentPage.selection.filter(isSquircle);
if (!figma.currentPage.selection.length)
    createSquircle();
figma.showUI(__html__, { width: 232, height: 125 });
figma.ui.postMessage({
    type: 'init',
    nodes: figma.currentPage.selection.filter(isSquircle).map(squircleProps)
});
figma.on("selectionchange", () => {
    figma.ui.postMessage({
        type: 'selectionchange',
        nodes: figma.currentPage.selection.filter(isSquircle).map(squircleProps)
    });
});
figma.ui.onmessage = msg => {
    switch (msg.type) {
        case 'update-squircle':
            figma.currentPage.selection.filter(isSquircle).map(node => {
                updateSquircle(node, msg);
            });
            return;
        case 'resize':
            figma.currentPage.selection.filter(isSquircle).map(node => {
                node.resize(msg.width, msg.height);
                updateSquircle(node, msg);
            });
            return;
        default:
            return;
    }
};
function createSquircle(props = SquircleDefaultProps) {
    const nodes = [];
    const svg = createSquircleSVG(props);
    const squircle = figma.createNodeFromSvg(svg);
    squircle.setPluginData('mode', `${props.mode}`);
    squircle.setPluginData('c', `${props.c}`);
    squircle.setPluginData('p1', `${props.p1}`);
    squircle.setPluginData('p2', `${props.p2}`);
    squircle.setPluginData('r1', `${props.r1}`);
    squircle.setPluginData('r2', `${props.r2}`);
    nodes.push(squircle);
    figma.currentPage.appendChild(squircle);
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
}
function updateSquircle(node, props) {
    var _a, _b, _c, _d, _e, _f;
    if (props.mode)
        node.setPluginData('mode', `${props.mode}`);
    if (props.c)
        node.setPluginData('c', `${props.c}`);
    if (props.p1)
        node.setPluginData('p1', `${props.p1}`);
    if (props.p2)
        node.setPluginData('p2', `${props.p2}`);
    if (props.r1)
        node.setPluginData('r1', `${props.r1}`);
    if (props.r2)
        node.setPluginData('r2', `${props.r2}`);
    const { width, height } = node;
    const mode = (_a = props.mode) !== null && _a !== void 0 ? _a : node.getPluginData('mode');
    const c = (_b = props.c) !== null && _b !== void 0 ? _b : node.getPluginData('c');
    const p1 = (_c = props.p1) !== null && _c !== void 0 ? _c : node.getPluginData('p1');
    const p2 = (_d = props.p2) !== null && _d !== void 0 ? _d : node.getPluginData('p2');
    const r1 = (_e = props.r1) !== null && _e !== void 0 ? _e : node.getPluginData('r1');
    const r2 = (_f = props.r2) !== null && _f !== void 0 ? _f : node.getPluginData('r2');
    const svg = createSquircleSVG({ width, height, mode, c, p1, p2, r1, r2 });
    const squircle = figma.createNodeFromSvg(svg);
    node.vectorPaths = squircle.vectorPaths;
    squircle.remove();
}

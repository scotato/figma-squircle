import { createSquirclePath, createSquircleSVG } from './squircle'

// get current selection, filter out all non-squircles, if no squircles selected create one

const isSquircle = node => node.getPluginData('curvature')

const squircleProps = node => {
  const curvature = node.getPluginData('curvature')
  const { id, x, y, width, height, vectorPaths } = node
  return { id, x, y, width, height, vectorPaths, curvature }
}

figma.currentPage.selection = figma.currentPage.selection.filter(isSquircle);

if (!figma.currentPage.selection.length) {
  createSquircle({ curvature: 1 })
}

figma.showUI(__html__, { width: 232, height: 102 });

figma.on("selectionchange", () => {
  figma.ui.postMessage(figma.currentPage.selection.filter(isSquircle).map(squircleProps))
})

figma.ui.onmessage = msg => {
  switch (msg.type) {
    case 'create-squircle':
      return createSquircle(msg);
    case 'update-squircle':
      figma.currentPage.selection.filter(isSquircle).map(node => {
        updateSquircle(node as VectorNode, msg)
      })
      return;
    case 'resize':
      figma.currentPage.selection.filter(isSquircle).map(node => {
        node.resize(msg.width, msg.height)
        updateSquircle(node as VectorNode, msg)
      })
      return;
    default:
      return;
  }
};

function createSquircle(props) {
  const nodes = [];
  const svg = createSquircleSVG(props);
  const squircle = figma.createNodeFromSvg(svg);
  squircle.setPluginData('curvature', `${props.curvature}`);
  nodes.push(squircle);
  figma.currentPage.appendChild(squircle);
  figma.currentPage.selection = nodes;
  figma.viewport.scrollAndZoomIntoView(nodes);
}

function updateSquircle(node: VectorNode, props) {
  if (props.curvature) node.setPluginData('curvature', `${props.curvature}`)
  const { width, height } = node
  const curvature = props.curvature ?? node.getPluginData('curvature')
  const svg = createSquircleSVG({ width, height, curvature });
  const squircle = <VectorNode><unknown>figma.createNodeFromSvg(svg);
  node.vectorPaths = squircle.vectorPaths
  squircle.remove()
}

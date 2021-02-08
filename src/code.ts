import { createSquircleSVG, SquircleDefaultProps, SquirclePathProps } from './squircle'

const isSquircle = node => node.getPluginData('c')

const squircleProps = node => {
  const mode = node.getPluginData('mode')
  const c = node.getPluginData('c')
  const p1 = node.getPluginData('p1')
  const p2 = node.getPluginData('p2')
  const r1 = node.getPluginData('r1')
  const r2 = node.getPluginData('r2')
  const { id, width, height } = node
  return { id, width, height, mode, c, p1, p2, r1, r2 }
}

figma.currentPage.selection = figma.currentPage.selection.filter(isSquircle);

if (!figma.currentPage.selection.length) createSquircle()

figma.showUI(__html__, { width: 232, height: 125 });

figma.ui.postMessage({
  type: 'init',
  nodes: figma.currentPage.selection.filter(isSquircle).map(squircleProps)
})

figma.on("selectionchange", () => {
  figma.ui.postMessage({
    type: 'selectionchange',
    nodes: figma.currentPage.selection.filter(isSquircle).map(squircleProps)
  })
})

figma.ui.onmessage = msg => {
  switch (msg.type) {
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

function createSquircle(props: SquirclePathProps = SquircleDefaultProps) {
  const nodes = [];
  const svg = createSquircleSVG(props);
  const squircle = figma.createNodeFromSvg(svg);
  squircle.setPluginData('mode', `${props.mode}`)
  squircle.setPluginData('c', `${props.c}`)
  squircle.setPluginData('p1', `${props.p1}`)
  squircle.setPluginData('p2', `${props.p2}`)
  squircle.setPluginData('r1', `${props.r1}`)
  squircle.setPluginData('r2', `${props.r2}`)
  nodes.push(squircle);
  figma.currentPage.appendChild(squircle);
  figma.currentPage.selection = nodes;
  figma.viewport.scrollAndZoomIntoView(nodes);
}

function updateSquircle(node: VectorNode, props) {
  if (props.mode) node.setPluginData('mode', `${props.mode}`)
  if (props.c) node.setPluginData('c', `${props.c}`)
  if (props.p1) node.setPluginData('p1', `${props.p1}`)
  if (props.p2) node.setPluginData('p2', `${props.p2}`)
  if (props.r1) node.setPluginData('r1', `${props.r1}`)
  if (props.r2) node.setPluginData('r2', `${props.r2}`)

  const { width, height } = node
  const mode = props.mode ?? node.getPluginData('mode')
  const c = props.c ?? node.getPluginData('c')
  const p1 = props.p1 ?? node.getPluginData('p1')
  const p2 = props.p2 ?? node.getPluginData('p2')
  const r1 = props.r1 ?? node.getPluginData('r1')
  const r2 = props.r2 ?? node.getPluginData('r2')
  const svg = createSquircleSVG({ width, height, mode, c, p1, p2, r1, r2 });
  const squircle = <VectorNode><unknown>figma.createNodeFromSvg(svg);
  node.vectorPaths = squircle.vectorPaths
  squircle.remove()
}

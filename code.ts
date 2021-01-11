figma.showUI(__html__);

figma.ui.onmessage = msg => {
  if (msg.type === 'create-squircle') {
    const nodes: SceneNode[] = [];
    const squircle = figma.createNodeFromSvg(msg.squircle)
    figma.currentPage.appendChild(squircle);
    nodes.push(squircle);
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }
  figma.closePlugin();
};

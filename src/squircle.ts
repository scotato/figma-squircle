export function createSquirclePath({ curvature = 1, width = 100, height = 100 } = {}) {
  const cx = width / 2;
  const cy = height / 2;
  const arc = Math.min(cx, cy) * (1 - curvature)

  return `
    M 0 ${cy}
    C 0 ${arc}, ${arc} 0, ${cx} 0
    S ${width} ${arc}, ${width} ${cy}, ${width - arc} ${height}
      ${cx} ${height}, 0 ${height - arc}, 0 ${cy}
  `;
}

export function createSquircleSVG({ curvature = 1, width = 100, height = 100 } = {}) {
  const d = createSquirclePath({ curvature, width, height})
  return `<path id="Squircle" fill="#C4C4C4" d="${d}" />`;
}

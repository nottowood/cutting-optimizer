export const CUT_COLORS = [
  '#e8a631', '#5b9bd5', '#70ad47', '#c55a11',
  '#7f7f7f', '#4472c4', '#a5a5a5', '#ed7d31',
  '#44546a', '#bf9000', '#548235', '#8faadc',
  '#c9c9c9', '#ffc000', '#6a8d3e', '#d6a461',
  '#8db4e2', '#a9b7c6', '#d4a849', '#92b06a',
];

export function getCutColor(index: number): string {
  return CUT_COLORS[index % CUT_COLORS.length];
}

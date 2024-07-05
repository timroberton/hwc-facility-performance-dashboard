export function getLabelMap(
  items: { id: string; label: string }[]
): Record<string, string> {
  return items.reduce<Record<string, string>>((obj, item) => {
    obj[item.id] = item.label;
    return obj;
  }, {});
}

export function getLabelMapFromKeyText(
  items: { value: string; label: string }[]
): Record<string, string> {
  return items.reduce<Record<string, string>>((obj, item) => {
    obj[item.value] = item.label;
    return obj;
  }, {});
}

export function calculateMaxProducibleQuantity(materials, stockMap) {
  if (!materials || materials.length === 0) return Infinity;

  const quantities = materials.map(m => {
    const stock = Number(stockMap[m.rawMaterialId] ?? 0);
    const req = Number(m.requiredQuantity ?? 0);

    if (req <= 0) return Infinity;
    return Math.floor(stock / req);
  });

  return Math.min(...quantities);
}

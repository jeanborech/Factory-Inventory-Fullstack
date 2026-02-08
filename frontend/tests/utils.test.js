import { calculateMaxProducibleQuantity } from "../js/utils.js";

describe("Production logic (real project rules)", () => {

  test("returns Infinity when product has no materials", () => {
    const stockMap = { 1: 10 };
    expect(calculateMaxProducibleQuantity([], stockMap)).toBe(Infinity);
  });

  test("calculates min floor(stock/required) across materials", () => {
    const materials = [
      { rawMaterialId: 1, requiredQuantity: 2 },
      { rawMaterialId: 2, requiredQuantity: 3 },
    ];
    const stockMap = { 1: 10, 
                       2: 9 };

    expect(calculateMaxProducibleQuantity(materials, stockMap)).toBe(3);
  });

  test("treats missing stock as 0 (cannot produce)", () => {
    const materials = [
      { rawMaterialId: 99, requiredQuantity: 1 },
    ];
    const stockMap = {};

    expect(calculateMaxProducibleQuantity(materials, stockMap)).toBe(0);
  });

});

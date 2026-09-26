/** Prisma Decimal, JSON-deserialized number/string from cache, or null. */
type DecimalLike = { toNumber(): number } | number | string | null | undefined;

export function decimalToNumber(value: DecimalLike): number {
  if (value == null) {
    return 0;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return Number(value.toNumber());
}

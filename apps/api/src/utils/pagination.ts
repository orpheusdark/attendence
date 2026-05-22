export function normalizePagination(page?: string, limit?: string) {
  const safePage = Math.max(Number(page ?? 1), 1);
  const safeLimit = Math.min(Math.max(Number(limit ?? 20), 1), 100);
  const skip = (safePage - 1) * safeLimit;
  return { page: safePage, limit: safeLimit, skip };
}
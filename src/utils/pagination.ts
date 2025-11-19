export function paginate<T>(arr: T[], limit = 50, cursor?: string) {
  // cursor is last item id (we return newer items after that); simple approach:
  if (!cursor) {
    const end = Math.max(0, arr.length - limit);
    return {
      items: arr.slice(end),
      nextCursor: arr.length > limit ? arr[arr.length - limit - 1] : undefined,
      total: arr.length,
    };
  }
  const idx = arr.findIndex((x: any) => x.id === cursor);
  if (idx <= 0) return { items: [], nextCursor: undefined, total: arr.length };
  const start = Math.max(0, idx - limit);
  return {
    items: arr.slice(start, idx),
    nextCursor: start > 0 ? (arr[start - 1] as any).id : undefined,
    total: arr.length,
  };
}

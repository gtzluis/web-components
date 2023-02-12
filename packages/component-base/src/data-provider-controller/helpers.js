/**
 * @param {number} effectiveIndex
 * @param {import('./cache.js').Cache} cache
 */
export function getEffectiveIndexInfo(effectiveIndex, cache, level = 0) {
  for (const [index, subCache] of cache.subCaches) {
    if (effectiveIndex <= index) {
      break;
    } else if (effectiveIndex <= index + subCache.effectiveSize) {
      return getEffectiveIndexInfo(effectiveIndex - index - 1, subCache, level + 1);
    }
    effectiveIndex -= subCache.effectiveSize;
  }

  return {
    index: effectiveIndex,
    item: cache.items[effectiveIndex],
    page: Math.floor(effectiveIndex / cache.pageSize),
    level,
    parentCache: cache,
  };
}

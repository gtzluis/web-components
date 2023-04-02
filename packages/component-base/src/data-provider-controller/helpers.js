/**
 * @param {import('./cache.js').Cache} cache
 * @param {number} effectiveIndex
 */
export function getCacheEffectiveIndexInfo(cache, effectiveIndex, level = 0) {
  let cacheIndex = effectiveIndex;

  for (const [index, subCache] of cache.activeSubCaches) {
    if (cacheIndex <= index) {
      break;
    } else if (cacheIndex <= index + subCache.effectiveSize) {
      return getCacheEffectiveIndexInfo(subCache, cacheIndex - index - 1, level + 1);
    }
    cacheIndex -= subCache.effectiveSize;
  }

  return {
    cache,
    cacheIndex,
    item: cache.items[cacheIndex],
    page: Math.floor(cacheIndex / cache.pageSize),
    level,
  };
}

/**
 * @param {import('./cache.js').Cache} cache
 * @param {number} cacheIndex
 */
export function getCacheFlatIndex(cache, cacheIndex) {
  const clampedIndex = Math.max(0, Math.min(cache.size - 1, cacheIndex));

  return cache.activeSubCaches.reduce((prev, [index, subCache]) => {
    return clampedIndex > index ? prev + subCache.effectiveSize : prev;
  }, clampedIndex);
}

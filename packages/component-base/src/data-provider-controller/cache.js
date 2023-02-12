export class Cache {
  items = [];
  pendingRequests = new Map();

  // NOTE: It is intentionally defined as an object
  // to have Object.entries() always index-ordered,
  // no matter in which sequence the sub-caches were added.
  #subCacheByIndex = {};

  /**
   * Used for memoization of the `effectiveSize` getter.
   */
  #effectiveSize;

  constructor(parentItem, parentCache, rootCache, pageSize, size) {
    this.parentItem = parentItem;
    this.parentCache = parentCache;
    this.rootCache = rootCache || this;
    this.pageSize = pageSize;
    this.size = size;
  }

  /**
   * Whether this cache or any of its sub-caches has pending requests.
   *
   * @return {boolean}
   */
  get isLoading() {
    if (this.pendingRequests.size > 0) {
      return true;
    }

    return Object.values(this.#subCacheByIndex).some((subCache) => subCache.isLoading);
  }

  /**
   * An array of `[index, subCache]` tuples where:
   * - `index` is the index of an item in this cache's items array.
   * - `subCache` is a sub-cache associated with that item.
   *
   * The array is index-ordered.
   *
   * TODO: Think of a better naming to possibly avoid interefering with
   * the root cache's getItemSubCaches() method.
   *
   * @return {Array<[number, Cache]>}
   */
  get subCaches() {
    return Object.entries(this.#subCacheByIndex).map(([index, subCache]) => {
      return [parseInt(index), subCache];
    });
  }

  /**
   * A memoized sum of this cache's size + its sub-caches' size.
   * To reset the memoized result, `invalidateEffectiveSize()` needs to be called.
   *
   * @return {number}
   */
  get effectiveSize() {
    if (!this.#effectiveSize) {
      const subCachesEffectiveSize = Object.values(this.#subCacheByIndex).reduce(
        (total, subCache) => total + subCache.effectiveSize,
        0,
      );

      this.#effectiveSize = (this.size || 0) + subCachesEffectiveSize;
    }

    return this.#effectiveSize;
  }

  /**
   * Resets the memoized result of the `effectiveSize` getter
   * for this cache and its ancestor caches.
   * The getter will be recomputed with the next call.
   */
  invalidateEffectiveSize() {
    // Reset the memoized effective size.
    this.#effectiveSize = undefined;
    // Reset the ancestor caches' effective size.
    this.parentCache?.invalidateEffectiveSize();
  }

  setSize(size) {
    this.size = size;
    this.items = this.items.slice(0, Math.min(this.items.length, this.size));
    this.invalidateEffectiveSize();
  }

  setPage(page, items) {
    const startIndex = page * this.pageSize;

    items.forEach((item, i) => {
      this.items[startIndex + i] = item;
    });

    // TODO: This is a copy-paste from the grid's data provider mixin.
    // Find out why size needs to be adjusted only at the sub-level.
    if (this.parentCache) {
      this.size = Math.max(this.items.length, this.size);
    }

    this.items = [...this.items];
  }

  /**
   * Returns whether the given page has been loaded in the cache.
   *
   * @param {number} page
   * @return {boolean}
   */
  isPageLoaded(page) {
    if (this.size === undefined) {
      return false;
    }

    return this.items[page * this.pageSize] !== undefined;
  }

  registerSubCache(subCache, index) {
    this.#subCacheByIndex[index] = subCache;
    this.invalidateEffectiveSize();
  }

  unregisterSubCache(subCache) {
    for (const [index, instance] of Object.entries(this.#subCacheByIndex)) {
      if (subCache === instance) {
        delete this.#subCacheByIndex[index];
        break;
      }
    }

    this.invalidateEffectiveSize();
  }
}

export class Cache {
  /**
   * An items array.
   */
  items = [];

  /**
   * A pending requests map.
   */
  pendingRequests = new Map();

  /**
   * Whether the cache is active.
   *
   * When a cache is active, it is taken into account
   * when calculating the effective size.
   */
  isActive = true;

  // NOTE: It is intentionally defined as an object
  // to make Object.entries() return an index-ordered array
  // no matter in which sequence the keys were actually added.
  #subCacheByIndex = {};

  /**
   * Used for memoization of the `effectiveSize` getter.
   */
  #effectiveSize;

  constructor(parentCache, parentCacheIndex, rootCache, pageSize, size) {
    this.parentCache = parentCache;
    this.parentCacheIndex = parentCacheIndex;
    this.rootCache = rootCache || this;
    this.pageSize = pageSize;
    this.size = size;
  }

  /**
   * An item that the cache is associated with.
   */
  get parentItem() {
    return this.parentCache?.items[this.parentCacheIndex];
  }

  /**
   * An array of `[index, subCache]` tuples where:
   * - `index` is the index of an item in the cache's items array.
   * - `subCache` is a sub-cache associated with that item.
   *
   * The array is index-ordered.
   *
   * TODO: Think of a better naming to possibly avoid interefering with
   * the root cache's getItemSubCaches() method.
   *
   * @return {Array<[number, Cache]>}
   */
  get activeSubCaches() {
    return Object.entries(this.#subCacheByIndex)
      .filter(([_index, subCache]) => subCache.isActive)
      .map(([index, subCache]) => [parseInt(index), subCache]);
  }

  /**
   * A memoized sum of the cache's size + its active sub-caches' size.
   * To reset the memoized result, `invalidateEffectiveSize()` needs to be called.
   *
   * @return {number}
   */
  get effectiveSize() {
    if (!this.#effectiveSize) {
      const subCachesEffectiveSize = this.activeSubCaches.reduce(
        (total, [_index, subCache]) => total + subCache.effectiveSize,
        0,
      );

      this.#effectiveSize = (this.size || 0) + subCachesEffectiveSize;
    }

    return this.#effectiveSize;
  }

  /**
   * Whether the cache or any of its active sub-caches have pending requests.
   *
   * @return {boolean}
   */
  get isLoading() {
    if (this.pendingRequests.size > 0) {
      return true;
    }

    return this.activeSubCaches.some(([_index, subCache]) => subCache.isLoading);
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

  activate() {
    if (!this.isActive) {
      this.isActive = true;
      this.invalidateEffectiveSize();
    }
  }

  deactivate() {
    if (this.isActive) {
      this.isActive = false;
      this.invalidateEffectiveSize();
    }
  }
}

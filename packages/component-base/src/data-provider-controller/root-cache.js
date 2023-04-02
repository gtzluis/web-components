import { Cache } from './cache.js';

export class RootCache extends Cache {
  // TODO: Use the item id as a key instead.
  #subCacheByItem = new Map();

  constructor(pageSize, size) {
    super(null, null, null, pageSize, size);
  }

  getItemSubCaches() {
    return [...this.#subCacheByItem.entries()];
  }

  getItemSubCache(item) {
    return this.#subCacheByItem.get(item);
  }

  createItemSubCache(item, parentCache, parentCacheIndex) {
    const subCache = new Cache(parentCache, parentCacheIndex, this, this.pageSize);

    // Register in the root cache.
    this.#subCacheByItem.set(item, subCache);

    // Register in the parent cache.
    parentCache.registerSubCache(subCache, parentCacheIndex);

    return subCache;
  }
}

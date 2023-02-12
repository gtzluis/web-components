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

  createItemSubCache(item, index, parentCache) {
    const subCache = new Cache(item, parentCache, this, this.pageSize);

    // Register in the parent cache.
    parentCache.registerSubCache(subCache, index);
    // Register in the root cache.
    this.#subCacheByItem.set(item, subCache);

    return subCache;
  }

  removeItemSubCache(item) {
    const subCache = this.getItemSubCache(item);

    // Unregister from the parent cache.
    subCache.parentCache.unregisterSubCache(subCache);
    // Unregister from the root cache.
    this.#subCacheByItem.delete(item);
  }
}

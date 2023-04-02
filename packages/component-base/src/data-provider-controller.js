import { getCacheEffectiveIndexInfo } from './data-provider-controller/helpers.js';
import { RootCache } from './data-provider-controller/root-cache.js';

export class DataProviderController extends EventTarget {
  constructor(host, { size, pageSize, expandedItems, dataProvider, dataProviderParams }) {
    super();
    this.host = host;
    this.pageSize = pageSize;
    this.expandedItems = expandedItems;
    this.dataProvider = dataProvider;
    this.dataProviderParams = dataProviderParams;
    this.rootCache = new RootCache(this.pageSize, size);
  }

  get size() {
    return this.rootCache.size;
  }

  get effectiveSize() {
    return this.rootCache.effectiveSize;
  }

  get isLoading() {
    return this.rootCache.isLoading;
  }

  setSize(size) {
    this.rootCache.setSize(size);
    this.host.requestUpdate();
  }

  setPageSize(pageSize) {
    this.pageSize = pageSize;
    this.clearCache();
    this.host.requestUpdate();
  }

  setDataProvider(dataProvider) {
    this.dataProvider = dataProvider;
    this.clearCache();
    this.host.requestUpdate();
  }

  setExpandedItems(expandedItems) {
    this.expandedItems = expandedItems;

    this.rootCache.getItemSubCaches().forEach(([item, subCache]) => {
      if (this.expandedItems.includes(item)) {
        subCache.activate();
      } else {
        subCache.deactivate();
      }
    });

    this.host.requestUpdate();
  }

  clearCache() {
    this.rootCache = new RootCache(this.pageSize, this.size);
    this.host.requestUpdate();
  }

  getEffectiveIndexInfo(effectiveIndex) {
    return getCacheEffectiveIndexInfo(this.rootCache, effectiveIndex);
  }

  requestEffectiveIndex(effectiveIndex) {
    const { cache, cacheIndex, page, item } = this.getEffectiveIndexInfo(effectiveIndex);

    if (!item) {
      this.#loadPageIntoCache(page, cache);
      return;
    }

    if (this.expandedItems.includes(item)) {
      this.#ensureItemSubCache(item, cache, cacheIndex);
    }

    return item;
  }

  ensureFirstPage() {
    if (!this.rootCache.isPageLoaded(0)) {
      this.#loadPageIntoCache(0, this.rootCache);
    }
  }

  #loadPageIntoCache(page, cache) {
    if (!this.dataProvider || cache.pendingRequests.has(page)) {
      return;
    }

    const params = {
      page,
      pageSize: this.pageSize,
      parentItem: cache.parentItem,
      ...this.dataProviderParams(),
    };

    const callback = (items, size) => {
      if (cache.pendingRequests.get(page) !== callback) {
        return;
      }

      cache.pendingRequests.delete(page);

      if (size !== undefined) {
        cache.setSize(size);
      }

      cache.setPage(page, items);

      this.host.requestUpdate();

      this.dispatchEvent(new CustomEvent('items-loaded'));
    };

    cache.pendingRequests.set(page, callback);
    this.dataProvider(params, callback);

    this.host.requestUpdate();
  }

  #ensureItemSubCache(item, parentCache, parentCacheIndex) {
    let subCache = this.rootCache.getItemSubCache(item);
    if (!subCache) {
      subCache = this.rootCache.createItemSubCache(item, parentCache, parentCacheIndex);
    }

    if (!subCache.isPageLoaded(0)) {
      this.#loadPageIntoCache(0, subCache);
    }
  }
}

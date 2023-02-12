import { getEffectiveIndexInfo } from './data-provider-controller/helpers.js';
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
  }

  setDataProvider(dataProvider) {
    this.dataProvider = dataProvider;
    this.clearCache();
  }

  setExpandedItems(expandedItems) {
    this.expandedItems = expandedItems;

    this.rootCache.getItemSubCaches().forEach(([item, _subCache]) => {
      if (!this.expandedItems.includes(item)) {
        this.rootCache.removeItemSubCache(item);
      }
    });

    this.host.requestUpdate();
  }

  clearCache() {
    this.rootCache = new RootCache(this.pageSize, this.size);
    this.host.requestUpdate();
  }

  getEffectiveIndexInfo(effectiveIndex) {
    return getEffectiveIndexInfo(effectiveIndex, this.rootCache);
  }

  requestEffectiveIndex(effectiveIndex) {
    const { parentCache, page, item, index } = this.getEffectiveIndexInfo(effectiveIndex);

    if (!item) {
      this.#loadPageIntoCache(page, parentCache);
      return;
    }

    if (this.expandedItems.includes(item)) {
      // Think of how to avoid needing to pass `index`
      this.#ensureItemSubCache(item, index, parentCache);
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

      // items.forEach((item) => {
      //   if (this.expandedItems.includes(item)) {
      //     this.#ensureItemSubCache(item, cache);
      //   }
      // });

      this.host.requestUpdate();

      this.dispatchEvent(new CustomEvent('items-loaded'));
    };

    cache.pendingRequests.set(page, callback);
    this.dataProvider(params, callback);

    this.host.requestUpdate();
  }

  #ensureItemSubCache(item, index, parentCache) {
    let subCache = this.rootCache.getItemSubCache(item);
    if (!subCache) {
      subCache = this.rootCache.createItemSubCache(item, index, parentCache);
    }

    if (!subCache.isPageLoaded(0)) {
      this.#loadPageIntoCache(0, subCache);
    }
  }
}

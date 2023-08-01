interface PromisesResult<T> {
    results: Array<{
        status: 'success' | 'fail'
        key: string | number,
        result?: T,
        error?: any
    }>
    successResults: Array<{
        key: string | number,
        result: T
    }>
    failResults: Array<{
        key: string | number,
        error: any
    }>
}

interface Promises<T> {
    key: number | string,
    promise: Promise<T>
}

function executePromisesWithLimit<T extends any>(promises: Array<Promises<T>>, limit: number, cb?: (res: PromisesResult<T>['results'][number]) => void): Promise<PromisesResult<T>> {
    let activePromises = 0;
    let completedPromises = 0;
    let results: PromisesResult<T>['results'] = [];
    let successList: PromisesResult<T>['successResults'] = []
    let failList: PromisesResult<T>['failResults'] = []
    const len = promises.length
    return new Promise((resolve, reject) => {
      function executeNextPromise() {
        if (completedPromises === len) {
          resolve({
              results,
              successResults: successList,
              failResults: failList,
          });
          return;
        }
        if (activePromises < limit && promises.length > 0) {
          const promiseIndex = promises.length - 1;
          const { key, promise } = promises.pop() as Promises<T>;
          activePromises++;
          promise
            .then((result) => {
              results[promiseIndex] = {
                  status: 'success',
                  key,
                  result,
              };
              successList.push({
                  key,
                  result
              })
              cb && cb({
                status: 'success',
                key,
                result,
              })
            })
            .catch((error) => {
              results[promiseIndex] = {
                  status: 'fail',
                  key,
                  error,
              };
              failList.push({
                  key,
                  error
              })
              cb && cb({
                status: 'fail',
                key,
                error,
              })
            }).finally(() => {
              completedPromises++;
              activePromises--;
              executeNextPromise();
            })
  
          executeNextPromise();
        }
      }
      if (len === 0) {
        return resolve({
          results: [],
          successResults: [],
          failResults: [],
        })
      }
      // Start executing promises
      for (let i = 0; i < limit && promises.length > 0; i++) {
        executeNextPromise();
      }
    });
  }

  function isNode() {
    return typeof window !== 'object'
  }

  function toEnvContext<T>(fn: (...res: unknown[]) => T, onlyBrowser = true): T {
    let val: T
    const isCurEnv = onlyBrowser ? !isNode() : isNode()
    if (isCurEnv) {
      val = fn()
    } else {
      // @ts-ignore
      val = null
    }
    return val
  }

  let htmlParser = toEnvContext(() => new window.DOMParser())
  function decodeHtml(input: string) {
    const doc = htmlParser.parseFromString(input, "text/html");
    return doc.documentElement.textContent || '';
  }

  export {
    executePromisesWithLimit,
    decodeHtml,
    isNode,
  }

  export type {
    Promises,
    PromisesResult,
  }
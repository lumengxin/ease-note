import localforage from "localforage";

// 配置不同的驱动优先级
// localforage.config({
//   driver: [
//     localforage.INDEXEDDB,
//     localforage.WEBSQL,
//     localforage.LOCALSTORAGE
//   ],
//   name: 'WebSQL-Rox'
// });

// 此处为驱动的实现
let localDriver = {
  _driver: [
    localforage.INDEXEDDB,
    localforage.WEBSQL,
    localforage.LOCALSTORAGE
  ],
  _initStorage: function(options) {
      // 在此处自定义实现...
  },
  clear: function(callback) {
      // 在此处自定义实现...
  },
  getItem: function(key, callback) {
      // 在此处自定义实现...
  },
  key: function(n, callback) {
      // 在此处自定义实现...
  },
  keys: function(callback) {
      // 在此处自定义实现...
  },
  length: function(callback) {
      // 在此处自定义实现...
  },
  removeItem: function(key, callback) {
      // 在此处自定义实现...
  },
  setItem: async function(key, value, callback) {
    localforage.setItem(key, value).then(function () {
      return localforage.getItem(key);
    }).then(function (value) {
      // we got our value
    }).catch(function (err) {
      // we got an error
    });
  }
}

// 为 localForage 添加驱动。
localforage.defineDriver(localDriver);

localforage.driver();

export default localDriver
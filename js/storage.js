/* Simple localStorage wrapper */
const Storage = {
  get(key, fallback = null) {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? JSON.parse(val) : fallback;
    } catch (e) {
      console.warn('Storage.get error', e);
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage.set error', e);
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('Storage.remove error', e);
    }
  },
  clear() {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('Storage.clear error', e);
    }
  }
};
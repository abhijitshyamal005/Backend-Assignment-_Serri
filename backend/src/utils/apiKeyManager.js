class ApiKeyManager {
  constructor(keys) {
    this.keys = keys;
    this.index = 0;
    this.lastErrorTime = null;
  }
  getKey() {
    return this.keys[this.index];
  }
  rotateKey() {
    this.index = (this.index + 1) % this.keys.length;
    this.lastErrorTime = new Date();
  }
  getCurrentIndex() {
    return this.index;
  }
}

module.exports = ApiKeyManager;

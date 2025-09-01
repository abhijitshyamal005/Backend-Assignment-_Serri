class ApiKeyManager {
  constructor(keys) {
    this.keys = keys;
    this.index = 0;
  }
  getKey() {
    return this.keys[this.index];
  }
  rotateKey() {
    this.index = (this.index + 1) % this.keys.length;
  }
}

module.exports = ApiKeyManager;

const store = new Map();

class MockDirectory {
  constructor(dir) {
    this.dir = dir;
  }
}

class MockFile {
  constructor(...uris) {
    const segments = uris.map(part =>
      typeof part === 'string' ? part : (part.dir ?? ''),
    );
    this.uri = segments.filter(Boolean).join('/');
  }

  create() {
    if (!store.has(this.uri)) {
      store.set(this.uri, '');
    }
  }

  write(content) {
    store.set(this.uri, content);
  }

  async text() {
    return store.get(this.uri) ?? '';
  }

  get exists() {
    return store.has(this.uri);
  }

  delete() {
    store.delete(this.uri);
  }
}

module.exports = {
  File: MockFile,
  Directory: MockDirectory,
  Paths: {
    cache: new MockDirectory('cache'),
    document: new MockDirectory('document'),
  },
};

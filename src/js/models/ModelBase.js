class ModelBase {
  $reset(instance = null) {
    if (instance !== null) {
      Object.assign (this, instance);
    } else {
      Object.assign (this, Object.create (this));
    }
    return this;
  }

  get $defaultValue() {
    return null;
  }

  $beforePrepare(obj) {
    return {};
  }
  $onSend(payload, obj) {
    return payload;
  }
  get $ignoredProperties() {
    return [];
  }

  $prepare(obj) {
    let payload = this.$beforePrepare (obj);

    for (let f in this.$defaultValue) {
      if (!String (f).startsWith ('_') && !String (f).startsWith ('$')) {
        payload[f] = this[f];
      }
    }

    for (let f in obj) {
      if (!String (f).startsWith ('_')) {
        payload[f] = obj[f];
      }
    }

    for (let property of this.$ignoredProperties) {
      Object.defineProperty (payload, property, {
        enumerable: false,
        writable: false,
      });
    }

    return this.$onSend (payload, obj);
  }
}

export default ModelBase;

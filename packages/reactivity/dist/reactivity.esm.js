// packages/reactivity/src/effect.ts
var activeSub;
function effect(fn) {
  activeSub = fn;
  activeSub();
  activeSub = void 0;
}

// packages/reactivity/src/system.ts
function propagate(subs) {
  let link2 = subs;
  const queuedEffect = [];
  while (link2) {
    queuedEffect.push(link2.sub);
    link2 = link2.nextSub;
  }
  queuedEffect.forEach((effect2) => effect2());
}
function link(dep, sub) {
  const newLink = {
    sub,
    nextSub: void 0,
    prevSub: void 0
  };
  if (!dep.subsTail) {
    dep.subs = newLink;
    dep.subsTail = newLink;
  } else {
    dep.subsTail.nextSub = newLink;
    newLink.prevSub = dep.subsTail;
    dep.subsTail = newLink;
  }
}

// packages/reactivity/src/ref.ts
var RefImpl = class {
  _value;
  ["__v_isRef" /* IS_REF */] = true;
  subs;
  subsTail;
  constructor(value) {
    this._value = value;
  }
  get value() {
    trackRef(this);
    return this._value;
  }
  set value(newValue) {
    this._value = newValue;
    trigerRef(this);
  }
};
function ref(value) {
  return new RefImpl(value);
}
function isRef(value) {
  return !!(value && value["__v_isRef" /* IS_REF */]);
}
function trackRef(dep) {
  if (activeSub) {
    link(dep, activeSub);
  }
}
function trigerRef(dep) {
  if (dep.subs) {
    propagate(dep.subs);
  }
}
export {
  RefImpl,
  activeSub,
  effect,
  isRef,
  ref,
  trackRef,
  trigerRef
};
//# sourceMappingURL=reactivity.esm.js.map

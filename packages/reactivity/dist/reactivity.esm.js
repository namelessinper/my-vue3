// packages/reactivity/src/effect.ts
var activeSub;
var ReactiveEffect = class {
  constructor(fn) {
    this.fn = fn;
  }
  deps;
  depsTail;
  run() {
    const prevSub = activeSub;
    activeSub = this;
    this.depsTail = void 0;
    try {
      return this.fn();
    } finally {
      activeSub = prevSub;
    }
  }
  scheduler() {
    this.run();
  }
  notify() {
    this.scheduler();
  }
};
function effect(fn, options) {
  debugger;
  const e = new ReactiveEffect(fn);
  Object.assign(e, options);
  e.run();
  const runner = () => e.run();
  runner.effect = e;
  return runner;
}

// packages/reactivity/src/system.ts
function propagate(subs) {
  let link2 = subs;
  const queuedEffect = [];
  while (link2) {
    queuedEffect.push(link2.sub);
    link2 = link2.nextSub;
  }
  queuedEffect.forEach((effect2) => effect2.notify());
}
function link(dep, sub) {
  const nextDep = sub.depsTail === void 0 ? sub.deps : sub.depsTail.nextDep;
  if (nextDep && nextDep.dep === dep) {
    sub.depsTail = nextDep;
    return;
  }
  const newLink = {
    sub,
    dep,
    nextDep: void 0,
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
  if (sub.depsTail) {
    sub.depsTail.nextDep = newLink;
    sub.depsTail = newLink;
  } else {
    sub.deps = newLink;
    sub.depsTail = newLink;
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
    console.log("get value of ref");
    debugger;
    trackRef(this);
    return this._value;
  }
  set value(newValue) {
    console.log("set value of ref");
    debugger;
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
  ReactiveEffect,
  RefImpl,
  activeSub,
  effect,
  isRef,
  ref,
  trackRef,
  trigerRef
};
//# sourceMappingURL=reactivity.esm.js.map

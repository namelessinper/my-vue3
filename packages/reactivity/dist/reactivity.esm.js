// packages/shared/src/index.ts
function isObject(value) {
  return value !== null && typeof value === "object";
}

// packages/reactivity/src/index.ts
function fn(a, b) {
  return a + b + 2;
}
isObject({});
export {
  fn
};
//# sourceMappingURL=reactivity.esm.js.map

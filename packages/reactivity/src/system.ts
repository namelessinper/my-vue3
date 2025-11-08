import { RefImpl } from './ref'

export interface Link {
  sub: Function
  nextSub: Link | undefined
  prevSub: Link | undefined
}
export function propagate(subs: Link) {
  let link = subs
  const queuedEffect = []
  while (link) {
    queuedEffect.push(link.sub)
    link = link.nextSub
  }
  queuedEffect.forEach(effect => effect())
}

export function link(dep: RefImpl, sub: Function) {
  const newLink: Link = {
    sub,
    nextSub: undefined,
    prevSub: undefined,
  }

  if (!dep.subsTail) {
    dep.subs = newLink
    dep.subsTail = newLink
  } else {
    dep.subsTail.nextSub = newLink
    newLink.prevSub = dep.subsTail
    dep.subsTail = newLink
  }
}

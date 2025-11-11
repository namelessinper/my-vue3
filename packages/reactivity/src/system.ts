import { ReactiveEffect } from './effect'
import { RefImpl } from './ref'

interface Dep {
  subs: Link | undefined
  subsTail: Link | undefined
}
interface Sub {
  deps: Link | undefined
  depsTail: Link | undefined
}
export interface Link {
  sub: Sub
  nextSub: Link | undefined
  prevSub: Link | undefined
  dep: Dep
  nextDep: Link | undefined
}
export function propagate(subs: Link) {
  let link = subs
  const queuedEffect = []
  while (link) {
    queuedEffect.push(link.sub)
    link = link.nextSub
  }
  queuedEffect.forEach(effect => effect.notify())
}

export function link(dep: RefImpl, sub: ReactiveEffect) {
  const nextDep = sub.depsTail === undefined ? sub.deps : sub.depsTail.nextDep
  if (nextDep && nextDep.dep === dep) {
    sub.depsTail = nextDep
    return
  }

  const newLink: Link = {
    sub,
    dep,
    nextDep: undefined,
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

  if (sub.depsTail) {
    sub.depsTail.nextDep = newLink
    sub.depsTail = newLink
  } else {
    sub.deps = newLink
    sub.depsTail = newLink
  }
}

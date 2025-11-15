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

let linkPool: Link
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
    const sub = link.sub as ReactiveEffect
    if (!sub.tracking) {
      queuedEffect.push(sub)
    }
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
  let newLink: Link
  if (linkPool) {
    newLink = linkPool
    linkPool = linkPool.nextDep
    newLink.sub = sub
    newLink.dep = dep
    newLink.nextDep = nextDep
  } else {
    newLink = {
      sub,
      dep,
      nextDep,
      nextSub: undefined,
      prevSub: undefined,
    }
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

export function startTrack(sub: ReactiveEffect) {
  sub.tracking = true
  sub.depsTail = undefined
}

export function endTrack(sub: ReactiveEffect) {
  sub.tracking = false
  const depsTail = sub.depsTail
  if (depsTail) {
    if (depsTail.nextDep) {
      clearTracking(depsTail.nextDep)
      depsTail.nextDep = undefined
    }
  } else if (sub.deps) {
    clearTracking(sub.deps)
    sub.deps = undefined
  }
}

export function clearTracking(link: Link) {
  while (link) {
    const { prevSub, nextSub, nextDep, dep } = link

    /**
     * 如果 prevSub 有，那就把 prevSub 的下一个节点，指向当前节点的下一个
     * 如果没有，那就是头节点，那就把 dep.subs 指向当前节点的下一个
     */
    debugger
    if (prevSub) {
      prevSub.nextSub = nextSub
      link.nextSub = undefined
    } else {
      if (dep) {
        dep.subs = nextSub
      }
    }

    /**
     * 如果下一个有，那就把 nextSub 的上一个节点，指向当前节点的上一个节点
     * 如果下一个没有，那它就是尾节点，把 dep.depsTail 只想上一个节点
     */
    if (nextSub) {
      nextSub.prevSub = prevSub
      link.prevSub = undefined
    } else {
      if (dep) {
        dep.subsTail = prevSub
      }
    }

    link.dep = link.sub = undefined

    /**
     * 把不要的节点给 linkPool，让它去复用吧
     */
    link.nextDep = linkPool
    linkPool = link

    link = nextDep
  }
}

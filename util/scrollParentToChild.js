export default function scrollParentToChild(parent, child, extra = 0) {
  parent.scrollTo({
    top: child.offsetTop - parent.offsetTop + extra,
    behavior: "smooth",
  });
}

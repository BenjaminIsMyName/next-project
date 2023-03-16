// thanks to https://stackoverflow.com/a/45411081
// refactored for my own needs
export default function scrollParentToChild(parent, child, extra = 0) {
  // Where is the parent on page
  var parentRect = parent.getBoundingClientRect();
  // What can you see?
  var parentViewableArea = {
    height: parent.clientHeight,
    width: parent.clientWidth,
  };

  // Where is the child
  var childRect = child.getBoundingClientRect();
  // Is the child viewable?
  var isViewable =
    childRect.top >= parentRect.top &&
    childRect.bottom <= parentRect.top + parentViewableArea.height;

  // if you can't see the child try to scroll parent
  if (!isViewable) {
    // Should we scroll using top or bottom? Find the smaller ABS adjustment
    const scrollTop = childRect.top - parentRect.top;
    const scrollBot = childRect.bottom - parentRect.bottom;
    if (Math.abs(scrollTop) < Math.abs(scrollBot)) {
      // we're near the top of the list
      parent.scrollTo({
        top: parent.scrollTop + scrollTop + extra,
        behavior: "smooth",
      });
    } else {
      // we're near the bottom of the list
      parent.scrollTo({
        top: parent.scrollTop + scrollBot + extra,
        behavior: "smooth",
      });
    }
  }
}

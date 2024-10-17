import React, { useRef, useLayoutEffect } from 'react';

const ProjectGroups = ({ group, activeGroup, scrollHorizontally, selectGroup }) => {
  // Create a new array where the last element is moved to the front
  const reorderedGroup = [group[group.length - 1], ...group.slice(0, -1)];

  // Create refs to store references to each group item and the container
  const groupRefs = useRef([]);
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    // Scroll to the active element when the component loads or activeGroup changes
    const activeIndex = reorderedGroup.findIndex((c) => c.guid === activeGroup);
    if (activeIndex !== -1 && groupRefs.current[activeIndex] && containerRef.current) {
      const activeElement = groupRefs.current[activeIndex];
      const container = containerRef.current;

      // Calculate the distance to center the active element in the container
      const elementLeft = activeElement.offsetLeft;
      const elementWidth = activeElement.offsetWidth;
      const containerWidth = container.offsetWidth;

      // Calculate the scroll position to center the active element
      const scrollLeft = elementLeft - containerWidth / 2 + elementWidth / 2;

      // Smoothly scroll the container to the calculated position
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
    }
  }, [activeGroup, reorderedGroup]);

  return (
    <div
      className="project-groups"
      ref={containerRef}
      onWheel={(e) => scrollHorizontally(e)}
      style={{ overflowX: 'auto', display: 'flex' }}>
      {/* Individual groups */}
      {reorderedGroup.map((c, index) => (
        <div
          key={c.guid}
          ref={(el) => (groupRefs.current[index] = el)}
          className={'pr-group-item ' + (activeGroup === c.guid ? 'active' : '')}
          style={c.color?.length > 0 ? { borderColor: c.color } : { borderColor: '#000000' }}
          onClick={(e) => selectGroup(c.guid, e, c.color, index + 1)}>
          {/* Active project count for each group */}
          <span className="color-circle" style={{ backgroundColor: c.color }}></span>
          <span>{c.name}</span>
          {c.countActiveProject > 0 && (
            <span className="count-indicator">{c.countActiveProject}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectGroups;

import React, { useEffect, useState } from 'react';
function useLoadScroll(ref, limit) {
  const [params, setParams] = useState({
    load: false,
    indexload: null,
    up: false,
  });

  let timer = null;

  const load = () => {
    clearTimeout(timer);

    const scrollableElement = ref.current.getBoundingClientRect();
    const scrollableElementHeight = ref.current.offsetHeight;

    const isHorizontal = scrollableElement.width > scrollableElement.heigh ? true : false;

    const childWidth = ref.current.firstElementChild.offsetWidth;
    const childHeight = ref.current.firstElementChild.offsetHeight;

    const scrollHeight = isHorizontal ? ref.current.scrollWidth : ref.current.scrollHeight;
    const currentScrollPosition = ref.current.scrollTop;

    const indexCenterEl = Math.trunc(limit / 2);
    const indexLoadEl = indexCenterEl; // + 4
    const offsetCenterEl = ref.current.childNodes.item(indexCenterEl).offsetTop;

    let offsetCenterElPost;

    if (ref.current.childNodes.item(indexCenterEl)) {
      offsetCenterElPost = ref.current.childNodes.item(indexCenterEl).offsetTop + childHeight / 2;
    }
    //TO DO горизонтальный
    const centerScroll = offsetCenterEl - scrollableElementHeight / 2 + childHeight / 2;

    if (currentScrollPosition > centerScroll) {
      setParams({
        load: true,
        indexload: indexLoadEl,
        toScroll: offsetCenterElPost ? offsetCenterElPost : null,
      });
    }

    timer = setTimeout(function () {
      setParams({
        load: false,
        indexload: indexLoadEl,
        toScroll: currentScrollPosition,
      });
    }, 100);
  };

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const node = ref.current;
    node.addEventListener('scroll', load);

    return function () {
      node.removeEventListener('scroll', load);
    };
  }, []);

  return params;
}
export default useLoadScroll;

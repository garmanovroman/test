import React, {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ContextMenu } from 'primereact/contextmenu';
import 'primereact/resources/themes/lara-light-cyan/theme.css';

// export interface MenuCardProps {
//   children?: ReactNode;
//   items?:  ContextMenu['props']['model']
// }

const defaultItems = [
  {
    label: 'Любимый',
    icon: 'pi pi-star',
    shortcut: '⌘+D',
  },
  {
    label: 'Добавить',
    icon: 'pi pi-shopping-cart',
    shortcut: '⌘+A',
  },
  {
    separator: true,
  },
  {
    label: 'Поделиться',
    icon: 'pi pi-share-alt',
    items: [
      {
        label: 'Whatsapp',
        icon: 'pi pi-whatsapp',
        badge: 2,
      },
      {
        label: 'Instagram',
        icon: 'pi pi-instagram',
        badge: 3,
      },
    ],
  },
];

// export interface MenuForProductsContextProps {
//   config: {
//     onRightClick: (event: React.SyntheticEvent<HTMLLIElement, Event>, id: string) => void;
//     cmRef: React.RefObject<ContextMenu>;
//     selectedId: string;
//   }
// }

const MenuForProductsContext = createContext({ config: null });

const MenuForProductsMemo = ({ children, items = [] }) => {
  const [selectedId, setSelectedId] = useState('');
  const cmRef = useRef(null);

  const onRightClick = (event, id) => {
    if (cmRef.current) {
      setSelectedId(id);
      cmRef.current.show(event);
    }
  };

  const config = {
    onRightClick,
    cmRef,
    selectedId,
  };

  const listMenu = items && items.length ? items : defaultItems;
  return (
    <>
      <MenuForProductsContext.Provider value={{ config }}>
        {children}
        <ContextMenu
          model={listMenu}
          ref={cmRef}
          breakpoint="767px"
          onHide={() => setSelectedId('')}
        />
      </MenuForProductsContext.Provider>
    </>
  );
};

export const AddMenuForItemsProducts = React.memo(MenuForProductsMemo);

export const useMenuForProductsContext = () => {
  const context = useContext(MenuForProductsContext);
  return !context ? new Error('Нет контекста MenuForProducts') : context;
};

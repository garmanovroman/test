import React, { useRef } from "react";
import { ContextMenu } from "primereact/contextmenu";

export default function BasicDemo() {
  const cm = useRef(null);
  const items = [
    { label: "Папка 1", icon: "pi pi-copy" },
    { label: "Папка 2", icon: "pi pi-file-edit" },
  ];

  return (
    <div className="card flex md:justify-content-center">
      <ContextMenu model={items} ref={cm} breakpoint="767px" />
      <img
        src="https://primefaces.org/cdn/primereact/images/nature/nature3.jpg"
        alt="Logo"
        className="max-w-full"
        onContextMenu={(e) => cm.current.show(e)}
      />
    </div>
  );
}

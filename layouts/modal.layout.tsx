import { PropsWithChildren } from "react";

export default function ModalLayout(props: PropsWithChildren) {
  return (
    <div className="w-screen h-screen bg-[#000000a6] flex items-center justify-center fixed top-0 left-0 z-30">
      {props.children}
    </div>
  );
}

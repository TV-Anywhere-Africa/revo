import { PropsWithChildren } from "react";

export default function MainLayout(props: PropsWithChildren) {
  return (
    <div className="max-w-[1500px] m-auto h-full mt-[100px]">
      {props.children}
    </div>
  );
}

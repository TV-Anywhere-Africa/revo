import Image from "next/image";

export default function LoaderSpinner() {
  return (
    <Image
      src="/assets/logo.png"
      alt="logo"
      className="w-[135px] -ml-5 logo-loader-animate"
      width={135}
      height={135}
    />
  );
}

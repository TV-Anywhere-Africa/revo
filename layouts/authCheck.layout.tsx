import Cookies from "js-cookie";
import { PropsWithChildren } from "react";
import Header from "~/components/Header";
import cookieNames from "~/constants/cookieNames";

const userInfoCookie = Cookies.get(cookieNames.userInfo);

export default function AuthCheckLayout(props: PropsWithChildren): JSX.Element {
  if (userInfoCookie) return <>{props.children}</>;
  return (
    <>
      <Header showAuthModalComponent hideAuthModalCloseButton />
    </>
  );
}

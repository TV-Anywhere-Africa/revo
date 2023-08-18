import { useTheme } from "next-themes";
import Link from "next/link";
import { LuSun, LuMoon, LuSearch, LuX } from "react-icons/lu";
import ROUTES from "~/constants/routes.const";
import useScrollPosition from "~/hooks/useScrollPosition.hook";
import Button from "../Button";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import AuthModal from "../AuthModal";
import { HiUserCircle } from "react-icons/hi";
import Cookies from "js-cookie";
import { useStore } from "~/store";
import { createLog, logout } from "~/services/auth.service";
import toast from "react-hot-toast";
import cookieNames from "~/constants/cookieNames";

const userProfileCookie = Cookies.get(cookieNames.userInfo);

export default function Header({
  isSearching,
  handleSearchQueryChange,
  searchQuery,
  showAuthModalComponent,
  hideAuthModalCloseButton = false,
}: {
  isSearching?: boolean;
  handleSearchQueryChange?: (e: any) => void;
  searchQuery?: string;
  showAuthModalComponent?: boolean;
  hideAuthModalCloseButton?: boolean;
}) {
  const { pathname, push } = useRouter();
  const scrollPosition = useScrollPosition();
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const showAuthModal = useStore(
    (state) => showAuthModalComponent ?? state.showAuthModal
  );
  const setShowAuthModal = useStore((state) => state.setShowAuthModal);
  const [showSearch, setShowSearch] = useState(isSearching ?? false);
  const [query, setQuery] = useState(searchQuery ?? "");
  // const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const [profile] = useState(
    userProfileCookie && JSON.parse(userProfileCookie)
  );
  const toggleShowAuthModal = () => setShowAuthModal(!showAuthModal);
  const toggleShowAccountPopup = (event: any) =>
    setShowAccountPopup(event.type === "mouseenter");

  console.log(profile);

  const toggleShowSearch = () => {
    !pathname.split("/").includes("search")
      ? push(`${ROUTES.search}?query=`)
      : window.history.back();
  };

  return (
    <>
      {showAuthModal && (
        <AuthModal
          show={showAuthModal}
          hideCloseButton={hideAuthModalCloseButton}
          onClose={toggleShowAuthModal}
        />
      )}
      <header
        style={{ color: `${scrollPosition < 100 ? "#ffffffcc" : ""}` }}
        className={`w-screen transition-all h-[100px] fixed top-0 left-0 z-20 dark:text-white px-5 ${
          scrollPosition > 100 &&
          "dark:bg-[#000000d5] bg-[#ffffffcc] text-black backdrop-blur-xl"
        }`}
      >
        <div className="flex items-center justify-between h-full w-full max-w-[1500px] m-auto">
          <div className="flex items-center gap-20">
            <Link href={userProfileCookie ? ROUTES.home : ROUTES.index}>
              <Image
                src="/assets/logo.png"
                alt="logo"
                className="w-[300px] -ml-14"
                width={300}
                height={300}
              />
            </Link>
            <nav className="-ml-[80px] hidden md:block">
              <ul className="flex items-center gap-5">
                {/* <li>
                  <Link
                    className={pathname === ROUTES.genre ? "text-primary" : ""}
                    href={ROUTES.genre}
                  >
                    Movie genre
                  </Link>
                </li> */}
                {/* <li>
                  <Link
                    className={pathname === ROUTES.series ? "text-primary" : ""}
                    href={ROUTES.series}
                  >
                    TV Series
                  </Link>
                </li> */}
                {/* <li>
                  <Link
                    className={
                      pathname === ROUTES.packages ? "text-primary" : ""
                    }
                    href={ROUTES.subscribe}
                  >
                    Subscribe
                  </Link>
                </li> */}
              </ul>
            </nav>
          </div>
          <div className="flex items-center gap-7">
            <div className="flex items-center gap-10 select-none">
              {showSearch && (
                <motion.input
                  autoFocus
                  value={searchQuery ?? query}
                  onChange={handleSearchQueryChange}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  placeholder="Title, Categories, Genre, People"
                  className="p-2 px-3 rounded-full min-w-[300px] outline-none bg-transparent border-2 select-none text-black dark:text-white"
                />
              )}
              {!showSearch ? (
                <LuSearch
                  size={25}
                  onClick={toggleShowSearch}
                  className="cursor-pointer transition-all hover:text-primary"
                />
              ) : (
                <LuX
                  size={25}
                  onClick={toggleShowSearch}
                  className="cursor-pointer transition-all hover:text-primary"
                />
              )}
              {currentTheme === "dark" ? (
                <span
                  className="flex gap-1 items-center hover:text-primary transition-all cursor-pointer"
                  onClick={() => setTheme("light")}
                >
                  <LuSun size={25} />
                  <small>Light</small>
                </span>
              ) : (
                <span
                  className="flex gap-1 items-center hover:text-primary transition-all cursor-pointer"
                  onClick={() => setTheme("dark")}
                >
                  <LuMoon size={25} />
                  <small>Dark</small>
                </span>
              )}
            </div>
            {!profile ? (
              <Button onClick={toggleShowAuthModal}>Sign In / Sign Up</Button>
            ) : (
              <div
                className="relative"
                onMouseEnter={toggleShowAccountPopup}
                onMouseLeave={toggleShowAccountPopup}
              >
                <HiUserCircle
                  size={35}
                  className="cursor-pointer hover:text-primary transition-all"
                />
                {showAccountPopup && (
                  <motion.div
                    initial={{ y: 10 }}
                    animate={{ y: 0 }}
                    className="dark:bg-gray-900 bg-white text-black dark:text-white shadow-2xl text-sm rounded-md absolute top-8 right-0 w-[200px]"
                  >
                    <ul className="grid gap-2 rounded-md">
                      {ACCOUNT_POPUP_LINKS.map((item, index: number) => (
                        <li
                          key={index}
                          className="dark:hover:bg-gray-800 hover:bg-gray-100 py-2 px-4 transition-all cursor-pointer select-none"
                        >
                          {item.action ? (
                            <p onClick={item.action}>{item.label}</p>
                          ) : (
                            <Link href={item.link}>
                              <p>{item.label}</p>
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

const ACCOUNT_POPUP_LINKS = [
  {
    label: "My account",
    link: ROUTES.account,
  },
  { label: "My watch history", link: ROUTES.watchHistory },
  // { label: "My Playlist", link: "" },
  { label: "Favourites", link: ROUTES.favorites },
  {
    label: "Logout",
    action: async () =>
      await logout()
        .then(async () => {
          await createLog({ action: "logout" });
          // console.log(response);
          Cookies.remove(cookieNames.userInfo);
          Cookies.remove(cookieNames.profile);
          Cookies.remove(cookieNames.mobileNumber);
          Cookies.remove(cookieNames.email);
          // Cookies.remove("device");
          // Cookies.remove("device_info");
          window.location.href = ROUTES.index;
        })
        .catch((error) => toast.error(error.message)),
  },
];

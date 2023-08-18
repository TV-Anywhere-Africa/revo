import Image from "next/image";
import Link from "next/link";
import { BsTwitter } from "react-icons/bs";
import { FaFacebook, FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiInstagramFill } from "react-icons/ri";
import ROUTES from "~/constants/routes.const";

export default function Footer() {
  return (
    <footer className="dark:bg-[#252a30] bg-gray-900 text-white mt-10">
      {/* <footer className="dark:bg-[#252a30] bg-gray-900 text-white mt-10"> */}
      <>
        <div className="max-w-[1500px] m-auto p-8">
          <ul className="flex flex-col md:flex-row gap-10 justify-between">
            <li>
              <h3 className="text-xl font-[500]">Connect with us</h3>
              <ul className="flex items-center gap-5 mt-5">
                <li>
                  <Link
                    target="blank_"
                    rel="noreferer"
                    href="https://www.facebook.com/mCinitv"
                  >
                    <FaFacebook
                      className="hover:text-primary transition-all"
                      size={30}
                    />
                  </Link>
                </li>
                <li>
                  <Link
                    target="blank_"
                    rel="noreferer"
                    href="https://twitter.com/mcinitv"
                  >
                    <BsTwitter
                      className="hover:text-primary transition-all"
                      size={30}
                    />
                  </Link>
                </li>
                <li>
                  <Link
                    target="blank_"
                    rel="noreferer"
                    href="https://instagram.com/mcinitv"
                  >
                    <RiInstagramFill
                      className="hover:text-primary transition-all"
                      size={30}
                    />
                  </Link>
                </li>
              </ul>
            </li>
            {/* <li>
              <h3 className="text-xl font-[500]">Categories</h3>
              <ul className="grid gap-3 mt-5 text-gray-400">
                <li>
                  <Link href={ROUTES.genre}>Movie Genre</Link>
                </li>
                <li>
                  <Link href={ROUTES.series}>TV Series</Link>
                </li>
                <li>
                  <Link href="/">Country</Link>
                </li>
              </ul>
            </li> */}
            <li>
              <h3 className="text-xl font-[500]">Contact Information</h3>
              <ul className="grid gap-3 mt-5 text-gray-400">
                {/* <li>
                  <Link href="tel:+233559417418" className="flex gap-3">
                    <FaPhoneAlt />
                    <p>+233 559 417 418</p>
                  </Link>
                </li> */}
                <li>
                  <Link href="mailto:support@mcini.tv" className="flex gap-3">
                    <MdEmail />
                    <p>support@mcini.tv</p>
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <h3 className="text-xl font-[500]">About</h3>
              <ul className="grid gap-3 mt-5 text-gray-400">
                <li>
                  <Link href={ROUTES.privacy}>Privacy</Link>
                </li>
                <li>
                  <Link href={ROUTES.terms}>Terms of Use</Link>
                </li>
                <li>
                  <Link href={ROUTES.faq}>FAQ</Link>
                </li>
              </ul>
            </li>
            <li>
              <h3 className="text-xl font-[500]">App Stores</h3>
              <ul className="flex items-center gap-5 mt-5">
                <li>
                  <Link href="/">
                    <Image
                      src="/assets/play-store.svg"
                      alt="play store icon"
                      width={130}
                      height={130}
                    />
                  </Link>
                </li>
                <li>
                  <Link href="/">
                    <Image
                      src="/assets/app-store.svg"
                      alt="play store icon"
                      width={130}
                      height={130}
                    />
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </>
      <div className="dark:bg-[#2f353b] bg-[#232a3a] p-5 text-center">
        <p className="text-md text-gray-200">
          Copyright &copy;{new Date().getFullYear()} mCini Inc.
        </p>
      </div>
    </footer>
  );
}

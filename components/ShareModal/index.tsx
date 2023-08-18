import Image from "next/image";
import { FiX } from "react-icons/fi";
import { AiOutlineLink, AiOutlineTwitter } from "react-icons/ai";
import { CgFacebook } from "react-icons/cg";
import { RiWhatsappFill } from "react-icons/ri";
import ModalLayout from "~/layouts/modal.layout";
import Link from "next/link";
import { motion } from "framer-motion";
import copyToClipboard from "~/utils/copyToClipboard.util";
import { useRouter } from "next/router";

export default function ShareModal({
  show,
  onClose,
  image,
  text,
}: {
  show: boolean;
  onClose: () => void;
  image?: string;
  text: string;
}): JSX.Element {
  const fullUrl = typeof window !== "undefined" ? window.location.href : "";
  const whatsappLink = `https://wa.me/?text=Watch ${text} on ${fullUrl}`;
  if (!show) return <></>;
  return (
    <ModalLayout>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white text-black rounded-md w-full max-w-[500px] mx-5"
      >
        <div className="flex items-center justify-between border-b p-5 px-7">
          <h3 className="text-2xl">Share</h3>
          <FiX
            onClick={onClose}
            className="cursor-pointer transition-all hover:text-primary"
          />
        </div>
        <div className="p-5 px-7 py-10 flex items-center gap-10">
          {image && (
            <Image
              src={image}
              alt={text}
              width={100}
              height={100}
              className="w-[100px] h-[100px] rounded-xl object-cover"
            />
          )}
          <p className="text-xl font-[500]">{text}</p>
        </div>
        <div className="flex items-center justify-between border-t p-5 px-7">
          <p>Share using</p>
          <ul className="flex gap-5">
            <li
              className="bg-gray-200 p-2 rounded-full cursor-pointer hover:opacity-50 transition-all"
              onClick={() => copyToClipboard(window.location.href)}
            >
              <AiOutlineLink size={25} />
            </li>
            <li className="bg-[#3B5997] p-2 rounded-full cursor-pointer hover:opacity-50 transition-all">
              <CgFacebook size={25} className="text-white" />
            </li>
            <li className="bg-[#26A7D2] p-2 rounded-full cursor-pointer hover:opacity-50 transition-all">
              <Link
                rel="noreferer"
                target="_blank"
                href={`https://twitter.com/intent/tweet?text=${text}&url=${window.location.href}`}
              >
                <AiOutlineTwitter size={25} className="text-white" />
              </Link>
            </li>
            <li
              className="bg-[#25D366] p-2 rounded-full cursor-pointer hover:opacity-50 transition-all"
              onClick={() => window.open(whatsappLink)}
            >
              <RiWhatsappFill size={25} className="text-white" />
            </li>
          </ul>
        </div>
      </motion.div>
    </ModalLayout>
  );
}

import { motion } from "framer-motion";
import Link from "next/link";
import { FiX } from "react-icons/fi";
import ROUTES from "~/constants/routes.const";
import ModalLayout from "~/layouts/modal.layout";
import Button from "../Button";
import { FormEvent, useEffect, useState } from "react";
import { AuthTypes } from "~/types";
import toast from "react-hot-toast";
import {
  generateOTP,
  signIn,
  signUp,
  verifyOTP,
} from "~/services/auth.service";
import Cookies from "js-cookie";
import isEmail from "~/utils/isEmail.util";
import cookieNames from "~/constants/cookieNames";

export default function AuthModal({
  show,
  onClose,
  hideCloseButton = false,
}: {
  show: boolean;
  onClose: () => void;
  hideCloseButton?: boolean;
}): JSX.Element {
  const [tcAgreed, setTCAgreed] = useState(false);
  const [authType, setAuthType] = useState<AuthTypes>("SIGN-IN");
  const [email, setEmail] = useState("");
  const [emailOrMobileNumber, setEmailOrMobileNumber] = useState("");
  const [otp, setOTP] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isVerifyOTP, setIsVerifyOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  // const generateOTPQuery = useMutation(generateOTP);
  // const generateOTPQuery = useQuery({
  //   queryKey: "generate-otp",
  //   queryFn: () => {
  //     generateOTP(emailOrMobileNumber);
  //   },
  //   enabled: false,
  // });

  useEffect(() => {
    if (authType === "SIGN-IN") setTCAgreed(true);
    else setTCAgreed(false);
  }, [authType]);

  const switchAuthTypes = () => {
    switch (authType) {
      case "SIGN-IN":
        setAuthType("SIGN-UP");
        break;
      case "SIGN-UP":
        setAuthType("SIGN-IN");
        break;
      default:
        break;
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    if (
      (emailOrMobileNumber && emailOrMobileNumber.split("")[0] !== "0") ||
      (mobileNumber && mobileNumber.split("")[0] !== "0")
    ) {
      toast.error("Mobile number should start with 0");
      return;
    }

    if (
      (emailOrMobileNumber && emailOrMobileNumber.length !== 10) ||
      (mobileNumber && mobileNumber.length !== 10)
    ) {
      toast.error("Mobile number must be 10 digits");
      return;
    }

    storeCredsAsCookie();
    setLoading(true);

    try {
      let otpResponse = await generateOTP(
        authType === "SIGN-UP" ? mobileNumber : emailOrMobileNumber
      );
      if (otpResponse.status === "ok") {
        toast.success(otpResponse.message);
        setIsVerifyOTP(true);
        setLoading(false);
      } else {
        toast.error(otpResponse.message);
        console.log(otpResponse.message);
        setLoading(false);
      }
    } catch (error: any) {
      toast.error(error.message);
      console.log(error.message);
      setLoading(false);
    }
  };

  const onVerifyOTP = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    verifyOTP(authType === "SIGN-UP" ? mobileNumber : emailOrMobileNumber, otp)
      .then(async (response) => {
        console.log(response);
        console.log(response.status);
        console.log(authType);
        if (response.status === "ok") {
          if (authType === "SIGN-UP") {
            await signUp(mobileNumber, email);
          } else await signIn(emailOrMobileNumber);
          setTimeout(async () => {
            toast.success(response.message);
            console.log(authType);
            if (authType === "SIGN-UP") {
              await signUp(mobileNumber, email);
            } else await signIn(emailOrMobileNumber);
            setLoading(false);
          }, 2000);
        } else {
          toast.error(response.message);
          console.log(response.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error.message);
        if (error.message === "invalid login credentials") {
          setAuthType("SIGN-UP");
          setIsVerifyOTP(false);
        } else toast.error(error.message);
        setLoading(false);
      });
  };

  function storeCredsAsCookie() {
    console.warn("storing cookies...", emailOrMobileNumber, mobileNumber);
    Cookies.remove(cookieNames.mobileNumber);
    Cookies.remove(cookieNames.email);
    // Cookies.set(cookieNames.mobileNumber, mobileNumber);
    // Cookies.set(cookieNames.email, email);
    // first remove stored creds and create new ones in cookie to prevent conflicts incase there's a previous session and this is a new login
    // Cookies.remove(cookieNames.email);
    // Cookies.remove(cookieNames.mobileNumber);
    // mobileNumber &&
    //   Cookies.set(cookieNames.username, `${operatorUID}${mobileNumber}`);

    if (mobileNumber) Cookies.set(cookieNames.mobileNumber, mobileNumber);
    else if (isEmail(emailOrMobileNumber)) {
      Cookies.set(cookieNames.email, emailOrMobileNumber);
    } else {
      Cookies.set(cookieNames.mobileNumber, emailOrMobileNumber);
    }
  }

  if (!show) return <></>;

  return (
    <ModalLayout>
      <motion.div
        initial={{ opacity: 0, y: -400 }}
        animate={{ opacity: 1, y: -300 }}
        className="w-full max-w-[450px] m-5"
      >
        {!isVerifyOTP ? (
          <form
            onSubmit={submit}
            className={`${
              authType === "SIGN-UP" ? "mt-[380px]" : "mt-[300px]"
            }  text-white`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-3xl">
                Sign {authType === "SIGN-IN" ? "In" : "Up"}
              </h3>
              {!hideCloseButton ? (
                <FiX
                  onClick={onClose}
                  className="cursor-pointer hover:text-primary transition-all"
                  size={33}
                />
              ) : (
                <div />
              )}
            </div>
            <div className="p-10 rounded-md bg-white text-black dark:text-white dark:bg-black border border-gray-800 grid gap-5">
              {authType === "SIGN-UP" && (
                <div className="grid gap-2">
                  <label className="text-sm">Phone number</label>
                  <input
                    className="w-full p-2 px-3 rounded-md bg-transparent border border-gray-800 outline-none"
                    type="number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="0551234567"
                    required
                    min={10}
                  />
                </div>
              )}
              {authType === "SIGN-IN" ? (
                <div className="grid gap-2">
                  <label className="text-sm">Phone number</label>
                  <input
                    className="w-full p-2 px-3 rounded-md bg-transparent border border-gray-800 outline-none"
                    value={emailOrMobileNumber}
                    onChange={(e) => setEmailOrMobileNumber(e.target.value)}
                    placeholder="0551234567"
                    required
                    type="number"
                  />
                </div>
              ) : (
                <div className="grid gap-2">
                  <label className="text-sm">Email (optional)</label>
                  <input
                    className="w-full p-2 px-3 rounded-md bg-transparent border border-gray-800 outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="john@acme.com"
                  />
                </div>
              )}
              {authType === "SIGN-UP" && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={tcAgreed.toString()}
                    onChange={(e) => setTCAgreed(e.target.checked)}
                    className="mt-2 cursor-pointer"
                  />
                  <small className="mt-2">
                    I agree to the
                    <Link
                      className="text-primary hover:underline"
                      href={ROUTES.terms}
                      rel="noreferrer"
                      target="_blank"
                    >
                      &nbsp;Terms and Conditions
                    </Link>
                  </small>
                </div>
              )}
              <Button
                className={`${
                  tcAgreed ? "opacity-100" : "opacity-50"
                } rounded-sm mt-3`}
                disabled={authType === "SIGN-UP" && !tcAgreed}
                loading={loading}
              >
                {authType === "SIGN-UP" ? "Sign Up" : "Sign In"}
              </Button>
              <div className="flex items-center justify-center gap-3">
                <div className="h-[1px] w-[30px] dark:bg-white bg-gray-300" />
                <p>OR</p>
                <div className="h-[1px] w-[30px] dark:bg-white bg-gray-300" />
              </div>
              <div className="text-center flex justify-center">
                <p>
                  {authType === "SIGN-IN"
                    ? "Don't have an account?"
                    : "Already a member?"}
                </p>
                <p
                  onClick={switchAuthTypes}
                  className="text-primary hover:underline cursor-pointer select-none"
                >
                  &nbsp;{authType === "SIGN-IN" ? "Sign Up" : "Sign In"}
                </p>
              </div>
              {/* {authType === "SIGN-IN" && (
                <Link
                  href={ROUTES.forgotPassword}
                  className="text-primary text-center hover:underline cursor-pointer select-none"
                >
                  Forgot password?
                </Link>
              )} */}
            </div>
          </form>
        ) : (
          <form
            onSubmit={onVerifyOTP}
            className={`${
              authType === "SIGN-UP" ? "mt-[380px]" : "mt-[300px]"
            }  text-white`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-3xl">Verify OTP</h3>
              <p
                onClick={() => setIsVerifyOTP(false)}
                className="underline text-primary cursor-pointer"
              >
                Change number
              </p>
            </div>
            <div className="p-10 rounded-md bg-white text-black dark:text-white dark:bg-black border border-gray-800 grid gap-5">
              <div className="grid gap-2">
                <label className="text-sm">OTP code</label>
                <input
                  className="w-full p-2 px-3 rounded-md bg-transparent border border-gray-800 outline-none"
                  type="number"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value)}
                  placeholder="012345"
                  required
                  min={6}
                />
              </div>
              <Button
                className="rounded-sm mt-3"
                onClick={onVerifyOTP}
                loading={loading}
              >
                Verify
              </Button>
            </div>
          </form>
        )}
      </motion.div>
    </ModalLayout>
  );
}

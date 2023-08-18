import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BiUser } from "react-icons/bi";
import { FiRefreshCcw, FiUser, FiX } from "react-icons/fi";
import { MdOutlineDevices } from "react-icons/md";
import Button from "~/components/Button";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import Meta from "~/components/Meta";
import ROUTES from "~/constants/routes.const";
import { Device, Profile, Purchase } from "~/interface";
import AuthCheckLayout from "~/layouts/authCheck.layout";
import {
  changePassword,
  fetchUserDevices,
  getUserProfileCookie,
  removeUserDevice,
  signIn,
  updateProfile,
} from "~/services/auth.service";
import {
  cancelPurchaseSubscription,
  fetchPurchaseHistory,
  stopSubscriptionAutoRenewal,
} from "~/services/packages.service";
import capitalizeFirstLetters from "~/utils/capitaliseFirstLetters.util";
import { AiOutlineCreditCard } from "react-icons/ai";

const userProfileCookie = getUserProfileCookie();

const TABS: {
  label: string;
  icon: JSX.Element;
  link?: string;
}[] = [
  {
    label: "Overview",
    icon: <BiUser />,
  },
  {
    label: "My Devices",
    icon: <MdOutlineDevices />,
  },
  // {
  //   label: "Account Management",
  //   icon: <FiUser />,
  // },
  {
    label: "Manage Subscriptions",
    icon: <AiOutlineCreditCard />,
  },
  // {
  //   label: "My Privacy",
  //   icon: <FiUser />,
  //   link: ROUTES.privacy,
  // },
];

export default function Account(): JSX.Element {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(TABS[0].label);

  return (
    <AuthCheckLayout>
      <Header />
      <main className="max-w-[1500px] mx-auto mt-[100px] py-10 px-5">
        <h2 className="text-3xl font-[500]">Account</h2>
        <div className="bg-gray-100 dark:bg-gray-800 flex flex-col md:flex-row rounded-sm mt-5">
          <div className="flex-1">
            <ul className="flex md:block overflow-x-scroll">
              {TABS.map((tab, index: number) => (
                <li
                  onClick={() => {
                    tab.link ? router.push(tab.link) : setActiveTab(tab.label);
                  }}
                  className={`select-none hover:dark:bg-gray-900 hover:opacity-50 cursor-pointer p-5 transition-all flex items-center gap-2 ${
                    activeTab === tab.label && "bg-primary"
                  }`}
                  key={index}
                >
                  {tab.icon}
                  <h3 className="text-md whitespace-nowrap">{tab.label}</h3>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-[4] p-5 md:p-10">
            <AccountOverview activeTab={activeTab} />
            <Devices activeTab={activeTab} />
            {/* <AccountDetails activeTab={activeTab} /> */}
            <ManageSubscriptions activeTab={activeTab} />
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </AuthCheckLayout>
  );
}

function ManageSubscriptions({
  activeTab,
}: {
  activeTab: string;
}): JSX.Element {
  const [purchases, setPurchases] = useState<Purchase[]>();
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    (async () => {
      await fetchPurchaseHistory()
        .then((response) => setPurchases(response))
        .catch((error) => toast.error(error.message));
    })();
  }, [cancelling]);

  const cancelPurchase = async (packageID: string | number) => {
    let confirmCancel = confirm(
      "Are you sure you want to cancel this purchase?"
    );
    if (confirmCancel) {
      setCancelling(true);
      await cancelPurchaseSubscription(packageID)
        .then((response) => toast.success(response))
        .catch((error) => toast.error(error.message));
      setCancelling(false);
    }
  };

  const cancelAutoRenewal = async (packageID: string | number) => {
    let confirmCancel = confirm("Are you sure you want to stop auto renewal?");
    if (confirmCancel) {
      setCancelling(true);
      await stopSubscriptionAutoRenewal(packageID)
        .then((response) => toast.success(response))
        .catch((error) => toast.error(error.message));
      setCancelling(false);
    }
  };

  if (activeTab === TABS[2].label)
    return (
      <>
        <Meta title="Account - Subscriptions" />
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {purchases && purchases?.length < 2 && (
            <p className="">You have no subscriptions</p>
          )}
          {purchases?.map(
            (purchase: Purchase, index: number) =>
              purchase.product_name !== "Free To Watch" && (
                <li
                  key={index}
                  className="border p-3 rounded-md border-gray-500 gap-3 grid w-full hover:shadow-2xl transition-all"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-[500]">
                      {purchase.product_name}
                    </h3>
                    <p className="text-primary">
                      {purchase.currency}
                      {purchase.price}
                    </p>
                  </div>
                  <small className="opacity-60">
                    From {purchase.purchase_date.replaceAll("-", " ")} to&nbsp;
                    {purchase.end_date.replaceAll("-", " ")}
                  </small>
                  <small>{purchase.status}</small>
                  <div className="text-sm w-full mt-5">
                    {/* <Button
                      onClick={() => cancelPurchase(purchase.product_id)}
                      variant="ghost"
                      className="w-full hover:bg-red-300 hover"
                      loading={cancelling}
                    >
                      <FiX />
                      Cancel subscription
                    </Button> */}
                    {purchase.subscription_type === "auto-renewal" && (
                      <Button
                        onClick={() => cancelAutoRenewal(purchase.product_id)}
                        className="w-full hover:text-red-300"
                        variant="text"
                        loading={cancelling}
                      >
                        <FiX />
                        Unsubscribe
                      </Button>
                    )}
                  </div>
                </li>
              )
          )}
        </ul>
      </>
    );
  return <></>;
}

function AccountOverview({ activeTab }: { activeTab: string }): JSX.Element {
  const [isEditMode, setIsEditMode] = useState(false);
  const [firstName, setFirstName] = useState(
    userProfileCookie.first_name ?? ""
  );
  const [lastName, setLastName] = useState(userProfileCookie.last_name ?? "");
  const [email, setEmail] = useState(userProfileCookie.email ?? "");
  const [country, setCountry] = useState(userProfileCookie.country ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(
    userProfileCookie.date_of_birth ?? ""
  );
  const [mobileNumber, setMobileNumber] = useState(
    userProfileCookie.phone_number ?? ""
  );

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const styles = {
    input:
      "outline-none border-b border-gray-600 p-1 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed",
  };

  const onSave = async () => {
    await updateProfile({
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth,
    })
      .then(async (response) => {
        const profileInfo: Profile = getUserProfileCookie();
        await signIn(profileInfo.phone_number)
          .then(() => toast.success(response.message))
          .catch((error) => toast.error(error.message));
      })
      .catch((error) => toast.error(error.message));
  };

  if (activeTab === TABS[0].label)
    return (
      <>
        <Meta title={`Account - ${TABS[0].label}`} />
        <div>
          <ul className="grid gap-4">
            <li className="flex gap-3 items-center">
              <p className="">Account Name: </p>
              {!isEditMode ? (
                <span className="font-[500]">
                  {capitalizeFirstLetters(userProfileCookie.first_name)}
                  &nbsp;{capitalizeFirstLetters(userProfileCookie.last_name)}
                </span>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={styles.input}
                    placeholder="First name"
                  />
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={styles.input}
                    placeholder="Last name"
                  />
                </div>
              )}
            </li>
            <li className="flex gap-3 items-center">
              <p className="">Country: </p>
              {!isEditMode ? (
                <span className="font-[500]">{userProfileCookie.country}</span>
              ) : (
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  disabled
                  className={styles.input}
                  placeholder="eg. Ghana"
                />
              )}
            </li>
            <li className="flex gap-3 items-center">
              <p className="">Email: </p>
              {!isEditMode ? (
                <span className="font-[500]">{userProfileCookie.email}</span>
              ) : (
                <input
                  disabled
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@acme.com"
                />
              )}
            </li>
            <li className="flex gap-3 items-center">
              <p className="">Phone number: </p>
              {!isEditMode ? (
                <span className="font-[500]">
                  {userProfileCookie.phone_number}
                </span>
              ) : (
                <input
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  disabled
                  className={styles.input}
                  placeholder="john@acme.com"
                />
              )}
            </li>
            <li className="flex gap-3 items-center">
              <p className="">Date of birth: </p>
              {!isEditMode ? (
                <span className="font-[500]">
                  {userProfileCookie.date_of_birth}
                </span>
              ) : (
                <input
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  type="date"
                  className={styles.input}
                />
              )}
            </li>
          </ul>
          <div className="mt-10 -ml-5 w-full flex items-center gap-3">
            {isEditMode ? (
              <>
                <Button onClick={onSave} className="rounded-sm ml-4">
                  Save
                </Button>
                <Button
                  variant="text"
                  onClick={toggleEditMode}
                  className="rounded-sm"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="text"
                onClick={toggleEditMode}
                className="text-primary rounded-sm"
              >
                Edit your profile
              </Button>
            )}
          </div>
        </div>
      </>
    );
  return <></>;
}

function Devices({ activeTab }: { activeTab: string }): JSX.Element {
  const [devices, setDevices] = useState<Device[]>([]);
  const [removingDevice, setRemovingDevice] = useState(false);

  useEffect(() => {
    (async () => {
      await fetchUserDevices()
        .then((response) => setDevices(response))
        .catch((error) => console.log(error.message));
    })();
  }, [removingDevice]);

  const handleRemoveDevice = async (uid: string) => {
    setRemovingDevice(true);
    await removeUserDevice(uid)
      .then((response) => {
        toast.remove();
        toast.success("Device removed");
      })
      .catch((error) => toast.error(error.message));
    setRemovingDevice(false);
  };

  if (activeTab === TABS[1].label)
    return (
      <>
        <Meta title={`Account - ${TABS[1].label}`} />
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {devices.map((device: Device, index: number) => (
            <li
              key={index}
              className="border p-3 rounded-md border-gray-500 gap-3 grid w-full hover:shadow-2xl transition-all"
            >
              <div className="flex items-center justify-between">
                <p>{device.os}</p>
                {device.is_deletable && (
                  <FiX
                    onClick={() => handleRemoveDevice(device.uid)}
                    className="hover:text-red-400 transition-all cursor-pointer"
                  />
                )}
              </div>
              <p className="text-sm opacity-60">{device.device_type.uid}</p>
            </li>
          ))}
        </ul>
      </>
    );
  return <></>;
}

function AccountDetails({ activeTab }: { activeTab: string }): JSX.Element {
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("1234567");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const onChangePassword = async () => {
    if (confirmNewPassword !== newPassword) {
      toast.error("Passwords do not match");
      return;
    }
    await changePassword(newPassword)
      .then((response) => toast.success(response))
      .catch((error) => toast.error(error.message));
  };

  if (activeTab === TABS[2].label)
    return (
      <>
        <Meta title={`Account - ${TABS[2].label}`} />
        <h3 className="text-xl mb-3">Change Password</h3>
        <div className="grid gap-4 max-w-xl my-5">
          <input
            className="p-3 rounded-md w-full bg-transparent border border-gray-700 outline-none"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current Password"
          />
          <div className="flex gap-3">
            <input
              className="p-3 rounded-md w-full bg-transparent border border-gray-700 outline-none"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
            />
            <input
              className="p-3 rounded-md w-full bg-transparent border border-gray-700 outline-none"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Re-enter Password"
            />
          </div>
        </div>
        <Button onClick={onChangePassword} className="w-max">
          Update password
        </Button>
      </>
    );
  return <></>;
}

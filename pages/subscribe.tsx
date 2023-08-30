import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Button from "~/components/Button";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import SubscriptionCard from "~/components/SubscriptionCard";
import { ISubscription, Network } from "~/interface";
import ModalLayout from "~/layouts/modal.layout";
import { purchaseSubscription } from "~/services/packages.service";
import Meta from "~/components/Meta";
import AuthCheckLayout from "~/layouts/authCheck.layout";
// import { createLog } from "~/services/auth.service";

const SUBSCRIPTIONS: ISubscription[] = [
  {
    name: "Daily",
    price: "1.50",
    uid: "mcini1day",
    id: "1010",
    duration: "Daily",
    features: [
      "Watch on 3 screens at the same time",
      "Unlimited HD movies",
      "Stream from laptop, phone, tablet and smart TVs",
    ],
  },
  {
    name: "Weekly",
    price: "8.00",
    duration: "Week",
    uid: "mcini7days",
    id: "1011",
    features: [
      "Watch on 3 screens at the same time",
      "Unlimited HD movies",
      "Stream from laptop, phone, tablet and smart TVs",
    ],
  },
];

const NETWORKS: Network[] = [
  { name: "MTN", uid: "mtn", image: "/assets/networks/mtn.png" },
  { name: "Glo", uid: "glo", image: "/assets/networks/glo.png" },
  { name: "Vodafone", uid: "vdf", image: "/assets/networks/vodafone.png" },
  {
    name: "Airtel/Tigo",
    uid: "atl",
    image: "/assets/networks/airtel-tigo.png",
  },
];

export default function Subscribe(): JSX.Element {
  const [purchasing, setPurchasing] = useState(false);
  const [showSelectNetorkModal, setShowSelectNetworkModal] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<string>();
  const [selectedPackage, setSelectedPackage] = useState<string | number>();

  const toggleShowNetworkModal = () => {
    setShowSelectNetworkModal(!showSelectNetorkModal);
    setPurchasing(!purchasing);
  };

  const proceedWithPurchase = async () => {
    console.log(selectedPackage, selectedNetwork);
    if (!selectedPackage || !selectedNetwork) {
      toast.error("Please select a package and a network");
      return;
    }
    setPurchasing(true);
    toggleShowNetworkModal();
    await purchaseSubscription(selectedPackage, selectedNetwork)
      .then(async (response) => {
        // await createLog({
        //   action: "purchase",
        //   content_uid: String(selectedPackage),
        // });
        toast.success(response);
      })
      .catch((error) => toast.error(error.message));
    setPurchasing(false);
  };

  const onPackageSelected = (packageID: string | number) => {
    setSelectedPackage(packageID);
    toggleShowNetworkModal();
  };

  return (
    <AuthCheckLayout>
      <Meta title="Subscribe to mCini" />
      <div className="dark:bg-[#111418]">
        <Header />
        {showSelectNetorkModal && (
          <ModalLayout>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-5 rounded-md text-black grid gap-10 w-full max-w-[350px]"
            >
              <h3 className="text-xl font-[600] text-center">
                Choose your network
              </h3>
              <ul className="grid gap-10 grid-cols-2">
                {NETWORKS.map((network: Network, index: number) => (
                  <li
                    key={index}
                    className={`shadow flex items-center justify-center p-2 select-none cursor-pointer hover:opacity-50 transition-all rounded-md border-2 ${
                      selectedNetwork === network.uid
                        ? "border border-primary"
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedNetwork(network.uid)}
                  >
                    <Image
                      className="w-[50px]"
                      src={network.image}
                      alt={network.name}
                      width={1000}
                      height={1000}
                    />
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-center gap-5">
                <Button
                  className="rounded-md w-full"
                  variant="ghost"
                  onClick={toggleShowNetworkModal}
                >
                  Cancel
                </Button>
                <Button
                  disabled={!selectedNetwork}
                  className="rounded-md w-full"
                  onClick={proceedWithPurchase}
                >
                  Proceed
                </Button>
              </div>
            </motion.div>
          </ModalLayout>
        )}
        <div className="pt-[150px]">
          <h2 className="text-center font-[500] text-xl md:text-3xl">
            Get an Unlimited Experience of African Entertainment
          </h2>
          <ul className="flex flex-col px-5 lg:flex-row items-center justify-between max-w-[1500px] gap-7 pt-10 m-auto">
            {SUBSCRIPTIONS.map((subscription, index: number) => (
              <SubscriptionCard
                id={subscription.id}
                uid={subscription.uid}
                name={subscription.name}
                price={subscription.price}
                duration={subscription.duration}
                features={subscription.features}
                purchasing={purchasing}
                onPurchasePackage={onPackageSelected}
                key={index}
              />
            ))}
          </ul>
        </div>
        <Footer />
      </div>
    </AuthCheckLayout>
  );
}

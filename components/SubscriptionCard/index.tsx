import { FiCheck } from "react-icons/fi";
import Button from "../Button";
import { ISubscriptionCardProps } from "~/interface";

export default function SubscriptionCard({
  name,
  price,
  id,
  uid,
  duration,
  features,
  onPurchasePackage,
  purchasing,
}: ISubscriptionCardProps): JSX.Element {
  return (
    <li className="dark:bg-[#252A2F] w-full rounded-sm shadow-2xl border-t-2 border-t-white dark:border-t-[#252A2F] hover:border-t-primary">
      <div className="text-center border-b  dark:border-b-gray-500 p-6 grid gap-6 text-gray-700 dark:text-gray-300">
        <h2 className="text-2xl uppercase font-[500]">{name}</h2>
        <h1 className="text-5xl">
          GH₵{price}
          <span className="text-xl">/{duration}</span>
        </h1>
        <Button
          className="bg-black rounded-sm py-5 w-full max-w-[280px] m-auto hover:bg-primary"
          onClick={() => onPurchasePackage(id)}
          loading={purchasing}
        >
          Subscribe Now
        </Button>
      </div>
      <ul className="grid gap-6 p-6">
        {features.map((feature, index: number) => (
          <li className="flex items-center gap-2" key={index}>
            <FiCheck className="text-primary" />
            <p className={`${index === 0 && "text-primary"} text-sm`}>
              {feature}
            </p>
          </li>
        ))}
      </ul>
    </li>
  );
}

import { VariantProps, cva } from "class-variance-authority";
import { ButtonHTMLAttributes, FC } from "react";
import cn from "~/utils/cn.util";
import { BiLoaderAlt } from "react-icons/bi";

const buttonVariants = cva(
  "p-3 px-6 rounded-full transition-all disabled:cursor-not-allowed active:scale-95 active:opacity-60 select-none whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-primary text-white",
        ghost: "bg-gray-100 dark:text-white dark:bg-gray-600",
        text: "bg-transparent active:bg-gray-100",
        outline: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button: FC<ButtonProps> = ({
  children,
  className,
  variant,
  loading,
  ...props
}) => {
  return (
    <button
      className={`${cn(
        buttonVariants({ variant, className })
      )} disabled:opacity-70`}
      {...props}
      disabled={loading || props.disabled}
    >
      <span className="flex items-center gap-2 justify-center">
        {loading ? <BiLoaderAlt className="loader-spin" /> : children}
      </span>
    </button>
  );
};

export default Button;

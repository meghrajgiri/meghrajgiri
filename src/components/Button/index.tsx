import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "lg" | "md" | "sm";
  className?: string;
  text?: string;
  variant?: "primary" | "secondary";
}

const buttonStyles = tv({
  base: "text-text border-stroke hover:shadow-button-shadow rounded-3xl border bg-button transition duration-300 ease-in-out",
  variants: {
    size: {
      lg: "text-md px-12 py-2",
      md: "px-6 py-3 text-sm",
      sm: "px-4 py-1 text-xs",
    },
    variant: {
      primary:
        "border-white-20 bg-button font-semibold text-white-100 hover:border-button-outline hover:bg-button-outline",
      secondary:
        "border-button-secondary bg-button-secondary text-secondary hover:border-white-20 hover:bg-white-20",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const Button = (props: ButtonProps) => {
  const {
    children,
    className,
    size = "md",
    text,
    variant = "primary",
    ...restProps
  } = props;

  const classNames = twMerge(buttonStyles({ size, variant }), className);

  return (
    <button className={twMerge(classNames)} {...restProps}>
      {text || children}
    </button>
  );
};


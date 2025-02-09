import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";
import { FontWeight, Headings } from "./types";

interface HeadingProps
  extends PropsWithChildren,
    React.HTMLAttributes<HTMLElement> {
  as?: Headings;
  weight?: FontWeight;
  text?: string;
}

const headingStyles = tv({
  base: "text-text",
  variants: {
    as: {
      h1: "text-2xl md:text-5xl lg:text-6xl",
      h2: "text-xl sm:text-2xl md:text-3xl lg:text-5xl",
      h3: "text-xl md:text-2xl",
      h4: "text-lg",
      h5: "text-base",
      h6: "text-sm",
    },
    weight: {
      thin: "font-thin",
      extralight: "font-extralight",
      light: "font-light",
      regular: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
      black: "font-black",
    },
  },
  defaultVariants: {
    as: "h2",
    weight: "regular",
  },
});

export const Heading: React.FC<HeadingProps> = ({
  children,
  as = "h2",
  weight = "medium",
  className,
  text,
}) => {
  const Component = as;
  const classNames = twMerge(headingStyles({ as, weight }), className);

  return <Component className={classNames}>{text || children}</Component>;
};

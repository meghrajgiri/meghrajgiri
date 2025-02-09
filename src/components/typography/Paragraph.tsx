import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";
import { FontWeight, ParagraphVariants } from "./types";

interface ParagraphProps
  extends PropsWithChildren,
    React.HTMLAttributes<HTMLElement> {
  variant?: ParagraphVariants;
  weight?: FontWeight;
  text?: string;
}

const paragraphStyles = tv({
  base: "text-white-50",
  variants: {
    variant: {
      "para-18": "text-lg",
      "para-16": "text-base",
      small: "text-sm",
      body: "text-2xl",
      feature: "text-sm",
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
    variant: "para-16",
    weight: "regular",
  },
});

export const Paragraph = (props: ParagraphProps) => {
  const {
    children,
    weight = "regular",
    variant = "para-16",
    className,
    text,
  } = props;

  const classNames = twMerge(paragraphStyles({ variant, weight }), className);

  return <p className={classNames}>{text || children}</p>;
};

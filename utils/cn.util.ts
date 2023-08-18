import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export default function cn(...classValues: ClassValue[]) {
  return twMerge(clsx(classValues));
}

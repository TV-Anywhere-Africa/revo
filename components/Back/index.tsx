import { BiChevronLeft } from "react-icons/bi";
import Button from "../Button";

export default function Back() {
  return (
    <Button
      variant="text"
      className="-ml-8 text-primary w-max"
      onClick={() => window.history.back()}
    >
      <BiChevronLeft size={25} className="-mr-2" />
      Back
    </Button>
  );
}

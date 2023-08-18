import { toast } from "react-hot-toast";

/**
 * Copies text to clipboard
 * @param text - Text to copy
 */
export default function copyToClipboard(text: string): undefined {
  navigator.clipboard
    .writeText(text)
    .then(() => toast.success("Copied to clipboard"))
    .catch((error) => toast.error("Error copying to clipboard"));
}

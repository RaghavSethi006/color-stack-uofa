import { Toaster } from "sonner";
export function BrutToaster() {
  return <Toaster position="bottom-center" toastOptions={{ unstyled: true, classNames: { toast: "brut-toast mono" } }} />;
}

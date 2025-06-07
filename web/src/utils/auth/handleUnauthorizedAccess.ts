import { useRouter } from "next/router";
import { removeTokenFromLs } from "./removeTokenFromLs";
import { removeTokenFromCookies } from "./removeTokenFromCookies";

export const useHandleUnauthorizedAccess = () => {
  const router = useRouter();

  return (message?: string) => {
    if (typeof window !== "undefined") {
      removeTokenFromCookies();
      localStorage.removeItem("session");
      removeTokenFromLs();
    }

    alert(message || "Acesso não autorizado detectado. Encerrando sessão.");

    router.replace("/login");
  };
};

export const handleUnauthorizedAccess = (message?: string) => {
  if (typeof window !== "undefined") {
    removeTokenFromCookies();
    localStorage.removeItem("session");
    removeTokenFromLs();
    console.warn("Unauthorized access:", message);
    alert(message || "Acesso não autorizado detectado. Encerrando sessão.");
    window.location.replace("/login");
  }
};

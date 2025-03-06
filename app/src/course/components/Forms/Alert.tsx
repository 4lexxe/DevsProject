import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useUnsavedChangesWarning = (hasUnsavedChanges: boolean) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = "Tienes cambios sin guardar. ¿Seguro que quieres salir?";
      }
    };

    const handleNavigation = (event: PopStateEvent) => {
      if (hasUnsavedChanges) {
        const confirmLeave = window.confirm("Tienes cambios sin guardar. ¿Seguro que quieres salir?");
        if (!confirmLeave) {
          navigate(1); // Evita que el usuario retroceda si cancela la alerta
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handleNavigation);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handleNavigation);
    };
  }, [hasUnsavedChanges, navigate]);
};

export default useUnsavedChangesWarning;

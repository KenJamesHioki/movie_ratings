import { Bounce, toast } from "react-toastify";

type Props = {
  type: "success" | "info" | "warning" | "error";
  message: string;
  theme: string;
};

export const showAlert = ({type, message, theme}: Props) => {
  toast[type](message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: theme,
    transition: Bounce,
  });
};

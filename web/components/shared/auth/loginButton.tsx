import { useState } from "react";
import ThemedModal from "../themed/themedModal";
import Login from "./login";
import { useTranslation } from "react-i18next";

interface LoginButtonProps {
  onClick?: () => void;
}

const LoginButton = (props: LoginButtonProps) => {
  const { onClick } = props;
  const [openLogin, setOpenLogin] = useState(false);
  const { t } = useTranslation("auth");

  const handleClick = () => {
    setOpenLogin(true);
    onClick && onClick();
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="rounded-xl border border-gray-900 px-4 py-2 font-semibold text-gray-900"
      >
        {t("login.signIn")}
      </button>
      <ThemedModal open={openLogin} setOpen={setOpenLogin}>
        <Login formState="login" />
      </ThemedModal>
    </>
  );
};

export default LoginButton;

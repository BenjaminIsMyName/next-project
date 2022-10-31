import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useContext, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import useFormData from "../../../hooks/useFormData";
import CountdownModal from "../../CountdownModal";
import EditIcon from "../../icons/EditIcon";
import Loading from "../../Loading";
import LoadingModal from "../../LoadingModal";
import Modal from "../../Modal";
import EditProfileModal from "./EditProfileModal";
import ThemesSection from "./ThemesSection";
import axios from "axios";
import ErrorInMenu from "./ErrorInModal";
import { getCookie } from "cookies-next";

export default function UserConnectedModal({ logOut }) {
  const { t } = useTranslation("menu");
  const router = useRouter();
  const { locale } = router;
  const { user, setUser } = useContext(UserContext);

  const StatusEnum = {
    default: "Show the user details with some options",
    edit: "Show modal to edit the user details",
    countdownDelete: "Show modal with countdown to delete account",
    countdownEdit: "Show modal with countdown to edit account",
    loading: "Show Loading modal",
    error: "Show Error modal",
  };

  const [status, setStatus] = useState(StatusEnum.default);

  const inputsDataDefault = {
    email: user.email,
    password: "",
    name: user.name,
  };

  const { inputsData, setInputsData, handleInputChange } =
    useFormData(inputsDataDefault);

  function goBack() {
    setInputsData(inputsDataDefault);
    setStatus(StatusEnum.default);
  }

  // using useCallback to prevent the useEfect from running multiple times
  const handleDelete = useCallback(() => {
    async function theAsyncFunc() {
      if (status === StatusEnum.loading) return; // just in case
      setStatus(StatusEnum.loading);
      try {
        await axios.delete("/api/deleteUser");
        setUser(null);
      } catch (err) {
        setStatus(StatusEnum.error);
      }
    }
    theAsyncFunc();
  }, [StatusEnum.error, StatusEnum.loading, setUser, status]); // idk, eslint says so...

  // without useCallback this time. the IF at the beginning supposed to prevent problems.
  async function handleEdit() {
    if (status === StatusEnum.loading) return;
    setStatus(StatusEnum.loading);
    try {
      await axios.put("/api/editUser", inputsData);
      const userCookie = getCookie("user");
      setUser(JSON.parse(userCookie));
      setStatus(StatusEnum.default);
      setInputsData(prev => ({ ...prev, password: "" })); // don't show the password when going back to edit
    } catch (err) {
      setStatus(StatusEnum.error);
    }
  }

  if (status === StatusEnum.default)
    return (
      <Modal>
        <div>
          <p
            className={`text-2xl text-option-text-color font-another-font-family overflow-hidden text-ellipsis inline`}
          >
            {t("titles.welcome")}, {user.name}
          </p>
          <button
            type="button"
            className={`bg-opacity-0 border-0 p-1 cursor-pointer [&_svg]:w-5 [&_svg]:h-5 [&_svg]:fill-third-color [&_svg]:align-middle [&_svg]:transition-all [&_svg]:duration-300 [&_svg]:ease-linear hover:[&_svg]:rotate-[-60deg]`}
            onClick={() => setStatus(StatusEnum.edit)}
          >
            <EditIcon />
          </button>
        </div>

        <button
          onClick={logOut}
          className={`block cursor-pointer p-1 w-full mx-auto my-2 rounded-tr-3xl rounded-bl-3xl bg-option-text-color bg-opacity-10 text-error-color border-0 transition-all duration-300 ease-linear font-bold
          hover:rounded-none`}
          type="button"
        >
          {t("actions.logout")}
        </button>
        <div
          className={`justify-around flex [&_a]:block [&_a]:no-underline [&_a]:text-option-text-color`}
        >
          <Link href={router.asPath} locale={"he"}>
            <a className={`${locale === "he" ? "!underline" : ""}`}>עברית</a>
          </Link>
          <Link href={router.asPath} locale={"en"}>
            <a className={`${locale === "en" ? "!underline" : ""}`}>English</a>
          </Link>
        </div>

        {user.isAdmin && (
          <Link href={"/admin"}>
            <a
              className={`block no-underline text-option-text-color text-center p-10 bg-third-color bg-opacity-30 mt-4`}
            >
              {t("admin-page")}
            </a>
          </Link>
        )}

        <strong className={`block p-3 text-center text-option-text-color`}>
          {t("titles.themes")}:
        </strong>
        <ThemesSection />
      </Modal>
    );

  if (status === StatusEnum.edit)
    return (
      <EditProfileModal
        goBack={goBack}
        inputsData={inputsData}
        handleInputChange={handleInputChange}
        handleDelete={() => setStatus(StatusEnum.countdownDelete)}
        handleEdit={() => setStatus(StatusEnum.countdownEdit)}
      />
    );

  if (status === StatusEnum.countdownDelete)
    return (
      <CountdownModal
        title={t("countdown-actions.deleting")}
        cancelCallback={goBack}
        nextCallback={handleDelete}
      />
    );

  if (status === StatusEnum.countdownEdit)
    return (
      <CountdownModal
        title={t("countdown-actions.saving")}
        cancelCallback={goBack}
        nextCallback={handleEdit}
      />
    );

  if (status === StatusEnum.loading) return <LoadingModal />;

  if (status === StatusEnum.error)
    return <ErrorInMenu text={t("error-text.general")} goBack={goBack} />;
}

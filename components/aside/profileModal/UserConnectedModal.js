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
import styles from "./UserConnectedModal.module.css";
import axios from "axios";
import ErrorInMenu from "./ErrorInModal";
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

  if (status === StatusEnum.default)
    return (
      <Modal>
        <div>
          <p className={styles.welcome}>
            {t("titles.welcome")}, {user.name}
          </p>
          <button
            type='button'
            className={styles.editBtn}
            onClick={() => setStatus(StatusEnum.edit)}
          >
            <EditIcon />
          </button>
        </div>
        <button onClick={logOut} className={styles.logoutButton} type='button'>
          {t("actions.logout")}
        </button>
        <div className={styles.langContainer}>
          <Link href={router.asPath} locale={"he"}>
            <a className={`${locale === "he" ? styles.selected : ""}`}>עברית</a>
          </Link>
          <Link href={router.asPath} locale={"en"}>
            <a className={`${locale === "en" ? styles.selected : ""}`}>
              English
            </a>
          </Link>
        </div>

        {user.isAdmin && (
          <Link href={"/admin"}>
            <a className={styles.adminPage}>{t("admin-page")}</a>
          </Link>
        )}

        <strong className={styles.themesTitle}>{t("titles.themes")}:</strong>
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
      />
    );

  if (status === StatusEnum.countdownDelete)
    return (
      <CountdownModal
        title={"Deleting in..."}
        cancelCallback={goBack}
        nextCallback={handleDelete}
      />
    );

  if (status === StatusEnum.loading) return <LoadingModal />;

  if (status === StatusEnum.error)
    return (
      <Modal>
        <ErrorInMenu text='Couldnt delete the user right now' goBack={goBack} />
      </Modal>
    );
}

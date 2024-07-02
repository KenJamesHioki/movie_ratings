import React, { memo, useEffect, useState } from "react";
import "../../styles/pages/login.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, db, provider, storage } from "../../lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Input } from "../atoms/input/Input";
import { Close } from "@mui/icons-material";
import { PrimaryButton } from "../atoms/button/PrimaryButton";
import { showAlert } from "../../lib/showAlert";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../lib/UserProvider";
import { Loader } from "../atoms/Loader";
import { SecondaryButton } from "../atoms/button/SecondaryButton";
import { UserIcon } from "../atoms/UserIcon";

export const Login: React.FC = memo(() => {
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [icon, setIcon] = useState<File | null>(null);
  const [iconUrl, setIconUrl] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [passwordResetEmail, setPasswordResetEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordResetMode, setIsPasswordResetMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser.userId]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setIcon(e.target.files![0]);
      setIconUrl(URL.createObjectURL(e.target.files![0]));
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoginMode) {
      await loginWithEmail();
    } else {
      await signupWithEmail();
    }
  };

  const loginWithEmail = async () => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error(error.message);
      if (error.code === "auth/invalid-credential" || "auth/invalid-email") {
        showAlert({
          type: "error",
          message: "メールアドレス／パスワードが間違っています",
          theme: "dark",
        });
      } else {
        showAlert({
          type: "error",
          message: "ログインに失敗しました",
          theme: "dark",
        });
      }
      setIsLoading(false);
    }
  };

  const signupWithEmail = async () => {
    setIsLoading(true);
    try {
      let iconUrl = "";
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;

      if (icon) {
        const iconFileName = `${Date.now()}_${icon.name}`;
        const storageRef = ref(storage, `icons/${iconFileName}`);
        await uploadBytes(storageRef, icon);
        iconUrl = await getDownloadURL(storageRef);
      }

      await setDoc(doc(db, "users", userId), {
        displayName,
        introduction: "",
        iconUrl,
      });

      setDisplayName("");
      setIcon(null);
      setEmail("");
      setPassword("");
      setIsLoginMode(true);
      showAlert({
        type: "success",
        message: "新規登録が完了しました",
        theme: "dark",
      });
      logout();
    } catch (error: any) {
      console.error(error.message);
      if (error.code === "auth/email-already-in-use") {
        showAlert({
          type: "error",
          message: "メールアドレスは既に使われています",
          theme: "dark",
        });
      } else {
        showAlert({
          type: "error",
          message: "新規登録に失敗しました",
          theme: "dark",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const docSnap = await getDoc(doc(db, "users", result.user.uid));
      if (!docSnap.exists()) {
        try {
          await setDoc(doc(db, "users", result.user.uid), {
            displayName: result.user.displayName,
            introduction: "",
            iconUrl: result.user.photoURL,
          });
          showAlert({
            type: "success",
            message: "新規登録が完了しました。",
            theme: "dark",
          });
          logout();
          setIsLoginMode(true);
        } catch (error: any) {
          console.error(error.message);
          showAlert({
            type: "error",
            message: "新規登録に失敗しました",
            theme: "dark",
          });
        }
      }
    } catch (error: any) {
      console.error(error.message);
      showAlert({
        type: "error",
        message: "サインインに失敗しました",
        theme: "dark",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setIsPasswordResetMode(false);
    auth.languageCode = "ja";
    try {
      await sendPasswordResetEmail(auth, passwordResetEmail);
      setIsPasswordResetMode(false);
      setPasswordResetEmail("");
      showAlert({
        type: "success",
        message: "リセットメールが送信されました",
        theme: "dark",
      });
    } catch (error: any) {
      console.error(error.message);
      showAlert({
        type: "error",
        message: "リセットメール送信に失敗しました",
        theme: "dark",
      });
    }
  };

  return (
    <div
      className="login__wrapper"
      onClick={() => setIsPasswordResetMode(false)}
    >
      <div className="login__container">
        {isLoading ? (
          <Loader size={60} />
        ) : (
          <>
            <img className="login__logo" src="/images/logo.png" />
            <form className="login__form" onSubmit={handleSubmit}>
              {!isLoginMode && (
                <>
                  <Input
                    type="text"
                    value={displayName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setDisplayName(e.target.value);
                    }}
                    placeholder="ニックネーム *"
                    style={{color:"white"}}
                  />
                  <label className="login__user-icon-label" htmlFor="file">
                    <input
                      id="file"
                      type="file"
                      className="login__user-icon-upload"
                      onChange={handleImageSelect}
                    />
                    {icon ? (
                      <UserIcon size="sm" src={iconUrl} navigateTo="" isPointer={true} />
                    ) : (
                      <>
                        <AccountCircleIcon
                          sx={{
                            fontSize: 48,
                            color: "white",
                            cursor: "pointer",
                            opacity: 0.7,
                            "&:hover": {
                              opacity: 0.5,
                            },
                          }}
                        />
                        <p className="login__user-icon-placeholder">
                          アイコンをアップロード *
                        </p>
                      </>
                    )}
                  </label>
                </>
              )}
              <Input
                type="text"
                placeholder={
                  isLoginMode ? "メールアドレス" : "メールアドレス *"
                }
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                }}
                style={{color:"white"}}
              />
              <Input
                type="password"
                placeholder={
                  isLoginMode ? "パスワード" : "パスワード (6文字以上) *"
                }
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                }}
                style={{color:"white"}}
              />
              <PrimaryButton
                className="login__button-submit"
                type="submit"
                disabled={
                  isLoginMode
                    ? !email || password.length < 6
                    : !email || password.length < 6 || !icon || !displayName
                }
              >
                {isLoginMode ? "サインイン" : "新規登録"}
              </PrimaryButton>
              {!isLoginMode &&
                (!email || password.length < 6 || !icon || !displayName) && (
                  <div className="login__validation">
                    <ul>
                      {!displayName && (
                        <li>・ニックネームを入力してください。</li>
                      )}
                      {!icon && <li>・アイコンを設定してください。</li>}
                      {!email && <li>・メールアドレスを入力してください。</li>}
                      {password.length < 6 && (
                        <li>・パスワードを6文字以上で入力してください。</li>
                      )}
                    </ul>
                  </div>
                )}
            </form>
            <div
              className="login__action-container"
              style={!isLoginMode ? { justifyContent: "flex-end" } : {}}
            >
              {isLoginMode && (
                <p
                  className="login__action-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPasswordResetMode(true);
                  }}
                >
                  パスワードをリセット
                </p>
              )}
              <p
                className="login__action-button"
                onClick={() => setIsLoginMode(!isLoginMode)}
              >
                {isLoginMode ? "アカウントの新規登録" : "ログイン画面に戻る"}
              </p>
            </div>
            <div className="login__separator"></div>
            <SecondaryButton
              type="button"
              onClick={handleGoogleAuth}
              style={{ width: "100%" }}
            >
              {isLoginMode ? "Googleでサインイン" : "Googleで登録"}
            </SecondaryButton>
          </>
        )}
      </div>
      {isPasswordResetMode && (
        <div
          className="login__password-reset-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <Close
            className="login__modal-close-button"
            onClick={() => setIsPasswordResetMode(false)}
          />
          <Input
            type="text"
            value={passwordResetEmail}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPasswordResetEmail(e.target.value)
            }
            placeholder="メールアドレス"
            style={{color:"white"}}
          />
          <PrimaryButton
            type="button"
            onClick={handlePasswordReset}
            disabled={!passwordResetEmail}
          >
            送信
          </PrimaryButton>
        </div>
      )}
      <ToastContainer />
    </div>
  );
});

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
import { doc, setDoc } from "firebase/firestore";
import { Input } from "../atoms/input/Input";
import { Close } from "@mui/icons-material";
import { PrimaryButton } from "../atoms/button/PrimaryButton";
import { showAlert } from "../../lib/showAlert";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../lib/UserProvider";

export const Login: React.FC = memo(() => {
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [icon, setIcon] = useState<File | null>(null);
  const [iconUrl, setIconUrl] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [passwordResetEmail, setPasswordResetEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordResetMode, setIsPasswordResetMode] = useState(false);
  const { currentUser } = useUser();

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser]);

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
    }
  };

  const signupWithEmail = async () => {
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
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      if (!isLoginMode) {
        await setDoc(doc(db, "users", result.user.uid), {
          displayName: result.user.displayName,
          introduction: "",
          iconUrl: result.user.photoURL,
        });
        showAlert({
          type: "success",
          message: "新規登録が完了しました",
          theme: "dark",
        });
      }
      navigate("/");
    } catch (error: any) {
      console.error(error.message);
      showAlert({
        type: "error",
        message: "新規登録に失敗しました",
        theme: "dark",
      });
    }
  };

  const handlePasswordReset = async () => {
    setIsLoginMode(true);
    auth.languageCode = "ja";
    try {
      await sendPasswordResetEmail(auth, passwordResetEmail);
      setIsPasswordResetMode(false);
      setPasswordResetEmail("");
      showAlert({
        type: "success",
        message: "パスワードリセットメールが送信されました",
        theme: "dark",
      });
    } catch (error: any) {
      console.error(error.message);
      showAlert({
        type: "error",
        message: "リセットメール送信に失敗しました",
        theme: "dark",
      });
    } finally {
      setIsLoginMode(true);
    }
  };

  return (
    <div className="login_wrapper">
      <div className="login_container">
        <img className="login_logo" src="/images/logo.png" />
        <form className="login_form" onSubmit={handleSubmit}>
          {!isLoginMode && (
            <>
              <label className="login_user-icon-label" htmlFor="file">
                <input
                  id="file"
                  type="file"
                  className="login_upload-icon"
                  onChange={handleImageSelect}
                />
                {icon ? (
                  <img src={iconUrl} alt="" />
                ) : (
                  <AccountCircleIcon
                    sx={{
                      fontSize: 48,
                      color: "white",
                      cursor: "pointer",
                      "&:hover": {
                        opacity: 0.8,
                      },
                    }}
                  />
                )}
                <p>アイコンをアップロード</p>
              </label>
              <Input
                type="text"
                value={displayName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setDisplayName(e.target.value);
                }}
                placeholder="ユーザー名"
              />
            </>
          )}
          <Input
            type="text"
            placeholder="メールアドレス"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
            }}
          />
          <Input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
            }}
          />
          <button
            className="login_signin"
            disabled={
              isLoginMode
                ? !email || password.length < 6
                : !email || password.length < 6 || !icon || !displayName
            }
          >
            {isLoginMode ? "サインイン" : "新規登録"}
          </button>
        </form>
        <div
          className="login_password-and-account"
          style={!isLoginMode ? { justifyContent: "flex-end" } : {}}
        >
          {isLoginMode && (
            <p
              className="login_password-reset"
              onClick={() => setIsPasswordResetMode(true)}
            >
              パスワードをリセット
            </p>
          )}
          <p
            className="login_new-account"
            onClick={() => setIsLoginMode(!isLoginMode)}
          >
            {isLoginMode ? "アカウントの新規登録" : "ログイン画面に戻る"}
          </p>
        </div>
        <div className="login_separator"></div>
        <button className="login_google-signin" onClick={handleGoogleAuth}>
          {isLoginMode ? "Googleでサインイン" : "Googleで登録"}
        </button>
      </div>
      {isPasswordResetMode && (
        <div className="login_password-reset-modal">
          <Close
            className="login_modal-close"
            onClick={() => setIsPasswordResetMode(false)}
          />
          <Input
            type="text"
            value={passwordResetEmail}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPasswordResetEmail(e.target.value)
            }
            placeholder="メールアドレス"
          />
          <PrimaryButton type="button" onClick={handlePasswordReset}>
            送信
          </PrimaryButton>
        </div>
      )}
      <ToastContainer />
    </div>
  );
});

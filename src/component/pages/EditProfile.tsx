import React, { ChangeEvent, memo, useEffect, useState } from "react";
import { PageWithHeader } from "../templates/PageWithHeader";
import { PrimaryButton } from "../atoms/button/PrimaryButton";
import { InvertedButton } from "../atoms/button/InvertedButton";
import { useUser } from "../../lib/UserProvider";
import { Input } from "../atoms/input/Input";
import { Textarea } from "../atoms/input/Textarea";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../lib/firebase";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Loader } from "../atoms/Loader";
import { showAlert } from "../../lib/showAlert";
import { useTheme } from "../../lib/ThemeProvider";
import "../../styles/pages/editProfile.css";

export const EditProfile: React.FC = memo(() => {
  const { currentUser, updateProfile } = useUser();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [newIcon, setNewIcon] = useState<File | null>(null);
  const [iconUrl, setIconUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setNewIcon(e.target.files![0]);
      setIconUrl(URL.createObjectURL(e.target.files![0]));
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      let newIconUrl = "";
      if (newIcon) {
        const iconFileName = `${Date.now()}_${newIcon.name}`;
        const storageRef = ref(storage, `icons/${iconFileName}`);
        await uploadBytes(storageRef, newIcon);
        newIconUrl = await getDownloadURL(storageRef);
      } else {
        newIconUrl = iconUrl;
      }
      await updateDoc(doc(db, "users", currentUser.userId), {
        iconUrl: newIconUrl,
        displayName,
        introduction,
      });
      updateProfile(iconUrl, displayName, introduction);
      navigate("/mypage", {
        state: {
          type: "success",
          message: "プロフィールが更新されました",
          theme,
        },
      });
    } catch (error: any) {
      console.error(error.message);
      showAlert({ type: "error", message: "保存に失敗しました", theme });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const docSnap = await getDoc(doc(db, "users", currentUser.userId));
        if (docSnap.exists()) {
          return {
            displayName: docSnap.data().displayName,
            introduction: docSnap.data().introduction,
            iconUrl: docSnap.data().iconUrl,
          };
        } else {
          console.error("指定のドキュメントが見つかりませんでした");
          showAlert({
            type: "error",
            message: "予期せぬエラーが発生しました",
            theme,
          });
          return {
            displayName: "",
            introduction: "",
            iconUrl: "",
          };
        }
      } catch (error: any) {
        console.error(error.message);
        showAlert({
          type: "error",
          message: "データの読み込みに失敗しました",
          theme,
        });
        return {
          displayName: "",
          introduction: "",
          iconUrl: "",
        };
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile().then((response) => {
      setDisplayName(response.displayName);
      setIntroduction(response.introduction);
      setIconUrl(response.iconUrl);
    });
  }, [currentUser]);

  return (
    <>
      <PageWithHeader>
        <div className="editProfile__wrapper">
          <label className="editProfile__icon-container" htmlFor="file">
            <input
              id="file"
              type="file"
              className="editProfile__icon-input"
              onChange={handleImageSelect}
            />
            <img className="editProfile__icon-image" src={iconUrl} alt="" />
            <p className="editProfile__icon-change">変更</p>
          </label>
          <div className="editProfile__display-name-container">
            <p className="editProfile__label">ニックネーム（30文字まで）</p>
            <Input
              type="text"
              value={displayName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value;
                if (value.length <= 30) {
                  setDisplayName(value);
                }
              }}
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>
          <div className="editProfile__introduction-container">
            <p className="editProfile__label">紹介文（200文字まで）</p>
            <Textarea
              value={introduction}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                const value = e.target.value;
                if (value.length <= 200) {
                  setIntroduction(value);
                }
              }}
              style={{
                width: "100%",
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />
          </div>
          <PrimaryButton
            type="button"
            onClick={handleSave}
            style={{ width: "100%" }}
          >
            保存
          </PrimaryButton>
          <InvertedButton
            type="button"
            onClick={() => navigate("/mypage")}
            style={{ width: "100%" }}
          >
            キャンセル
          </InvertedButton>
        </div>
      </PageWithHeader>
      {isLoading && <Loader size={60} />}
    </>
  );
});

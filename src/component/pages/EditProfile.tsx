import React, { ChangeEvent, useEffect, useState } from "react";
import { PageWithHeader } from "../layout/PageWithHeader";
import { PrimaryButton } from "../atoms/PrimaryButton";
import { InvertedButton } from "../atoms/InvertedButton";
import { useUser } from "../../lib/UserProvider";
import { Input } from "../atoms/Input";
import { Textarea } from "../atoms/Textarea";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../lib/firebase";
import { useNavigate } from "react-router-dom";
import "../../styles/pages/editProfile.css";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Loader } from "../atoms/Loader";
import { showAlert } from "../../lib/showAlert";
import { useTheme } from "../../lib/ThemeProvider";

export const EditProfile: React.FC = () => {
  const { currentUser, update } = useUser();
  const [displayName, setDisplayName] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [newIcon, setNewIcon] = useState<File | null>(null);
  const [iconUrl, setIconUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

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
      update(iconUrl, displayName, introduction);
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
          setDisplayName(docSnap.data().displayName);
          setIntroduction(docSnap.data().introduction);
          setIconUrl(docSnap.data().iconUrl);
        } else {
          console.error("指定のドキュメントが見つかりませんでした");
          showAlert({
            type: "error",
            message: "データの読み込みに失敗しました",
            theme,
          });
        }
      } catch (error: any) {
        console.error(error.message);
        showAlert({
          type: "error",
          message: "データの読み込みに失敗しました",
          theme,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  return (
    <>
      <PageWithHeader>
        <div className="editProfile_wrapper">
          <label className="editProfile_icon" htmlFor="file">
            <input
              id="file"
              type="file"
              className="editProfile_upload-icon"
              onChange={handleImageSelect}
            />
            <img src={iconUrl} alt="" />
            <p className="editProfile_change-icon">変更</p>
          </label>
          <div className="editProfile_display-name">
            <p className="editProfile_label">ニックネーム（30文字まで）</p>
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
          <div className="editProfile_introduction">
            <p className="editProfile_label">紹介文（200文字まで）</p>
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
      {isLoading && <Loader />}
    </>
  );
};

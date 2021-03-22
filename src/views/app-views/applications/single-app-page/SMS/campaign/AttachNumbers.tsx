import React, { SetStateAction, Dispatch, useEffect } from "react";
import Upload, { UploadChangeParam } from "antd/lib/upload";
import { IPhoneNumbers } from "./NewCampaign";
import Utils from "../../../../../../utils";
import TranslateText from "../../../../../../utils/translate";
import { Alert, Button, Tooltip } from "antd";
import Flex from "../../../../../../components/shared-components/Flex";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { IState } from "../../../../../../redux/reducers";
import { hideAuthMessage } from "../../../../../../redux/actions/Auth";

interface IAttachNumbers {
  setPhoneNumbers: Dispatch<SetStateAction<IPhoneNumbers[]>>;
  isCsvOrTxt: boolean;
  setIsCsvOrTxt: Dispatch<SetStateAction<boolean>>;
  phoneNumbers: IPhoneNumbers[];
}
const AttachNumbers = ({
  setPhoneNumbers,
  isCsvOrTxt,
  setIsCsvOrTxt,
  phoneNumbers,
}: IAttachNumbers) => {
  const showMessage = useSelector((state: IState) => state.auth?.showMessage);
  const storeMsg = useSelector((state: IState) => state.auth?.message);
  const dispatch = useDispatch();
  const onChange = (info: UploadChangeParam<any>) => {
    if (info.file.status === "done") {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        let numArr: string = e.target.result
          .split(/[\s\n\r;*\/]+/)
          .filter((el: string) => el !== "")
          .join(",");
        setPhoneNumbers((prev) => [
          ...prev,
          { name: info.file.originFileObj.name, value: numArr },
        ]);
      };
      reader.readAsText(info.file.originFileObj);
    }
  };
  useEffect(() => {
    if (showMessage) {
      setTimeout(() => {
        dispatch(hideAuthMessage());
      }, 3000);
    }
  }, [showMessage]);
  return (
    <div className="mb-3">
      <Flex className="w-100" justifyContent="between" alignItems="center">
        <div style={{ fontWeight: 500, color: "#455560" }}>
          {TranslateText("SMS.Receivers")}
        </div>
        <Button type="ghost">View</Button>
      </Flex>
      <motion.div
        initial={{ opacity: 0, marginBottom: 0, display: "none" }}
        animate={{
          display: showMessage ? "block" : "none",
          opacity: showMessage ? 1 : 0,
          marginBottom: showMessage ? 20 : 0,
        }}
      >
        <Alert type="error" showIcon message={storeMsg} />
      </motion.div>
      <small>
        {/* {TranslateText("SMS.NoContacts")}.{" "} */}
        <Upload
          // @ts-ignore
          beforeUpload={async (file: RcFile) => {
            return await Utils.beforeUploadNumbers(file).then((canUpload) => {
              if (canUpload) setIsCsvOrTxt(true);

              return canUpload;
            });
          }}
          onChange={onChange}
          multiple={true}
          customRequest={Utils.dummyRequest}
          showUploadList={{
            showRemoveIcon: false,
            showPreviewIcon: isCsvOrTxt,
          }}
        >
          <Tooltip title="Only .csv or .txt format accepted">
            <small>
              <a>{TranslateText("SMS.AttachFile")}</a>
            </small>
          </Tooltip>
        </Upload>
      </small>
    </div>
  );
};
export default AttachNumbers;

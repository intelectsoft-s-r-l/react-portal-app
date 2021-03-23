import { Empty, Form, message, Spin } from "antd";
import { UploadChangeParam } from "antd/es/upload/interface";
import React, { useEffect, useRef, useState } from "react";
import { EnErrorCode } from "../../../../api";
import { AppService } from "../../../../api/app";
import { ICompanyData } from "../../../../api/app/types";
import Loading from "../../../../components/shared-components/Loading";
import { DONE, UPDATING, UPLOADING } from "../../../../constants/Messages";
import Utils from "../../../../utils";
import TranslateText from "../../../../utils/translate";
import CompanyForm from "./CompanyForm";

const Company = () => {
  const instance = new AppService();
  const [textMask, setTextMask] = useState<any>();
  const onChangeMask = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextMask({ [e.target.name]: e.target.value });
  };
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [Company, setCompany] = useState<ICompanyData | undefined>(undefined);

  const getCompanyInfo = async () => {
    return instance.GetCompanyInfo().then((data) => {
      setLoading(false);
      setFormLoading(false);
      if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
        setCompany(data.Company);
        form.setFieldsValue(data.Company);
      }
    });
  };

  const updateCompany = async (values: ICompanyData) => {
    const updatedInfo = { Company: { ...Company, ...values } };
    return instance.UpdateCompany(updatedInfo).then(async (data) => {
      if (data && data.ErrorCode === 0) {
        await getCompanyInfo();
        message.success({
          content: TranslateText(DONE),
          key: "updatable",
        });
      }
    });
  };
  const onUploadAvatar = (info: UploadChangeParam) => {
    setFormLoading(true);
    if (info.file.status === "done") {
      Utils.getBase64(info.file.originFileObj, async (imageUrl: string) => {
        const newImage = { Logo: imageUrl };
        updateCompany(newImage);
      });
    }
  };
  const onRemoveAvatar = async () => {
    updateCompany({ ...Company, Logo: "" }).then(() =>
      setCompany((prev) => ({ ...prev, Logo: "" }))
    );
  };
  const onFinish = async (values: ICompanyData) => {
    setFormLoading(true);
    updateCompany(values);
  };

  useEffect(() => {
    getCompanyInfo();
    return () => instance._source.cancel();
  }, []);
  if (loading) {
    return <Loading cover="content" />;
  }
  if (!Company) {
    return <Empty />;
  }
  return (
    <Spin spinning={formLoading}>
      <CompanyForm
        Company={Company}
        onChangeMask={onChangeMask}
        onFinish={onFinish}
        updateCompany={updateCompany}
        onRemoveAvatar={onRemoveAvatar}
        onUploadAvatar={onUploadAvatar}
      />
    </Spin>
  );
};

export default Company;

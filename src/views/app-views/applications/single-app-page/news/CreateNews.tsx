import React, { useEffect, useState } from "react";
import { Form, message, Upload, Row, Col } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import Modal from "antd/lib/modal/Modal";
import Flex from "../../../../../components/shared-components/Flex";
import { DONE, UPLOADING } from "../../../../../constants/Messages";
import { ROW_GUTTER } from "../../../../../constants/ThemeConstant";
import Utils from "../../../../../utils";
import TextEditor from "../TextEditor";
import { AppService } from "../../../../../api/app";
import { useSelector } from "react-redux";
import { IState } from "../../../../../redux/reducers";
import TranslateText from "../../../../../utils/translate";

const CreateNews = ({ getNews, AppType, visible, close }: any) => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (!visible) return;
    setPhoto("");
    setHeader("");
    setContent("");
  }, [visible, form]);
  const [photo, setPhoto] = useState<string>("");
  const [header, setHeader] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const CompanyID = useSelector((state: IState) => state["account"]!.CompanyID);
  const onUploadAvatar = (info: any) => {
    if (info.file.status === "uploading") {
      message.loading({ content: UPLOADING, key: "updatable" });
    }
    if (info.file.status === "done") {
      message.success({
        content: TranslateText(DONE),
        key: "updatable",
        duration: 1,
      });
      Utils.getBase64(info.file.originFileObj, (imageUrl: string) => {
        setPhoto(imageUrl);
      });
    }
  };
  const onFinish = () => {
    setLoading(true);
    setTimeout(() => {
      return new AppService()
        .UpdateNews({
          CompanyID,
          AppType,
          ID: 0,
          Photo: photo,
          Content: content,
          Header: header,
        })
        .then(async (data) => {
          setLoading(false);
          close();
          if (data.ErrorCode === 0) await getNews(AppType);
        });
    }, 1000);
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  );
  return (
    <Modal
      visible={visible}
      onCancel={close}
      destroyOnClose
      confirmLoading={loading}
      onOk={() => {
        form.validateFields().then(() => {
          onFinish();
        });
      }}
    >
      <Flex
        alignItems="center"
        mobileFlex={false}
        className="text-center text-md-left mb-3"
      >
        <h5>Photo</h5>
        <div className="ml-md-3 mt-md-0 mt-3">
          <Upload
            onChange={onUploadAvatar}
            showUploadList={false}
            name="avatar"
            className="avatar-uploader"
            listType="picture-card"
            customRequest={Utils.dummyRequest}
            beforeUpload={Utils.beforeUploadArticle}
          >
            {photo ? (
              <img
                src={photo}
                alt="News article"
                style={{ maxWidth: "100%" }}
              />
            ) : (
              uploadButton
            )}
          </Upload>
        </div>
      </Flex>
      <Form form={form} name="createNews" layout="vertical">
        <Row gutter={ROW_GUTTER}>
          <Col xs={24} sm={24} md={24}>
            <Form.Item label={"Header"}>
              <TextEditor
                apps={header}
                handleEditorChange={(field: any) => setHeader(field)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24}>
            <Form.Item label={"Content"}>
              <TextEditor
                apps={content}
                handleEditorChange={(field: any) => setContent(field)}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
export default CreateNews;

import React, { useEffect, useMemo, useReducer, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Col, Input, message, Modal, Row } from "antd";
import { AppService } from "../../../api/app";
import Loading from "../../../components/shared-components/Loading";
import useFetch from "../../../utils/hooks/useFetch";
import { WizardContext } from "./market/wizard/WizardContext";
import InstallWizard from "./market/wizard";
import wizardReducer, { wizardState } from "./market/wizard/wizardReducer";
import TranslateText from "../../../utils/translate";
import Utils from "../../../utils";
import AppCard from "./AppCard";
import { DONE } from "../../../constants/Messages";
import Flex from "../../../components/shared-components/Flex";
import Empty from "antd/es/empty";

const Applications = ({
  loading,
  getMarketApps,
  data,
  setData,
  dataToSearch,
}: any) => {
  const [state, dispatch] = useReducer(wizardReducer, wizardState);
  useEffect(() => {
    // Cleanup installation state after closing the installation modal
    if (!state.visibleModal) {
      setTimeout(() => {
        dispatch("");
      }, 250);
    }
  }, [state.visibleModal]);
  const deactivateApp = (AppID: number, AppName: string) => {
    Modal.confirm({
      title: `${TranslateText("app.uninstall.title")} ${AppName}?`,
      onOk: async () => {
        return await new AppService()
          .DeactivateApp(AppID)
          .then(async (data: any) => {
            if (data && data.ErrorCode === 0) {
              await getMarketApps();
              message.success({ content: TranslateText(DONE), duration: 1 });
            }
          });
      },
      onCancel: () => {},
    });
  };
  if (loading) return <Loading />;
  return (
    <WizardContext.Provider value={{ state, dispatch, getMarketApps }}>
      <InstallWizard />
      {loading ? (
        <Loading />
      ) : (
        <div
          className={`my-4 
                    container-fluid`}
        >
          <Col lg={4} md={8} className="mb-4">
            <Input
              type="search"
              prefix={<SearchOutlined />}
              placeholder={TranslateText("app.Search")}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.currentTarget!.value!;
                const searchArray = value ? data : dataToSearch;
                const apps = Utils.wildCardSearch(searchArray, value);
                setData(apps);
              }}
            />
          </Col>
          <Row gutter={16}>
            {data && data.length > 0 && !loading ? (
              data.map((elm: any) => (
                <Col
                  xs={24}
                  sm={24}
                  lg={12}
                  xl={6}
                  xxl={6}
                  key={elm["AppType"]}
                >
                  <AppCard data={elm} deactivateApp={deactivateApp} />
                </Col>
              ))
            ) : (
              <Flex justifyContent="center" className="w-100">
                <Empty />
              </Flex>
            )}
          </Row>
        </div>
      )}
    </WizardContext.Provider>
  );
};

export default Applications;

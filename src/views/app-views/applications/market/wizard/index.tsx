import { Button, Checkbox, Modal, Steps } from "antd";
import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { APP_PREFIX_PATH } from "../../../../../configs/AppConfig";
import { IState } from "../../../../../redux/reducers";
import { IMarketAppList } from "../../AppInterface";
import { MarketContext } from "../MarketContext";
import LoadingWizard from "./LoadingWizard";
import TermsModal from "./TermsWizard";
const steps = [
    {
        title: "Terms",
        content: <TermsModal />,
    },
    {
        title: "Loading",
        content: <LoadingWizard />,
    },
];
const InstallWizard = ({ apps }: any) => {
    const loading = useSelector((state: IState) => state["auth"]!.loading);
    const locale = useSelector((state: IState) => state["theme"]!.locale);
    const {
        current,
        visibleModal,
        handleCancel,
        setCurrent,
        isAccepted,
        setIsAccepted,
        termsAccepted,
        setTermsAccepted,
        appInstalled,
        setAppInstalled,
        selectedApp,
        getMarketApps,
    } = useContext(MarketContext);
    return (
        <Modal
            title={"Installation wizard"}
            visible={visibleModal}
            onOk={() => setCurrent(current + 1)}
            destroyOnClose
            footer={[
                <Button
                    key="cancel"
                    onClick={async () => {
                        handleCancel();
                        termsAccepted && (await getMarketApps());
                    }}
                    disabled={loading}
                >
                    {termsAccepted ? "OK" : "Cancel"}
                </Button>,
                <Button
                    key="next"
                    type="primary"
                    onClick={async () => {
                        setCurrent(current + 1);
                        !termsAccepted && setTermsAccepted(true);
                    }}
                    disabled={!isAccepted || loading}
                >
                    {termsAccepted ? (
                        <Link
                            to={`${APP_PREFIX_PATH}/applications/${selectedApp.AppType}`}
                        >
                            Go to app
                        </Link>
                    ) : (
                        "Next"
                    )}
                </Button>,
            ]}
        >
            <div>{steps[current]["content"]}</div>
        </Modal>
    );
};

export default InstallWizard;

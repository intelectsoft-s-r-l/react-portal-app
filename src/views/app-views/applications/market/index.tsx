import React, { useEffect, useState } from "react";
import { Button, Row, Col, Tag, Avatar, Card, Modal, Empty } from "antd";
import {
    VerticalAlignBottomOutlined,
    ExperimentOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";
import Flex from "../../../../components/shared-components/Flex";
import { Link } from "react-router-dom";
import { APP_PREFIX_PATH } from "../../../../configs/AppConfig";
import { useSelector } from "react-redux";
import Loading from "../../../../components/shared-components/Loading";
import { ClientApi } from "../../../../api";
import InstallWizard from "./wizard";
import { MarketContext } from "./MarketContext";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import { IApplications, IMarketAppList, ITextEditor } from "../AppInterface";
import Utils from "../../../../utils";
import WithStringTranslate from "../../../../utils/translate";
interface IGridItem {
    deactivateApp: (AppID: number, AppName: string) => void;
    setVisibleModal: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedApp: (data: IMarketAppList) => void;
    data: IMarketAppList;
}
const GridItem = ({
    deactivateApp,
    setVisibleModal,
    setSelectedApp,
    data,
}: IGridItem) => {
    const [shortDesc, setShortDesc] = useState<ITextEditor>();
    const locale = useSelector((state: any) => state["theme"].locale);
    useEffect(() => {
        if (data.ShortDescription) {
            try {
                setShortDesc(JSON.parse(window.atob(data.ShortDescription)));
            } catch {
                setShortDesc({ en: "", ru: "", ro: "" });
            }
        }
    }, []);
    return (
        <Card>
            <Flex className="mb-3 " justifyContent="between">
                <Link to={`${APP_PREFIX_PATH}/applications/${data.AppType}`}>
                    <div className="cursor-pointer">
                        <Avatar
                            src={data.Photo}
                            icon={<ExperimentOutlined />}
                            shape="square"
                            size={60}
                        />
                    </div>
                </Link>
                {data.Status === 0 ? (
                    <Tag
                        className="text-capitalize cursor-pointer"
                        color="default"
                        onClick={() => {
                            setVisibleModal(true);
                            setSelectedApp(data);
                        }}
                    >
                        <VerticalAlignBottomOutlined />
                        <span className="ml-2 font-weight-semibold">
                            <IntlMessage id={"app.status.NotInstalled"} />
                        </span>
                    </Tag>
                ) : (
                    <Tag className="text-capitalize" color="cyan">
                        <CheckCircleOutlined />
                        <span className="ml-2 font-weight-semibold">
                            <IntlMessage id={"app.status.Installed"} />
                        </span>
                    </Tag>
                )}
            </Flex>
            <div>
                <Link to={`${APP_PREFIX_PATH}/applications/${data.AppType}`}>
                    <h3 className="mb-0 cursor-pointer ">{data.Name}</h3>
                </Link>
                <p className="text-muted">By IntelectSoft</p>
                <div style={{ minHeight: "70px" }}>
                    {shortDesc ? shortDesc[locale] : null}
                </div>
            </div>
            <Flex justifyContent="between" alignItems="center">
                <div className="text-muted">Free</div>
                <Button
                    onClick={() => deactivateApp(data.ID, data.Name)}
                    danger
                    type={"link"}
                    style={{
                        visibility: data.Status === 1 ? "visible" : "hidden",
                    }}
                >
                    <IntlMessage id={"app.Delete"} />
                </Button>
            </Flex>
        </Card>
    );
};

const Market = () => {
    const [apps, setApps] = useState<IMarketAppList[]>([]);
    const [loading, setLoading] = useState(false);
    const [terms, setTerms] = useState<any>();
    const [visibleModal, setVisibleModal] = useState<boolean>(false);
    const { confirm } = Modal;
    const [current, setCurrent] = useState<any>(0);
    const [isAccepted, setIsAccepted] = useState<boolean>(false);
    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
    const [selectedApp, setSelectedApp] = useState<IMarketAppList>();
    const [appInstalled, setAppInstalled] = useState<boolean>(false);
    const getMarketApps = () => {
        setLoading(true);
        return new ClientApi().GetMarketAppList().then((data: any) => {
            setLoading(false);
            if (data) {
                const { MarketAppList, ErrorCode } = data as IApplications;
                if (ErrorCode === 0) {
                    const evaluatedArr = Utils.sortData(MarketAppList, "ID");
                    setApps(evaluatedArr);
                }
            }
        });
    };
    useEffect(() => {
        getMarketApps();
    }, []);

    const deactivateApp = (AppID: number, AppName: string) => {
        confirm({
            title: `${WithStringTranslate("app.uninstall.title")} ${AppName}?`,
            onOk: () => {
                return new Promise((resolve) => {
                    setTimeout(
                        () =>
                            resolve(
                                new ClientApi()
                                    .DeactivateApp(AppID)
                                    .then(async (data: any) => {
                                        if (data) {
                                            if (data.ErrorCode === 0)
                                                await getMarketApps();
                                        }
                                    })
                            ),
                        1000
                    );
                });
            },
            onCancel: () => {},
        });
    };

    const handleOk = () => {
        setVisibleModal(false);
    };
    const handleCancel = () => {
        setVisibleModal(false);
    };

    useEffect(() => {
        if (!visibleModal) {
            setTimeout(() => {
                setCurrent(0);
                setIsAccepted(false);
                setTermsAccepted(false);
            }, 250);
        }
    }, [visibleModal]);

    return (
        <a>
            {loading ? (
                <Loading cover="content" />
            ) : (
                <MarketContext.Provider
                    value={{
                        visibleModal,
                        appInstalled,
                        setAppInstalled,
                        handleOk,
                        handleCancel,
                        terms,
                        current,
                        setCurrent,
                        isAccepted,
                        setIsAccepted,
                        selectedApp,
                        termsAccepted,
                        setTermsAccepted,
                        getMarketApps,
                    }}
                >
                    <InstallWizard apps={apps} />
                    <div
                        className={`my-4 
                    container-fluid`}
                    >
                        <Row gutter={16}>
                            {apps.length > 0 && !loading ? (
                                apps.map((elm) => (
                                    <Col
                                        xs={24}
                                        sm={24}
                                        lg={12}
                                        xl={6}
                                        xxl={6}
                                        key={elm["AppType"]}
                                    >
                                        <GridItem
                                            setVisibleModal={setVisibleModal}
                                            deactivateApp={deactivateApp}
                                            data={elm}
                                            key={elm["AppType"]}
                                            setSelectedApp={setSelectedApp}
                                        />
                                    </Col>
                                ))
                            ) : (
                                <Flex justifyContent="center" className="w-100">
                                    <Empty />
                                </Flex>
                            )}
                        </Row>
                    </div>
                </MarketContext.Provider>
            )}
        </a>
    );
};

export default Market;

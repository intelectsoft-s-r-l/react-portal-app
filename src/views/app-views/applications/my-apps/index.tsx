import { Modal, Avatar, Card, Col, Empty, Row, Tag, Button } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { APP_PREFIX_PATH } from "../../../../configs/AppConfig";
import { CheckCircleOutlined, ExperimentOutlined } from "@ant-design/icons";
import Flex from "../../../../components/shared-components/Flex";
import Loading from "../../../../components/shared-components/Loading";
import { ClientApi } from "../../../../api";

const GridItem = ({ deactivateApp, data }) => {
    const [shortDesc, setShortDesc] = useState<any>();
    const locale = useSelector((state) => state["theme"].locale);
    useEffect(() => {
        try {
            setShortDesc(JSON.parse(window.atob(data.ShortDescription)));
        } catch {
            setShortDesc({ en: "", ru: "", ro: "" });
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
                <Tag className="text-capitalize" color="cyan">
                    <CheckCircleOutlined />
                    <span className="ml-2 font-weight-semibold">Installed</span>
                </Tag>
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
                    onClick={() => deactivateApp(data.ID)}
                    danger
                    type={"link"}
                    style={{
                        visibility: data.Status === 1 ? "visible" : "hidden",
                    }}
                >
                    Delete
                </Button>
            </Flex>
        </Card>
    );
};
const MyAppList = () => {
    const [apps, setApps] = useState<any>([]);
    const { confirm } = Modal;
    const [loading, setLoading] = useState(false);
    const sortData = (arr) => {
        return arr.slice().sort((a, b) => a.ID - b.ID);
    };
    const getMarketAppList = () => {
        setLoading(true);
        return new ClientApi().GetMarketAppList().then((data: any) => {
            setLoading(false);
            if (data) {
                const { ErrorCode, ErrorMessage, MarketAppList } = data;
                if (ErrorCode === 0) {
                    const activeApps = MarketAppList.filter(
                        (marketApp) => marketApp.Status != 0
                    );
                    setApps(sortData(activeApps));
                }
            }
        });
    };
    useEffect(() => {
        getMarketAppList();
    }, []);

    const deactivateApp = (AppID) => {
        confirm({
            title: `Are you sure you want to deactivate app with ID: ${AppID}?`,
            onOk: () => {
                return new ClientApi()
                    .DeactivateApp(AppID)
                    .then((data: any) => {
                        if (data) {
                            if (data.ErrorCode === 0) getMarketAppList();
                        }
                    });
            },
            onCancel: () => {},
        });
    };

    return (
        <>
            {loading ? (
                <Loading cover="content" />
            ) : (
                <div
                    className={`my-4 
                    container-fluid`}
                >
                    <Row gutter={16}>
                        {apps.length > 0 ? (
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
                                        deactivateApp={deactivateApp}
                                        data={elm}
                                        key={elm["AppType"]}
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
            )}
        </>
    );
};

export default MyAppList;

import {
    Button,
    Card,
    Col,
    Empty,
    Input,
    Menu,
    message,
    Modal,
    Row,
    Tag,
} from "antd";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
    PlusOutlined,
    ExperimentOutlined,
    EyeOutlined,
    EditOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import { connect, useDispatch, useSelector } from "react-redux";
import EllipsisDropdown from "../../../components/shared-components/EllipsisDropdown";
import Flex from "../../../components/shared-components/Flex";
import Avatar from "antd/lib/avatar/avatar";
import PageHeaderAlt from "../../../components/layout-components/PageHeaderAlt";
import { signOut } from "../../../redux/actions/Auth";
import Axios from "axios";
import { Form } from "antd";
import { API_IS_CLIENT_SERVICE } from "../../../constants/ApiConstant";
import { ROW_GUTTER } from "../../../constants/ThemeConstant";
import CreateLicenseModal from "./CreateLicenseModal";

const ItemAction = ({ packages }) => (
    <EllipsisDropdown
        menu={
            <Menu>
                <Menu.Divider />
                <Menu.Item key={2}>
                    <DeleteOutlined />
                    <span>Delete</span>
                </Menu.Item>
            </Menu>
        }
    />
);
const ItemHeader = ({ packages }) => (
    <>
        <Flex>
            <h4 className="mb-0">{packages.Name}</h4>
            <Tag
                className="text-capitalize ml-2"
                color={packages.Status === 1 ? "cyan" : "red"}
            >
                {packages.Status === 1 ? (
                    <CheckCircleOutlined />
                ) : (
                    <ClockCircleOutlined />
                )}
                <span className="ml-2 font-weight-semibold">
                    {packages.Status === 1 ? "Active" : "Not Active"}
                </span>
            </Tag>
        </Flex>
    </>
);

const ItemFooter = ({ packages }) => (
    <div>
        <h5>Pricing</h5>
        <Flex justifyContent="center">
            <Card className="mt-3">
                <div>
                    From {packages.MinValue} to {packages.MaxValue} for{" "}
                    {packages.Price} MDL
                </div>
            </Card>
        </Flex>
    </div>
);

const CardItem = ({ packages }) => {
    return (
        <Card>
            <Flex alignItems="center" justifyContent="between">
                <ItemHeader packages={packages} />
                <ItemAction packages={packages} />
            </Flex>
            <div className="mt-2">
                <ItemFooter packages={packages} />
            </div>
        </Card>
    );
};
const LicenseCardItem = ({ licenses }) => {
    return (
        <Card>
            <Flex alignItems="center" justifyContent="between">
                <div>{licenses.ApplicationVersion}</div>
                <div>{licenses.DeviceID}</div>
                <div>{licenses.ID}</div>
                <div>{licenses.LicenseCode}</div>
            </Flex>
            <div className="mt-2"></div>
        </Card>
    );
};

const AboutItem = ({ appData }) => {
    const { Photo, Status, Name, ShortDescription, LongDescription } = appData;
    return (
        <Card className="mb-5">
            <Flex>
                <div className="mr-3">
                    <Avatar
                        src={Photo}
                        icon={<ExperimentOutlined />}
                        shape="square"
                        size={80}
                    />
                </div>
                <Flex flexDirection="column">
                    <Flex flexDirection="row">
                        <h2 className="mr-3">{Name} </h2>
                        <Tag
                            className="text-capitalize"
                            color={Status === 1 ? "cyan" : "red"}
                        >
                            {Status === 1 ? (
                                <CheckCircleOutlined />
                            ) : (
                                <ClockCircleOutlined />
                            )}
                            <span className="ml-2 font-weight-semibold">
                                {Status === 1 ? "Active" : "Not Active"}
                            </span>
                        </Tag>
                    </Flex>
                    <div>
                        <span className="text-muted ">{ShortDescription}</span>
                        <p className="mt-4">{LongDescription}</p>
                    </div>
                </Flex>
            </Flex>
        </Card>
    );
};

const SingleAppPage = ({ match }) => {
    const { appID } = match.params;
    const { confirm } = Modal;
    const [app, setApp] = useState<any>();
    const [licenses, setLicenses] = useState<any>([]);
    const [apiKey, setApiKey] = useState();
    const [createLicenseVisible, setCreateLicenseVisibile] = useState(false);
    const dispatch = useDispatch();
    const Token = useSelector((state) => state["auth"].token);
    useEffect(() => {
        let mounted = true;
        Axios.get(`${API_IS_CLIENT_SERVICE}/GetMarketAppList`, {
            params: { Token },
        })
            .then((res) => {
                console.log(res.data);
                const { ErrorCode, ErrorMessage, MarketAppList } = res.data;
                if (ErrorCode === 0) {
                    const selectedApp = MarketAppList.find(
                        (data) => data.ID == appID
                    );
                    setApp(selectedApp);
                    setApiKey(selectedApp.ApyKey);
                    return selectedApp;
                } else if (ErrorCode === 118) {
                    message
                        .loading("Time has expired... Redirecting!", 1.5)
                        .then(() => dispatch(signOut()));
                } else if (ErrorCode === -1) {
                }
            })
            .then((res) => {
                if (res) {
                    Axios.get(`${API_IS_CLIENT_SERVICE}/GetAppLicensesList`, {
                        params: { Token, AppType: res["AppType"] },
                    }).then((res) => {
                        console.log(res.data);
                        if (res.data.ErrorCode === 0) {
                            setLicenses([...res.data.LicenseList]);
                        }
                    });
                }
            });
        return () => {
            mounted = false;
        };
    }, [appID]);

    if (!app) {
        return <div>No app found</div>;
    }

    const generateApiKey = () => {
        confirm({
            title: "Are you sure you want to generate a new API Key?",
            onOk: () =>
                Axios.post(`${API_IS_CLIENT_SERVICE}/GenerateApiKey`, {
                    AppID: app.ID,
                    Token,
                }).then((res) => {
                    console.log(res.data);
                    if (res.data.ErrorCode === 0) {
                        message.success("Done!", 1.5);
                        setApiKey(res.data.ApiKey);
                    } else if (res.data.ErrorCode === 118) {
                        message
                            .loading("Time has expired... Redirecting!")
                            .then(() => signOut());
                    }
                }),
            onCancel: () => {},
        });
    };

    return (
        <>
            {app.Status === 1 ? (
                <>
                    <AboutItem appData={app} />
                    <CreateLicenseModal
                        Token={Token}
                        AppType={app["AppType"]}
                        close={() => setCreateLicenseVisibile(false)}
                        visible={createLicenseVisible}
                        signOut={signOut}
                    />
                    <PageHeaderAlt className="bg-white border-bottom">
                        <div className="container-fluid">
                            <Flex
                                justifyContent="between"
                                alignItems="center"
                                className="py-4"
                            >
                                <h2>Licenses</h2>
                                <div>
                                    <Button
                                        type="primary"
                                        className="ml-2"
                                        onClick={() =>
                                            setCreateLicenseVisibile(true)
                                        }
                                    >
                                        <PlusOutlined />
                                        <span>New</span>
                                    </Button>
                                </div>
                            </Flex>
                        </div>
                    </PageHeaderAlt>
                    <div className="my-4 container-fluid">
                        <Row gutter={16}>
                            {licenses.length > 0 ? (
                                licenses.map((elm) => (
                                    <Col
                                        xs={24}
                                        sm={24}
                                        lg={8}
                                        xl={8}
                                        xxl={6}
                                        key={elm["ID"]}
                                    >
                                        <LicenseCardItem licenses={elm} />
                                    </Col>
                                ))
                            ) : (
                                <Flex className="w-100" justifyContent="center">
                                    <Empty />
                                </Flex>
                            )}
                        </Row>
                    </div>
                    <PageHeaderAlt className="bg-white border-bottom">
                        <div className="container-fluid">
                            <h2>Packages</h2>
                        </div>
                    </PageHeaderAlt>
                    <div className="my-4 container-fluid">
                        <Row gutter={16}>
                            {app.Packages.length > 0 ? (
                                app.Packages.map((elm) => (
                                    <Col
                                        xs={24}
                                        sm={24}
                                        lg={8}
                                        xl={8}
                                        xxl={6}
                                        key={elm["ID"]}
                                    >
                                        <CardItem packages={elm} />
                                    </Col>
                                ))
                            ) : (
                                <Flex className="w-100" justifyContent="center">
                                    <Empty />
                                </Flex>
                            )}
                        </Row>
                    </div>
                    <PageHeaderAlt className="bg-white border-bottom">
                        <div className="container-fluid">
                            <h2>API Key</h2>
                        </div>
                    </PageHeaderAlt>
                    <div className="my-4 container-fluid">
                        <Row gutter={ROW_GUTTER}>
                            <Col xs={12} xl={12} md={12}>
                                <Input disabled value={apiKey} />
                                <Button
                                    type="primary"
                                    className="mt-3"
                                    onClick={() => generateApiKey()}
                                >
                                    Generate
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </>
            ) : (
                <>
                    <AboutItem appData={app} />
                    <PageHeaderAlt className="bg-white border-bottom">
                        <div className="container-fluid">
                            <h2>Packages</h2>
                        </div>
                    </PageHeaderAlt>
                    <div className="my-4 container-fluid">
                        <Row gutter={16}>
                            {app.Packages.length > 0 ? (
                                app.Packages.map((elm) => (
                                    <Col
                                        xs={24}
                                        sm={24}
                                        lg={8}
                                        xl={8}
                                        xxl={6}
                                        key={elm["ID"]}
                                    >
                                        <CardItem packages={elm} />
                                    </Col>
                                ))
                            ) : (
                                <Flex className="w-100" justifyContent="center">
                                    <Empty />
                                </Flex>
                            )}
                        </Row>
                    </div>
                </>
            )}
        </>
    );
};
export default connect(null, { signOut })(SingleAppPage);

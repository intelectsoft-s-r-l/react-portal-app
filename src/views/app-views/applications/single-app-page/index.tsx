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
import EllipsisDropdown from "../../../../components/shared-components/EllipsisDropdown";
import Flex from "../../../../components/shared-components/Flex";
import Avatar from "antd/lib/avatar/avatar";
import PageHeaderAlt from "../../../../components/layout-components/PageHeaderAlt";
import { signOut } from "../../../../redux/actions/Auth";
import Axios from "axios";
import { Form } from "antd";
import { API_IS_CLIENT_SERVICE } from "../../../../constants/ApiConstant";
import { ROW_GUTTER } from "../../../../constants/ThemeConstant";
import CreateLicenseModal from "../CreateLicenseModal";
import { Link, Redirect, Route, Switch } from "react-router-dom";
import Description from "./Description";
import Licenses from "./Licenses";
import Packages from "./Packages";
import Devices from "./Devices";
import InnerAppLayout from "../../../../layouts/inner-app-layout";
import IntegrationsHeader from "./IntegrationsHeader";

enum app {
    Retail = 10,
    Agent = 20,
    Expert = 30,
}
const AppOption = ({ match, location, AppType }) => {
    return (
        <>
            {AppType == app.Retail ||
            AppType == app.Agent ||
            AppType == app.Expert ? (
                <Menu
                    mode="inline"
                    defaultSelectedKeys={[`${match.url}/:appId/`]}
                    selectedKeys={[location.pathname]}
                >
                    <Menu.Item key={`${match.url}/description`}>
                        <span>Description</span>
                        <Link to={"description"} />
                    </Menu.Item>
                    <Menu.Item key={`${match.url}/packages`}>
                        <span>Packages</span>
                        <Link to={"packages"} />
                    </Menu.Item>
                    <Menu.Item key={`${match.url}/licenses`}>
                        <span>Licenses</span>
                        <Link to={"licenses"} />
                    </Menu.Item>
                    <Menu.Item key={`${match.url}/devices`}>
                        <span>Devices</span>
                        <Link to={"devices"} />
                    </Menu.Item>
                </Menu>
            ) : (
                <Menu
                    mode="inline"
                    defaultSelectedKeys={[`${match.url}/:appId/`]}
                    selectedKeys={[location.pathname]}
                >
                    <Menu.Item key={`${match.url}/description`}>
                        <span>Description</span>
                        <Link to={"description"} />
                    </Menu.Item>
                    <Menu.Item key={`${match.url}/packages`}>
                        <span>Packages</span>
                        <Link to={"packages"} />
                    </Menu.Item>
                </Menu>
            )}
        </>
    );
};

const AppRoute = ({
    match,
    location,
    packages,
    licenses,
    setCreateLicenseVisible,
    AppType,
    setLicenses,
}) => {
    return (
        <Switch>
            <Redirect
                exact
                from={`${match.url}`}
                to={`${match.url}/description`}
            />
            <Route path={`${match.url}/description`} component={Description} />
            <Route
                path={`${match.url}/licenses`}
                render={(props) => (
                    <Licenses
                        {...props}
                        licenses={licenses}
                        setCreateLicenseVisible={setCreateLicenseVisible}
                        AppType={AppType}
                        setLicenses={setLicenses}
                    />
                )}
            />
            <Route
                path={`${match.url}/packages`}
                render={(props) => <Packages {...props} packages={packages} />}
            />
            <Route path={`${match.url}/devices`} component={Devices} />
        </Switch>
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
                        {/* <Tag
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
                        </Tag> */}
                    </Flex>
                    <div>
                        <span className="text-muted ">{ShortDescription}</span>
                        <p
                            className="mt-4"
                            dangerouslySetInnerHTML={{
                                __html: LongDescription,
                            }}
                        ></p>
                    </div>
                </Flex>
            </Flex>
        </Card>
    );
};

const SingleAppPage = ({ match, location }) => {
    const { appID } = match.params;
    const { confirm } = Modal;
    const [app, setApp] = useState<any>();
    const [licenses, setLicenses] = useState<any>([]);
    const [apiKey, setApiKey] = useState<string>();
    const [createLicenseVisible, setCreateLicenseVisible] = useState(false);
    const [activationCode, setActivationCode] = useState<string>();
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
                    const currentApp = MarketAppList.find(
                        (data) => data.ID == appID
                    );
                    setApp(currentApp);
                    if (currentApp) {
                        setApiKey(currentApp.ApyKey);
                        setActivationCode(currentApp.LicenseActivationCode);
                    }
                    return currentApp;
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
                        setLicenses([...res.data.LicenseList]);
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

    return (
        <>
            {app.Status === 1 ? (
                <>
                    <AboutItem appData={app} />
                    <IntegrationsHeader
                        activationCode={activationCode}
                        setActivationCode={setActivationCode}
                        AppID={app.ID}
                        apiKey={apiKey}
                        setApiKey={setApiKey}
                        Token={Token}
                    />
                    <InnerAppLayout
                        sideContent={
                            <AppOption
                                location={location}
                                match={match}
                                AppType={app.AppType}
                            />
                        }
                        mainContent={
                            <AppRoute
                                location={location}
                                match={match}
                                packages={app.Packages}
                                licenses={licenses}
                                AppType={app.AppType}
                                setCreateLicenseVisible={
                                    setCreateLicenseVisible
                                }
                                setLicenses={setLicenses}
                            />
                        }
                    />
                    <CreateLicenseModal
                        Token={Token}
                        setLicenses={setLicenses}
                        AppType={app["AppType"]}
                        close={() => setCreateLicenseVisible(false)}
                        visible={createLicenseVisible}
                        signOut={signOut}
                    />
                </>
            ) : (
                <AboutItem appData={app} />
            )}
        </>
    );
};
export default SingleAppPage;

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
import React, { useEffect, useState } from "react";
import { ExperimentOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import Flex from "../../../../components/shared-components/Flex";
import Avatar from "antd/lib/avatar/avatar";
import CreateLicenseModal from "../CreateLicenseModal";
import { Link, Redirect, Route, Switch } from "react-router-dom";
import Description from "./Description";
import Licenses from "./Licenses";
import Packages from "./Packages";
import Devices from "./Devices";
import InnerAppLayout from "../../../../layouts/inner-app-layout";
import IntegrationsHeader from "./IntegrationsHeader";
import { API_APP_URL } from "../../../../configs/AppConfig";
import { ClientApi } from "../../../../api";

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
    packages,
    LongDescription,
    licenses,
    getAppLicenses,
    setCreateLicenseVisible,
    AppType,
    setLicenses,
    licensesToSearch,
    setLicensesToSearch,
}) => {
    return (
        <Switch>
            <Redirect
                exact
                from={`${match.url}`}
                to={`${match.url}/description`}
            />
            <Route
                path={`${match.url}/description`}
                render={(props) => (
                    <Description {...props} LongDescription={LongDescription} />
                )}
            />
            <Route
                path={`${match.url}/licenses`}
                render={(props) => (
                    <Licenses
                        {...props}
                        licenses={licenses}
                        setCreateLicenseVisible={setCreateLicenseVisible}
                        AppType={AppType}
                        getAppLicenses={getAppLicenses}
                        setLicenses={setLicenses}
                        setLicensesToSearch={setLicensesToSearch}
                        licensesToSearch={licensesToSearch}
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
    const [shortDesc, setShortDesc] = useState<any>();
    const [longDesc, setLongDesc] = useState<any>();
    const locale = useSelector((state) => state["theme"].locale);
    useEffect(() => {
        try {
            setShortDesc(JSON.parse(window.atob(ShortDescription)));
        } catch {
            setShortDesc({ en: "", ru: "", ro: "" });
        }
    }, []);
    useEffect(() => {
        try {
            setLongDesc(JSON.parse(window.atob(LongDescription)));
        } catch {
            setLongDesc({ en: "", ru: "", ro: "" });
        }
    }, []);
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
                    </Flex>
                    <div>
                        <span className="text-muted ">
                            {shortDesc ? shortDesc[locale] : null}
                        </span>
                        <p
                            className="mt-4"
                            dangerouslySetInnerHTML={{
                                __html: longDesc ? longDesc[locale] : null,
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
    const [app, setApp] = useState<any>();
    const [licenses, setLicenses] = useState<any>([]);
    const [licensestoSearch, setLicensesToSearch] = useState<any>([]);
    const [apiKey, setApiKey] = useState<string>();
    const [createLicenseVisible, setCreateLicenseVisible] = useState(false);
    const [activationCode, setActivationCode] = useState<string>();
    const Token = useSelector((state) => state["auth"].token);
    // const sortData = (arr) => {
    //     return arr.slice().sort((a, b) => a.ID - b.ID);
    // };
    const getAppLinceses = (AppType) => {
        return new ClientApi().GetAppLicenses(AppType).then((data: any) => {
            if (data) {
                if (data.ErrorCode === 0) {
                    // const evaluatedArray = sortData(data.LicensesList);
                    setLicenses(data.LicenseList);
                    setLicensesToSearch(data.LicenseList);
                }
            }
        });
    };
    const getMarketApp = () => {
        return new ClientApi().GetMarketAppList().then((data: any) => {
            if (data) {
                const { ErrorCode, MarketAppList } = data;
                if (ErrorCode === 0) {
                    getAppLinceses(appID);
                    const currentApp = MarketAppList.find(
                        (app) => app.AppType == appID
                    );
                    setApp(currentApp);
                    if (currentApp) {
                        setApiKey(currentApp.ApyKey);
                        setActivationCode(currentApp.LicenseActivationCode);
                    }
                }
            }
        });
    };
    useEffect(() => {
        getMarketApp();
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
                                LongDescription={app.LongDescription}
                                match={match}
                                packages={app.Packages}
                                licenses={licenses}
                                AppType={app.AppType}
                                getAppLicenses={getAppLinceses}
                                licensesToSearch={licensestoSearch}
                                setLicensesToSearch={setLicensesToSearch}
                                setCreateLicenseVisible={
                                    setCreateLicenseVisible
                                }
                                setLicenses={setLicenses}
                            />
                        }
                    />
                    <CreateLicenseModal
                        Token={Token}
                        AppType={app["AppType"]}
                        close={() => setCreateLicenseVisible(false)}
                        visible={createLicenseVisible}
                        getAppLicenses={getAppLinceses}
                    />
                </>
            ) : (
                <AboutItem appData={app} />
            )}
        </>
    );
};
export default SingleAppPage;

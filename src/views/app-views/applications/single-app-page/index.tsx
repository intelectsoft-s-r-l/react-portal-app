import { Card, Menu } from "antd";
import React, { useEffect, useState } from "react";
import { ExperimentOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import Flex from "../../../../components/shared-components/Flex";
import Avatar from "antd/lib/avatar/avatar";
import { Link, Redirect, Route, Switch } from "react-router-dom";
import Description from "./Description";
import Licenses from "./Licenses";
import Packages from "./Packages";
import Devices from "./Devices";
import InnerAppLayout from "../../../../layouts/inner-app-layout";
import IntegrationsHeader from "./IntegrationsHeader";
import { ClientApi } from "../../../../api";
import News from "./news";
import Loading from "../../../../components/shared-components/Loading";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import { IState } from "../../../../redux/reducers";

enum appTypeEnum {
    Retail = 10,
    Agent = 20,
    Expert = 30,
    MyDiscount = 60,
}
const AppOption = ({ match, location, AppType }: any) => {
    return (
        <>
            {AppType == appTypeEnum.Retail ||
            AppType == appTypeEnum.Agent ||
            AppType == appTypeEnum.Expert ? (
                <Menu
                    mode="inline"
                    defaultSelectedKeys={[`${match.url}/:appId/`]}
                    selectedKeys={[location.pathname]}
                >
                    <Menu.Item key={`${match.url}/description`}>
                        <span>
                            <IntlMessage id="app.Description" />
                        </span>
                        <Link to={"description"} />
                    </Menu.Item>
                    <Menu.Item key={`${match.url}/packages`}>
                        <span>
                            <IntlMessage id="app.Packages" />
                        </span>
                        <Link to={"packages"} />
                    </Menu.Item>
                    <Menu.Item key={`${match.url}/licenses`}>
                        <span>
                            <IntlMessage id="app.Licenses" />
                        </span>
                        <Link to={"licenses"} />
                    </Menu.Item>
                    <Menu.Item key={`${match.url}/devices`}>
                        <span>
                            <IntlMessage id="app.Devices" />
                        </span>
                        <Link to={"devices"} />
                    </Menu.Item>
                </Menu>
            ) : AppType == appTypeEnum.MyDiscount ? (
                <Menu
                    mode="inline"
                    defaultSelectedKeys={[`${match.url}/:appId/`]}
                    selectedKeys={[location.pathname]}
                >
                    <Menu.Item key={`${match.url}/description`}>
                        <span>
                            <IntlMessage id="app.Description" />
                        </span>
                        <Link to={"description"} />
                    </Menu.Item>
                    <Menu.Item key={`${match.url}/packages`}>
                        <span>
                            <IntlMessage id="app.Packages" />
                        </span>
                        <Link to={"packages"} />
                    </Menu.Item>
                    <Menu.Item key={`${match.url}/news`}>
                        <span>
                            <IntlMessage id="app.News" />
                        </span>
                        <Link to={"news"} />
                    </Menu.Item>
                </Menu>
            ) : (
                <Menu
                    mode="inline"
                    defaultSelectedKeys={[`${match.url}/:appId/`]}
                    selectedKeys={[location.pathname]}
                >
                    <Menu.Item key={`${match.url}/description`}>
                        <span>
                            <IntlMessage id="app.Description" />
                        </span>
                        <Link to={"description"} />
                    </Menu.Item>
                    <Menu.Item key={`${match.url}/packages`}>
                        <span>
                            <IntlMessage id="app.Packages" />
                        </span>
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
    AppType,
}: {
    [key: string]: any;
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
                render={(props) => <Licenses {...props} AppType={AppType} />}
            />
            <Route
                path={`${match.url}/packages`}
                render={(props) => <Packages {...props} packages={packages} />}
            />
            <Route
                path={`${match.url}/devices`}
                render={(props) => <Devices {...props} AppType={AppType} />}
            />
            <Route
                path={`${match.url}/news`}
                render={(props) => <News {...props} AppType={AppType} />}
            />
        </Switch>
    );
};

const AboutItem = ({ appData }: any) => {
    const { Photo, Status, Name, ShortDescription, LongDescription } = appData;
    const [shortDesc, setShortDesc] = useState<any>();
    const [longDesc, setLongDesc] = useState<any>();
    const locale =
        useSelector((state: IState) => state["theme"]!.locale) ?? "en";
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
                        {Status === 0 && (
                            <p
                                className="mt-4"
                                dangerouslySetInnerHTML={{
                                    __html: longDesc ? longDesc[locale] : null,
                                }}
                            ></p>
                        )}
                    </div>
                </Flex>
            </Flex>
        </Card>
    );
};

const SingleAppPage = ({ match, location }: any) => {
    const { appID } = match.params;
    const [app, setApp] = useState<any>();
    const [apiKey, setApiKey] = useState<string>();
    const [activationCode, setActivationCode] = useState<string>();
    const [loading, setLoading] = useState<boolean>();
    const getMarketApp = () => {
        return new ClientApi().GetMarketAppList().then(async (data: any) => {
            if (data) {
                const { ErrorCode, MarketAppList } = data;
                if (ErrorCode === 0) {
                    const currentApp = MarketAppList.find(
                        (app: any) => app.AppType == appID
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
        return <Loading cover="content" />;
    }

    return (
        <>
            {loading ? (
                <Loading cover="content" />
            ) : app.Status === 1 ? (
                <>
                    <AboutItem appData={app} />

                    {appID == appTypeEnum.Agent ||
                    appID == appTypeEnum.Expert ||
                    appID == appTypeEnum.Retail ? (
                        <IntegrationsHeader
                            activationCode={activationCode}
                            setActivationCode={setActivationCode}
                            AppID={app.ID}
                            apiKey={apiKey}
                            setApiKey={setApiKey}
                        />
                    ) : null}
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
                                AppType={app.AppType}
                            />
                        }
                    />
                </>
            ) : (
                <AboutItem appData={app} />
            )}
        </>
    );
};
export default SingleAppPage;

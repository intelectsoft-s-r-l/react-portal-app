import React from "react";
import { useEffect, useState } from "react";
import { Card, Empty, Menu } from "antd";
import { ExperimentOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import Flex from "../../../../components/shared-components/Flex";
import Avatar from "antd/lib/avatar/avatar";
import {
  Link,
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
} from "react-router-dom";
import Description from "./Description";
import Licenses from "./Licenses/Licenses";
import Packages from "./Packages";
import Devices from "./Devices";
import InnerAppLayout from "../../../../layouts/inner-app-layout";
import { AppService } from "../../../../api";
import News from "./news";
import Loading from "../../../../components/shared-components/Loading";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import { IState } from "../../../../redux/reducers";
import { APP_NAME } from "../../../../configs/AppConfig";
import { ILocale, IMarketAppList } from "../../../../api/types.response";
import SmsCampaign from "./SMS/campaign";
import Integration from "./Integration";
import CampaignDetails from "./SMS/campaign/CampaignDetails";
import Invoice from "./ExchangeOfInvoice/Invoice";
import SmsDashboard from "./SMS/dashboard";
import InvoiceDashboard from "./ExchangeOfInvoice/Invoice/dashboard";
import OrderDashboard from "./ExchangeOfOrder/dashboard";
import Order from "./ExchangeOfOrder/order";

enum appEnum {
  Retail = 10,
  CashSalesExpertMobile = 11,
  Agent = 20,
  Expert = 30,
  MyDiscount = 60,
  StockManager = 21,
  WaiterAssistant = 31,
  KitchetAssistant = 32,
  Qiwi = 100,
  SMS = 50,
  ExchangeOfInvoice = 40,
  ExchangeOfOrder = 41,
  MobilePetrolExpertCash = 131,
}
interface IOptions extends RouteComponentProps {
  AppType: number;
  moduleSettings: IMarketAppList["ModuleSettings"];
  AppName: string;
}
const Options = ({
  AppType,
  AppName,
  location,
  match,
  moduleSettings,
}: IOptions) => {
  if (moduleSettings.Backoffice) {
    return (
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
        <Menu.Item key={`${match.url}/integration`}>
          <span>Integration</span>
          <Link to={"integration"} />
        </Menu.Item>
      </Menu>
    );
  } else if (AppType === appEnum.MyDiscount) {
    return (
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
        <Menu.Item key={`${match.url}/dashboard`}>
          <span>Dashboard</span>
          <Link to={"dashboard"} />
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
        <Menu.Item key={`${match.url}/integration`}>
          <span>Integration</span>
          <Link to={"integration"} />
        </Menu.Item>
      </Menu>
    );
  } else if (AppType === appEnum.SMS) {
    return (
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
        <Menu.Item key={`${match.url}/dashboard`}>
          <span>Dashboard</span>
          <Link to={"dashboard"} />
        </Menu.Item>
        <Menu.Item key={`${match.url}/packages`}>
          <span>
            <IntlMessage id="app.Packages" />
          </span>
          <Link to={"packages"} />
        </Menu.Item>
        <Menu.Item key={`${match.url}/campaign`}>
          <span>Campaign</span>
          <Link to={"campaign"} />
        </Menu.Item>
        <Menu.Item key={`${match.url}/integration`}>
          <span>Integration</span>
          <Link to={"integration"} />
        </Menu.Item>
      </Menu>
    );
  } else if (AppType === appEnum.ExchangeOfInvoice) {
    return (
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
        <Menu.Item key={`${match.url}/dashboard`}>
          <span>Dashboard</span>
          <Link to={"dashboard"} />
        </Menu.Item>
        <Menu.Item key={`${match.url}/packages`}>
          <span>
            <IntlMessage id="app.Packages" />
          </span>
          <Link to={"packages"} />
        </Menu.Item>
        <Menu.Item key={`${match.url}/invoice`}>
          <span>Invoice</span>
          <Link to={"invoice"} />
        </Menu.Item>
        <Menu.Item key={`${match.url}/integration`}>
          <span>Integration</span>
          <Link to={"integration"} />
        </Menu.Item>
      </Menu>
    );
  } else if (AppType === appEnum.ExchangeOfOrder) {
    return (
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
        <Menu.Item key={`${match.url}/dashboard`}>
          <span>Dashboard</span>
          <Link to={"dashboard"} />
        </Menu.Item>
        <Menu.Item key={`${match.url}/packages`}>
          <span>
            <IntlMessage id="app.Packages" />
          </span>
          <Link to={"packages"} />
        </Menu.Item>
        <Menu.Item key={`${match.url}/order`}>
          <span>Order</span>
          <Link to={"order"} />
        </Menu.Item>
        <Menu.Item key={`${match.url}/integration`}>
          <span>Integration</span>
          <Link to={"integration"} />
        </Menu.Item>
      </Menu>
    );
  } else {
    return (
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
        <Menu.Item key={`${match.url}/integration`}>
          <span>Integration</span>
          <Link to={"integration"} />
        </Menu.Item>
      </Menu>
    );
  }
};
const AppOption = (props: any) => {
  return <Options {...props} />;
};
interface IAppRoute {
  match: RouteComponentProps["match"];
  app: any;
}
const AppRoute = ({ match, app }: IAppRoute) => {
  return (
    <Switch>
      <Redirect exact from={`${match.url}`} to={`${match.url}/description`} />
      <Route
        path={`${match.url}/description`}
        exact
        render={(props) => (
          <Description {...props} LongDescription={app.LongDescription ?? ""} />
        )}
      />
      <Route
        path={`${match.url}/licenses`}
        exact
        render={(props) => <Licenses {...props} AppType={app.AppType ?? 0} />}
      />
      <Route
        path={`${match.url}/packages`}
        exact
        render={(props) => <Packages {...props} currentApp={app} />}
      />
      <Route
        path={`${match.url}/devices`}
        exact
        render={(props) => <Devices {...props} AppType={app.AppType ?? 0} />}
      />
      <Route
        path={`${match.url}/news`}
        exact
        render={(props) => <News {...props} AppType={app.AppType ?? 0} />}
      />
      <Route
        path={`${match.url}/campaign`}
        exact
        render={(props) => <SmsCampaign {...props} />}
      />
      <Route
        path={`${match.url}/integration`}
        exact
        render={() => <Integration currentApp={app} />}
      />
      <Route
        path={`${match.url}/campaign_details=:ID`}
        exact
        render={(props) => <CampaignDetails {...props} />}
      />
      <Route
        path={`${match.url}/invoice`}
        render={(props) => <Invoice {...props} />}
      />
      <Route path={`${match.url}/order`} render={(props) => <Order />} />
      <Route
        path={`${match.url}/dashboard`}
        render={(props) => {
          if (app.AppType === appEnum.SMS)
            return <SmsDashboard {...props} APIKey={app.ApyKey} />;
          else if (app.AppType === appEnum.ExchangeOfInvoice)
            return <InvoiceDashboard />;
          else return <OrderDashboard />;
        }}
      />
      <Route
        path="*"
        render={({ location }) => (
          <div>
            No match for <code>{location.pathname}</code>
          </div>
        )}
      />
    </Switch>
  );
};

const AboutItem = ({ appData }: any) => {
  const { Photo, Status, Name, ShortDescription, LongDescription } = appData;

  const [shortDesc, setShortDesc] = useState<Partial<ILocale>>({});
  const [longDesc, setLongDesc] = useState<Partial<ILocale>>({});
  useEffect(() => {
    try {
      setShortDesc(JSON.parse(window.atob(ShortDescription)));
      setLongDesc(JSON.parse(window.atob(LongDescription)));
    } catch {
      setShortDesc({ en: "", ru: "", ro: "" });
      setLongDesc({ en: "", ru: "", ro: "" });
    }
  }, []);
  const locale = useSelector((state: IState) => state["theme"]!.locale) ?? "en";
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
            <span className="text-muted ">{shortDesc[locale] ?? ""}</span>
            {Status === 0 && (
              <p
                className="mt-4"
                dangerouslySetInnerHTML={{
                  __html: longDesc[locale] ?? "",
                }}
              ></p>
            )}
          </div>
        </Flex>
      </Flex>
    </Card>
  );
};

interface ISingleAppPage
  extends RouteComponentProps<{ [key: string]: string }> {}
const SingleAppPage = ({ match, location }: ISingleAppPage) => {
  const { appID } = match.params;
  const [app, setApp] = useState<Partial<IMarketAppList>>();
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    console.log(appID);
  }, []);

  useEffect(() => {
    let mounted = true;
    new AppService().GetMarketAppList().then(async (data) => {
      if (mounted && data && data.ErrorCode === 0) {
        setLoading(false);
        const currentApp = data.MarketAppList.find(
          (app) => app.AppType === +appID
        );
        document.title = `${currentApp!.Name} | ${APP_NAME}`;
        setApp(currentApp);
      }
    });
    return function cleanup() {
      mounted = false;
    };
  }, [appID]);

  if (loading) {
    return <Loading cover="content" />;
  } else if (!app) {
    return <Empty />;
  }
  return (
    <>
      {app!.Status === 1 ? (
        <>
          <AboutItem appData={app} />
          <InnerAppLayout
            sideContent={
              <AppOption
                location={location}
                match={match}
                AppType={app!.AppType}
                moduleSettings={app!.ModuleSettings}
                AppName={app!.Name}
              />
            }
            mainContent={<AppRoute match={match} app={app} />}
          />
        </>
      ) : (
        <AboutItem appData={app} />
      )}
    </>
  );
};
export default SingleAppPage;

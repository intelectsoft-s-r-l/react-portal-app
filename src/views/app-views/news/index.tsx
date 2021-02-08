import * as React from "react";
import { Card, List, Empty, Select } from "antd";
import Flex from "../../../components/shared-components/Flex";
import { AppService } from "../../../api/app";
import { useEffect, useState } from "react";
import IntlMessage from "../../../components/util-components/IntlMessage";
import Loading from "../../../components/shared-components/Loading";
import { IShortMarketAppList, INewsList } from "../../../api/app/app.types";
import moment from "moment";

const { Option } = Select;
const ArticleItem = ({ newsData }: { newsData: INewsList }) => {
  return (
    <Card style={{ padding: 30 }}>
      <Flex justifyContent="between" alignItems="start" className="mt-3">
        <div style={{ maxWidth: 500 }}>
          <Flex flexDirection="column">
            <div
              dangerouslySetInnerHTML={{
                __html: newsData.Header,
              }}
            />
            <div
              className="mt-3"
              dangerouslySetInnerHTML={{
                __html: newsData.Content,
              }}
            />
          </Flex>
          <div style={{ position: "absolute", bottom: 15 }}>
            <Flex alignItems="center">
              <span>{newsData.CompanyName}</span>
              <span
                style={{
                  fontSize: 20,
                  color: "black",
                  margin: "0 5px 0",
                }}
              >
                &nbsp;&bull;&nbsp;
              </span>
              <span style={{ color: "black" }}>
                {newsData.CreateDate &&
                  moment
                    .unix(newsData.CreateDate.slice(6, 16))
                    .format("DD-MM-YYYY")}
              </span>
            </Flex>
          </div>
        </div>
        <div className="ml-5" style={{ maxWidth: 300 }}>
          {newsData.Photo && (
            <img
              src={newsData.Photo}
              alt="News article"
              style={{ maxWidth: "100%" }}
            />
          )}
        </div>
      </Flex>
      {/* <div style={{ position: "absolute", top: 20, right: 20 }}>
                <Tooltip title="Edit">
                    <Button icon={<EditOutlined />} onClick={() => {}} />
                </Tooltip>
           </div> */}
    </Card>
  );
};
const News = () => {
  const [news, setNews] = useState<INewsList[]>([]);
  const [appLoading, setAppLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);
  const [apps, setApps] = useState<IShortMarketAppList[]>();
  const instance = new AppService();
  const getPortalNews = async (AppType = 0) => {
    return await instance.GetPortalNews(AppType).then((data) => {
      setNewsLoading(false);
      if (data && data.ErrorCode === 0) {
        setNews(data.NewsList);
      }
    });
  };
  const getApps = async () => {
    return await instance.GetMarketAppListShort().then((data) => {
      setAppLoading(false);
      if (data && data.ErrorCode === 0) setApps(data.AppList);
    });
  };
  const onSelect = (AppType: number) => {
    setNewsLoading(true);
    if (AppType !== 0) {
      getPortalNews(AppType);
    } else {
      getPortalNews();
    }
  };
  useEffect(() => {
    getPortalNews();
    return () => instance._source.cancel();
  }, []);
  useEffect(() => {
    getApps();
    return () => instance._source.cancel();
  }, []);
  return (
    <>
      <Flex justifyContent="between" className="mb-4">
        <h2>
          <IntlMessage id="news.title" />
        </h2>
        <Select
          defaultValue={0}
          style={{ width: "150px" }}
          onChange={onSelect}
          loading={appLoading}
          disabled={appLoading}
        >
          <Option value={0}>
            <b>General</b>
          </Option>

          {apps &&
            apps.map((app) => (
              <Option value={app.AppType} key={app.AppType}>
                {app.Name}
              </Option>
            ))}
        </Select>
      </Flex>
      {newsLoading ? (
        <Loading cover="content" />
      ) : (
        <List style={{ maxWidth: 1000, margin: "0 auto" }}>
          {news && news.length > 0 ? (
            news
              .sort((a, b) => a.ID - b.ID)
              .reverse()
              .map((elm) => <ArticleItem newsData={elm} key={elm.ID} />)
          ) : (
            <Flex className="w-100" justifyContent="center">
              <Empty />
            </Flex>
          )}
        </List>
      )}
    </>
  );
};
export default News;

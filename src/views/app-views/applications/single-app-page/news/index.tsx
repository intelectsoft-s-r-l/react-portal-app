import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, Card, List, Empty, Menu, Modal, Tag, Tooltip } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { PlusCircleOutlined, EditOutlined } from "@ant-design/icons";
import { AppService } from "../../../../../api/app";
import Flex from "../../../../../components/shared-components/Flex";
import CreateNews from "./CreateNews";
import moment from "moment";
import EditNews from "./EditNews";
import IntlMessage from "../../../../../components/util-components/IntlMessage";
import Loading from "../../../../../components/shared-components/Loading";
import { INewsList } from "../../../../../api/app/app.types";
import EllipsisDropdown from "../../../../../components/shared-components/EllipsisDropdown";
import "../../../news/news.scss";

interface IArticleItem {
  newsData: INewsList;
  setEdit: Dispatch<SetStateAction<boolean>>;
  edit: boolean;
  setSelectedNew: Dispatch<SetStateAction<INewsList | undefined>>;
  refreshNews: (AppType: number) => void;
  AppType: number;
}
enum newsEnum {
  ACTIVE = 1,
  DISABLED = 2,
  INACTIVE = 0,
}
const ArticleItem = ({
  newsData,
  setEdit,
  edit,
  setSelectedNew,
  refreshNews,
  AppType,
}: IArticleItem) => {
  return (
    <Card
      style={{ padding: "20px" }}
      title={
        <Tag
          color={
            newsData.Status === newsEnum.DISABLED
              ? "red"
              : newsData.Status === newsEnum.ACTIVE
              ? "cyan"
              : "orange"
          }
        >
          {newsData.Status === newsEnum.DISABLED ? (
            <Tooltip title="Disabled">
              <CloseCircleOutlined />
            </Tooltip>
          ) : newsData.Status === newsEnum.ACTIVE ? (
            <Tooltip title="Active">
              <CheckCircleOutlined />
            </Tooltip>
          ) : (
            <Tooltip title="Not published">
              <InfoCircleOutlined />
            </Tooltip>
          )}
        </Tag>
      }
      extra={
        <EllipsisDropdown
          menu={
            <Menu>
              {newsData.Status === newsEnum.DISABLED ? (
                <Menu.Item
                  onClick={async () => {
                    Modal.confirm({
                      title: "Are you sure you want to activate this article?",
                      onOk: async () => {
                        return await new AppService()
                          .UpdateNews({
                            ...newsData,
                            Status: newsEnum.ACTIVE,
                          })
                          .then((data) => {
                            if (data && data.ErrorCode === 0)
                              refreshNews(AppType);
                          });
                      },
                    });
                  }}
                >
                  <Flex alignItems="center">
                    <CheckCircleOutlined />
                    <span className="ml-2">
                      <IntlMessage id={"users.Activate"} />
                    </span>
                  </Flex>
                </Menu.Item>
              ) : newsData.Status === newsEnum.ACTIVE ? (
                <Menu.Item
                  onClick={async () => {
                    Modal.confirm({
                      title: "Are you sure you want to disable this article?",
                      onOk: async () => {
                        return await new AppService()
                          .UpdateNews({
                            ...newsData,
                            Status: newsEnum.DISABLED,
                          })
                          .then((data) => {
                            if (data && data.ErrorCode === 0)
                              refreshNews(AppType);
                          });
                      },
                    });
                  }}
                >
                  <Flex alignItems="center">
                    <CloseCircleOutlined />
                    <span className="ml-2">
                      <IntlMessage id={"users.Disable"} />
                    </span>
                  </Flex>
                </Menu.Item>
              ) : (
                <Menu.Item
                  onClick={async () => {
                    Modal.confirm({
                      title: "Are you sure you want to publish this article?",
                      onOk: async () => {
                        return await new AppService()
                          .UpdateNews({
                            ...newsData,
                            Status: newsEnum.ACTIVE,
                          })
                          .then((data) => {
                            if (data && data.ErrorCode === 0)
                              refreshNews(AppType);
                          });
                      },
                    });
                  }}
                >
                  <Flex alignItems="center">
                    <CheckCircleOutlined />
                    <span className="ml-2">
                      <IntlMessage id={"users.Publish"} />
                    </span>
                  </Flex>
                </Menu.Item>
              )}
              <Menu.Item
                onClick={() => {
                  setSelectedNew(newsData);
                  setEdit(true);
                }}
              >
                <Flex alignItems="center">
                  <EditOutlined />
                  <span className="ml-2">
                    <IntlMessage id={"users.Edit"} />
                  </span>
                </Flex>
              </Menu.Item>
            </Menu>
          }
        />
      }
    >
      <div className="mt-3 article">
        <div style={{ maxWidth: 500 }} className="article-item content">
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
              <span style={{ color: "black" }}>
                {newsData.CreateDate &&
                  moment
                    .unix(newsData.CreateDate.slice(6, 16))
                    .format("DD-MM-YYYY")}
              </span>
            </Flex>
          </div>
        </div>
        <div className="ml-5 article-item photo" style={{ maxWidth: 300 }}>
          {newsData.Photo && (
            <img
              src={newsData.Photo}
              alt="News article"
              style={{ maxWidth: "100%" }}
            />
          )}
        </div>
      </div>
    </Card>
  );
};
const News = ({ AppType }: { AppType: number }) => {
  const instance = new AppService();
  const [loading, setLoading] = useState<boolean>(true);
  const [isCreateVisible, setCreateVisible] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [news, setNews] = useState<INewsList[]>([]);
  const [selectedNew, setSelectedNew] = useState<INewsList | undefined>(
    undefined
  );
  const getNews = async (AppType: number) => {
    setLoading(true);
    return await instance.GetAppNews(AppType).then((data) => {
      if (data && data.ErrorCode === 0) {
        setLoading(false);
        setNews(data.NewsList);
      }
    });
  };
  useEffect(() => {
    getNews(AppType);
    return () => instance._source.cancel();
  }, []);
  if (loading) {
    return <Loading cover="content" />;
  }
  return (
    <>
      <CreateNews
        visible={isCreateVisible}
        close={() => setCreateVisible(false)}
        AppType={AppType}
        getNews={getNews}
      />
      <EditNews
        visible={edit}
        close={() => setEdit(false)}
        news={selectedNew}
        getNews={getNews}
      />
      <Flex justifyContent="between" className="mb-4">
        <h2>
          <IntlMessage id="app.News" />
        </h2>
        <Button
          icon={<PlusCircleOutlined />}
          type="primary"
          onClick={() => setCreateVisible(true)}
        >
          {" "}
          <IntlMessage id="app.News.Add" />
        </Button>
      </Flex>
      <List style={{ maxWidth: 1000, margin: "0 auto" }}>
        {news && news.length > 0 ? (
          news
            .sort((a: any, b: any) => a.ID - b.ID)
            .reverse()
            .map((elm: any) => (
              <ArticleItem
                newsData={elm}
                AppType={AppType}
                refreshNews={getNews}
                key={elm.ID}
                setEdit={setEdit}
                edit={edit}
                setSelectedNew={setSelectedNew}
              />
            ))
        ) : (
          <Flex className="w-100" justifyContent="center">
            <Empty />
          </Flex>
        )}
      </List>
    </>
  );
};

export default News;

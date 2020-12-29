import { Button, Card, List, Col, Empty, Row, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { PlusCircleOutlined, EditOutlined } from "@ant-design/icons";
import { AppService } from "../../../../../api";
import Flex from "../../../../../components/shared-components/Flex";
import CreateNews from "./CreateNews";
import moment from "moment";
import EditNews from "./EditNews";
import IntlMessage from "../../../../../components/util-components/IntlMessage";

interface INewsList {
  AppType: number;
  CompanyID: number;
  Content: string;
  Header: string;
  ID: number;
  Photo: string;
}
interface INews {
  ErrorCode: number;
  ErrorMessage: string;
  NewsList: INewsList[];
}

const ArticleItem = ({ newsData, setEdit, edit, setSelectedNew }: any) => {
  return (
    <Card style={{ padding: 30 }}>
      <Flex justifyContent="between" alignItems="center" className="mt-3">
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
              alt="Photo"
              style={{ maxWidth: "100%" }}
            />
          )}
        </div>
      </Flex>
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <Tooltip title="Edit">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedNew(newsData);
              setEdit(true);
            }}
          />
        </Tooltip>
      </div>
    </Card>
  );
};
const News = ({ AppType }: any) => {
  const getNews = (AppType: number) => {
    return new AppService().GetAppNews(AppType).then((data: any) => {
      if (data) {
        if (data.ErrorCode === 0) setNews(data.NewsList);
      }
    });
  };
  useEffect(() => {
    getNews(AppType);
  }, []);
  const [isCreateVisible, setCreateVisible] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [news, setNews] = useState<any>();
  const [selectedNew, setSelectedNew] = useState<any>();
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

import React, { lazy, useState } from "react";
import PageHeaderAlt from "../../../components/layout-components/PageHeaderAlt";
import {
    Radio,
    Button,
    Row,
    Col,
    Tooltip,
    Tag,
    Progress,
    Avatar,
    Menu,
    Card,
    Modal,
    message,
    Empty,
} from "antd";
import {
    AppstoreOutlined,
    UnorderedListOutlined,
    ExperimentOutlined,
    PlusOutlined,
    PaperClipOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import utils from "../../../utils";
import { COLORS } from "../../../constants/ChartConstant";
import Flex from "../../../components/shared-components/Flex";
import EllipsisDropdown from "../../../components/shared-components/EllipsisDropdown";
import { Link, NavLink, Route, useHistory } from "react-router-dom";
import { APP_PREFIX_PATH } from "../../../configs/AppConfig";
import Axios from "axios";
import { API_IS_CLIENT_SERVICE } from "../../../constants/ApiConstant";
import { useSelector } from "react-redux";

const ItemAction = ({ data, id, removeId }) => (
    <EllipsisDropdown
        menu={
            <Menu>
                <Menu.Item key="1">
                    <Link
                        to={`${APP_PREFIX_PATH}/applications/${data.MarketID}`}
                    >
                        <EyeOutlined />
                        <span> View</span>
                    </Link>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="3">
                    <DeleteOutlined />
                    <span>Delete</span>
                </Menu.Item>
            </Menu>
        }
    />
);

const ItemInfo = ({ Status, ID, packages }) => (
    <>
        {/* <h3>Packages</h3>
        <Row gutter={16}>
            {packages.map((pckg) => (
                <Col key={pckg.ID} xl={12} xxl={12} md={12} lg={12}>
                    <Card hoverable>
                        <h4>{pckg.Name}</h4>
                        <div>
                            From {pckg.MinValue} to {pckg.MaxValue} for{" "}
                            {pckg.Price}
                        </div>
                        <div className="text-center">
                            <Tag
                                className="text-capitalize mt-3"
                                color={pckg.IsActive ? "cyan" : "red"}
                            >
                                {pckg.IsActive ? (
                                    <CheckCircleOutlined />
                                ) : (
                                    <ClockCircleOutlined />
                                )}
                                <span className="ml-2 font-weight-semibold">
                                    {pckg.IsActive ? "Active" : "Not Active"}
                                </span>
                            </Tag>
                        </div>
                    </Card>
                </Col>
            ))}
        </Row> */}
    </>
);

const GridItem = ({ data, removeId, activateApp }) => (
    <Card>
        <Flex alignItems="center" justifyContent="between">
            <ItemHeader
                AppID={data.ID}
                activateApp={activateApp}
                Status={data.Status}
                avatar={data.Photo}
                name={data.Name}
                shortDescription={
                    data.ShortDescription
                        ? data.ShortDescription
                        : "Here could be your description. Here could be your description .Here could be your description."
                }
            />
            <ItemAction data={data} id={data.ID} removeId={removeId} />
        </Flex>
        <div className="mt-2">
            <ItemInfo
                ID={data.ID}
                Status={data.Status}
                packages={data.Packages}
            />
        </div>
    </Card>
);

const ItemHeader = ({
    name,
    avatar,
    shortDescription,
    Status,
    AppID,
    activateApp,
}) => (
    <>
        <Flex>
            <div className="mr-3">
                <Avatar
                    src={avatar}
                    icon={<ExperimentOutlined />}
                    shape="square"
                    size={80}
                />
            </div>
            <Flex flexDirection="column">
                <Flex flexDirection="row">
                    <h2 className="mr-3">{name} </h2>
                    {Status === 0 && (
                        <Tag
                            className="text-capitalize cursor-pointer"
                            color="cyan"
                            onClick={() => activateApp(AppID)}
                        >
                            <CheckCircleOutlined />
                            <span className="ml-2 font-weight-semibold">
                                Activate
                            </span>
                        </Tag>
                    )}
                </Flex>
                <div>
                    <span className="text-muted ">{shortDescription}</span>
                </div>
            </Flex>
        </Flex>
    </>
);

const Market = ({ apps, signOut }) => {
    const deleteItem = (id) => {
        const data = apps.filter((elm) => elm["ID"] !== id);
    };
    const history = useHistory();

    const Token = useSelector((state) => state["auth"].token);

    const { confirm } = Modal;

    const activateApp = (AppID) => {
        confirm({
            title: `Are you sure you want to activate app with ID: ${AppID}?`,
            onOk: () => {
                Axios.post(`${API_IS_CLIENT_SERVICE}/ActivateApp`, {
                    AppID,
                    Token,
                }).then((res) => {
                    if (res.data.ErrorCode === 0) {
                        message
                            .success("Done!", 1.5)
                            .then(() =>
                                history.push(
                                    `${APP_PREFIX_PATH}/applications/my-applications`
                                )
                            );
                    } else if (res.data.ErrorCode === 118) {
                        message
                            .loading("Time has expired... Redirecting!")
                            .then(() => signOut());
                    }
                });
            },
        });
    };

    return (
        <>
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
                                xl={8}
                                xxl={8}
                                key={elm["ID"]}
                            >
                                <GridItem
                                    activateApp={activateApp}
                                    data={elm}
                                    removeId={(ID) => deleteItem(ID)}
                                    key={elm["ID"]}
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
        </>
    );
};

export default Market;

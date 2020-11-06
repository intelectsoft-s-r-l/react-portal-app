import { Avatar, Card, Col, Empty, Menu, message, Row, Tag } from "antd";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import EllipsisDropdown from "../../../components/shared-components/EllipsisDropdown";
import { APP_PREFIX_PATH } from "../../../configs/AppConfig";
import { API_IS_CLIENT_SERVICE } from "../../../constants/ApiConstant";
import { signOut } from "../../../redux/actions/Auth";
import {
    EyeOutlined,
    DeleteOutlined,
    ExperimentOutlined,
} from "@ant-design/icons";
import Flex from "../../../components/shared-components/Flex";

const ItemAction = ({ data, id, removeId }) => (
    <EllipsisDropdown
        menu={
            <Menu>
                <Menu.Item key="1">
                    <Link to={`${APP_PREFIX_PATH}/applications/${data.ID}`}>
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

const GridItem = ({ data, removeId }) => (
    <Card>
        <Flex alignItems="center" justifyContent="between">
            <ItemHeader
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

const ItemHeader = ({ name, avatar, shortDescription, Status }) => (
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
                    <Tag
                        className="text-capitalize"
                        color={Status === 1 ? "cyan" : "red"}
                    >
                        {/* {Status === 1 ? (
                            <CheckCircleOutlined />
                        ) : (
                            <ClockCircleOutlined />
                        )} */}
                        <span className="ml-2 font-weight-semibold">
                            {Status === 1 ? "Active" : "Not Active"}
                        </span>
                    </Tag>
                </Flex>
                <div>
                    <span className="text-muted ">{shortDescription}</span>
                </div>
            </Flex>
        </Flex>
    </>
);

const MyAppList = () => {
    const [apps, setApps] = useState<any>([]);
    const Token = useSelector((state) => state["auth"].token);
    const dispatch = useDispatch();
    useEffect(() => {
        Axios.get(`${API_IS_CLIENT_SERVICE}/GetMarketAppList`, {
            params: { Token },
        }).then((res) => {
            console.log(res.data);
            const { ErrorCode, ErrorMessage, MarketAppList } = res.data;
            if (ErrorCode === 0) {
                const activeApps = MarketAppList.filter(
                    (marketApp) => marketApp.Status != 0
                );
                setApps(activeApps);
            } else if (ErrorCode === 118) {
                message
                    .loading("Time has expired... Redirecting!", 1.5)
                    .then(() => dispatch(signOut()));
            } else if (ErrorCode === -1) {
            }
        });
    }, []);

    const deleteItem = (ID) => {};
    return (
        <>
            <div
                className={`my-4 
                    container-fluid`}
            >
                <Row gutter={16}>
                    {apps.map((elm) => (
                        <Col
                            xs={24}
                            sm={24}
                            lg={12}
                            xl={8}
                            xxl={8}
                            key={elm["ID"]}
                        >
                            <GridItem
                                data={elm}
                                removeId={(ID) => deleteItem(ID)}
                                key={elm["ID"]}
                            />
                        </Col>
                    ))}
                </Row>
            </div>
        </>
    );
};

export default MyAppList;

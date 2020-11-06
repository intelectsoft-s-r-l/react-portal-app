import { Button, Card, Col, Menu, message, Row, Tag } from "antd";
import React, { useEffect, useState } from "react";
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
import moment from "moment";
import Axios from "axios";
import { API_IS_CLIENT_SERVICE } from "../../../constants/ApiConstant";

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
    const [app, setApp] = useState<any>();
    const dispatch = useDispatch();
    const Token = useSelector((state) => state["auth"].token);
    useEffect(() => {
        Axios.get(`${API_IS_CLIENT_SERVICE}/GetMarketAppList`, {
            params: { Token },
        }).then((res) => {
            console.log(res.data);
            const { ErrorCode, ErrorMessage, MarketAppList } = res.data;
            if (ErrorCode === 0) {
                const selectedApp = MarketAppList.find(
                    (data) => data.ID == appID
                );
                setApp(selectedApp);
            } else if (ErrorCode === 118) {
                message
                    .loading("Time has expired... Redirecting!", 1.5)
                    .then(() => dispatch(signOut()));
            } else if (ErrorCode === -1) {
            }
        });
    }, []);
    if (!app) {
        return <div>No app found</div>;
    }

    return (
        <>
            <AboutItem appData={app} />
            <PageHeaderAlt className="bg-white border-bottom">
                <div className="container-fluid">
                    <h2>Packages</h2>
                </div>
            </PageHeaderAlt>
            <div className="my-4 container-fluid">
                <Row gutter={16}>
                    {app &&
                        app["Packages"].map((elm) => (
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
                        ))}
                </Row>
            </div>
        </>
    );
};
export default connect(null, { signOut })(SingleAppPage);

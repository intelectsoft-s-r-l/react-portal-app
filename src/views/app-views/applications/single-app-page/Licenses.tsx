import {
    Button,
    Card,
    Col,
    Empty,
    message,
    Modal,
    Row,
    Table,
    Tag,
    Tooltip,
} from "antd";
import React, { useEffect } from "react";
import Flex from "../../../../components/shared-components/Flex";
import {
    PlusOutlined,
    CloseCircleOutlined,
    CheckCircleOutlined,
    EyeOutlined,
    DeleteOutlined,
    EditOutlined,
} from "@ant-design/icons";
import moment from "moment";
import Axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { refreshToken, signOut } from "../../../../redux/actions/Auth";
import { API_IS_CLIENT_SERVICE } from "../../../../constants/ApiConstant";

const Licenses = ({
    licenses,
    setCreateLicenseVisible,
    AppType,
    setLicenses,
}) => {
    const { confirm } = Modal;
    const Token = useSelector((state) => state["auth"].token);
    const dispatch = useDispatch();
    const deleteAppLicense = (LicenseID, LicenseCode) => {
        confirm({
            title: `Are you sure you want to delete license with the code: ${LicenseCode}?`,
            onOk: () => {
                Axios.get(`${API_IS_CLIENT_SERVICE}/DeleteAppLicense`, {
                    params: { Token, LicenseID },
                }).then((res) => {
                    console.log(res.data);

                    if (res.data.ErrorCode === 0) {
                        message
                            .loading("Loading...")
                            .then(() => {
                                Axios.get(
                                    `${API_IS_CLIENT_SERVICE}/GetAppLicensesList`,
                                    {
                                        params: {
                                            Token,
                                            AppType,
                                        },
                                    }
                                ).then((res) => {
                                    setLicenses(res.data.LicenseList);
                                });
                            })
                            .then(() => message.success("Done!", 1.5));
                    } else if (res.data.ErrorCode === 118) {
                        dispatch(refreshToken(Token));
                    }
                });
            },
            onCancel: () => {},
        });
    };
    const tableColumns = [
        {
            title: "License Code",
            dataIndex: "LicenseCode",
        },
        {
            title: "Create Date",
            dataIndex: "CreateDate",
            render: (CreateDate) => (
                <span>
                    {CreateDate
                        ? moment
                              .unix(CreateDate.slice(6, 16))
                              .format("DD/MM/YYYY")
                        : " "}{" "}
                </span>
            ),
        },
        {
            title: "Activation Date",
            dataIndex: "LicenseActivationDate",
        },
        {
            title: "Status",
            dataIndex: "Status",
            render: (Status) => (
                <div>
                    <Tag
                        className="mr-0"
                        color={Status === 1 ? "cyan" : "volcano"}
                    >
                        {Status === 1 ? "Available" : "Not Available"}
                    </Tag>
                </div>
            ),
        },
        {
            dataIndex: "actions",
            render: (_, elm) => (
                <div className="text-right">
                    {elm.Status === 1 && (
                        <Tooltip title="Release">
                            <Button
                                icon={<CloseCircleOutlined />}
                                className="mr-2"
                                size="small"
                            />
                        </Tooltip>
                    )}
                    <Tooltip title="Delete">
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            onClick={() =>
                                deleteAppLicense(elm.ID, elm.LicenseCode)
                            }
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];
    return (
        <>
            <Flex justifyContent="between" alignItems="center" className="py-4">
                <h2>Licenses</h2>
                <div>
                    <Button
                        type="primary"
                        className="ml-2"
                        onClick={() => setCreateLicenseVisible(true)}
                    >
                        <PlusOutlined />
                        <span>New</span>
                    </Button>
                </div>
            </Flex>
            <Table columns={tableColumns} dataSource={licenses} rowKey="ID" />
        </>
    );
};
export default Licenses;

import { Button, Input, Modal, Table, Tag, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import Flex from "../../../../components/shared-components/Flex";
import {
    PlusOutlined,
    SearchOutlined,
    ArrowUpOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import Utils from "../../../../utils";
import { ClientApi } from "../../../../api";
import CreateLicenseModal from "../CreateLicenseModal";
import IntlMessage from "../../../../components/util-components/IntlMessage";

const Licenses = ({ AppType }) => {
    const { confirm } = Modal;
    const getAppLicenses = (AppType) => {
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
    useEffect(() => {
        getAppLicenses(AppType);
    }, []);
    const [selectedKeys, setSelectedKeys] = useState<any>([]);
    const [selectedRows, setSeletedRows] = useState<any>([]);
    const [createLicenseVisible, setCreateLicenseVisible] = useState(false);
    const [licenses, setLicenses] = useState<any>([]);
    const [licensesToSearch, setLicensesToSearch] = useState<any>([]);
    const deleteLicense = (LicenseID) => {
        return new ClientApi().DeleteLicense(LicenseID);
    };
    const releaseLicense = (LicenseID) => {
        return new ClientApi().ReleaseLicense(LicenseID);
    };
    const deleteRow = (row) => {
        const objKey = "ID";
        let data = licenses;
        Modal.confirm({
            title: `Are you sure you want to delete ${selectedRows.length} ${
                selectedRows.length > 1 ? "licenses" : "license"
            }?`,
            onOk: () => {
                if (selectedRows.length > 1) {
                    selectedRows.forEach((elm) => {
                        deleteLicense(elm.ID);
                        data = Utils.deleteArrayRow(data, objKey, elm.ID);
                        setLicenses(data);
                        setSeletedRows([]);
                    });
                } else {
                    for (const elm of row) {
                        data = Utils.deleteArrayRow(data, objKey, elm.ID);
                        setSeletedRows([]);
                        setSelectedKeys([]);
                        setLicenses(data);
                        deleteLicense(elm.ID);
                    }
                }
            },
        });
    };
    const onSearch = (e) => {
        const value = e.currentTarget.value;
        const searchArray = value ? licenses : licensesToSearch;
        const data = Utils.wildCardSearch(searchArray, value);
        setLicenses(data);
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
                    {elm.Status === 0 && (
                        <Tooltip title="Release">
                            <Button
                                icon={<ArrowUpOutlined />}
                                className="mr-2"
                                size="small"
                                onClick={() => {
                                    Modal.confirm({
                                        title: `Are you sure you want to release license ${elm.LicenseCode}?`,
                                        onOk: async () => {
                                            setSeletedRows([]);
                                            setSelectedKeys([]);
                                            await releaseLicense(elm.ID);
                                            await getAppLicenses(AppType);
                                        },
                                    });
                                }}
                            />
                        </Tooltip>
                    )}
                    <Tooltip title="Delete">
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            onClick={() => {
                                Modal.confirm({
                                    title: `Are you sure you want to delete license ${elm.LicenseCode}?`,
                                    onOk: async () => {
                                        setSeletedRows([]);
                                        setSelectedKeys([]);
                                        await deleteLicense(elm.ID);
                                        await getAppLicenses(AppType);
                                    },
                                });
                            }}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];
    return (
        <>
            <CreateLicenseModal
                AppType={AppType}
                close={() => setCreateLicenseVisible(false)}
                visible={createLicenseVisible}
                getAppLicenses={getAppLicenses}
            />
            <Flex justifyContent="between" alignItems="center" className="py-4">
                <h2>
                    <IntlMessage id="app.Licenses" />
                </h2>
                <div>
                    <Flex>
                        {selectedRows.length > 0 && (
                            <Tooltip
                                title={`${
                                    selectedRows.length > 1
                                        ? `Delete (${selectedRows.length})`
                                        : "Delete"
                                }`}
                            >
                                <Button
                                    className="mr-3"
                                    danger
                                    onClick={() => deleteRow(selectedRows)}
                                >
                                    <DeleteOutlined />
                                </Button>
                            </Tooltip>
                        )}
                        <Button
                            type="primary"
                            className="ml-2"
                            onClick={() => setCreateLicenseVisible(true)}
                        >
                            <PlusOutlined />
                            <span>New</span>
                        </Button>
                    </Flex>
                </div>
            </Flex>
            <div className="w-25 mb-3">
                <Input
                    placeholder="Search"
                    prefix={<SearchOutlined />}
                    onChange={(e) => onSearch(e)}
                />
            </div>
            <Table
                columns={tableColumns}
                dataSource={licenses}
                rowKey="ID"
                rowSelection={{
                    onChange: (key, rows) => {
                        setSelectedKeys(key);
                        setSeletedRows(rows);
                    },
                    selectedRowKeys: selectedKeys,
                    type: "checkbox",
                    preserveSelectedRowKeys: false,
                }}
            />
        </>
    );
};
export default Licenses;

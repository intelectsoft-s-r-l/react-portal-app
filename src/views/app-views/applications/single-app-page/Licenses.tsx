import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Table, Tag, Tooltip } from "antd";
import Flex from "../../../../components/shared-components/Flex";
import {
  PlusOutlined,
  SearchOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import moment from "moment";
import Utils from "../../../../utils";
import { AppService } from "../../../../api";
import CreateLicenseModal from "../CreateLicenseModal";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import { ILicenses } from "../../../../api/types.response";
import { ColumnsType } from "antd/lib/table";

const Licenses = ({ AppType }: { AppType: number }) => {
  const instance = new AppService();
  const [loading, setLoading] = useState<boolean>(true);
  const getAppLicenses = async (AppType: number) => {
    return instance.GetAppLicenses(AppType).then((data) => {
      if (data && data.ErrorCode === 0) {
        setLoading(false);
        // const evaluatedArray = sortData(data.LicensesList);
        setLicenses(data.LicenseList);
        setLicensesToSearch(data.LicenseList);
      }
    });
  };
  useEffect(() => {
    getAppLicenses(AppType);
    return () => instance._source.cancel();
  }, []);
  const [selectedKeys, setSelectedKeys] = useState<any>([]);
  const [selectedRows, setSeletedRows] = useState<ILicenses[]>([]);
  const [createLicenseVisible, setCreateLicenseVisible] = useState<boolean>(
    false
  );
  const [licenses, setLicenses] = useState<ILicenses[]>([]);
  const [licensesToSearch, setLicensesToSearch] = useState<ILicenses[]>([]);
  const deleteLicense = (LicenseID: string) => {
    return new AppService().DeleteLicense(LicenseID);
  };
  const releaseLicense = (LicenseID: string) => {
    return new AppService().ReleaseLicense(LicenseID);
  };
  const deleteRow = (row: ILicenses[]) => {
    const objKey = "ID";
    let data = licenses;
    Modal.confirm({
      title: `Are you sure you want to delete ${selectedRows.length} ${
        selectedRows.length > 1 ? "licenses" : "license"
      }?`,
      onOk: () => {
        if (selectedRows.length > 1) {
          selectedRows.forEach((elm: ILicenses) => {
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
  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const searchArray = value ? licenses : licensesToSearch;
    const data = Utils.wildCardSearch(searchArray, value);
    setLicenses(data);
  };
  const tableColumns: ColumnsType<ILicenses> = [
    {
      title: "License Code",
      dataIndex: "LicenseCode",
    },
    {
      title: "Create Date",
      dataIndex: "CreateDate",
      render: (CreateDate: ILicenses["CreateDate"]) => (
        <span>
          {CreateDate
            ? moment.unix(+CreateDate.slice(6, 16)).format("DD/MM/YYYY")
            : " "}{" "}
        </span>
      ),
    },
    {
      title: "Activation Date",
      dataIndex: "LicenseActivationDate",
      render: (date: ILicenses["LicenseActivationDate"]) => (
        <span>
          {date ? moment.unix(+date.slice(6, 16)).format("DD/MM/YYYY") : " "}
        </span>
      ),
    },
    {
      title: "IP",
      dataIndex: "PrivateIP",
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (Status: number) => (
        <div>
          <Tag className="mr-0" color={Status === 1 ? "cyan" : "volcano"}>
            {Status === 1 ? "Available" : "Not Available"}
          </Tag>
        </div>
      ),
    },
    {
      dataIndex: "actions",
      render: (_: any, elm: ILicenses) => (
        <div className="text-right">
          {elm.Status === 1 && (
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
                      debugger;
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
        loading={loading}
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

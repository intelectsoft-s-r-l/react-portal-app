import React, { createRef, useEffect, useRef, useState } from "react";
import {
  Button,
  Tooltip,
  Card,
  Divider,
  Modal,
  Result,
  Typography,
} from "antd";
import { exportComponentAsPNG } from "react-component-export-image";
import { ShareAltOutlined, DownloadOutlined } from "@ant-design/icons";
import { Link, RouteComponentProps } from "react-router-dom";
import { EnErrorCode } from "../../../../api";
import { BillService } from "../../../../api/bill-service";
import { IBill } from "../../../../api/bill-service/types";
import ErrorHandlePage from "../../../../components/shared-components/ErrorHandlePage";
import Flex from "../../../../components/shared-components/Flex";
import Loading from "../../../../components/shared-components/Loading";
import { APP_PREFIX_PATH, SUBDIR_PATH } from "../../../../configs/AppConfig";
import Utils from "../../../../utils";
import { useQuery } from "../../../../utils/hooks/useQuery";
const QRCode = require("qrcode.react");
const { Text } = Typography;
const Fiscal = ({ location }: RouteComponentProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [hasAccess, setHasAccess] = useState<boolean>(true);
  const instance = new BillService();
  const [billInfo, setBillInfo] = useState<IBill | undefined>(undefined);
  const [billCompany, setBillCompany] = useState<string>("");
  const [isShare, setIsShare] = useState(false);
  const query = useQuery();
  const ref = createRef<any>();
  const getBillInfo = () => {
    return instance
      .GetBillInfo(query.get("bill")!, query.get("device")!)
      .then((data) => {
        setLoading(false);
        if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
          setHasAccess(true);
          setBillInfo((pre) => ({
            ...pre,
            ...data.Bill,
          }));
          setBillCompany(data.Company);

          const vatArray = data.Bill.BillItems.reduce((acc, current) => {
            // @ts-ignore
            if (!acc.some((x: any) => x.VATCode === current.VATCode)) {
              // @ts-ignore
              acc.push(current);
            }
            return acc;
          }, []).sort((a: any, b: any) =>
            a.VATCode < b.VATCode ? -1 : a.VATCode < b.VATCode ? 1 : 0
          );
        }
      });
  };
  useEffect(() => {
    getBillInfo();
    return () => instance._source.cancel();
  }, []);
  if (loading) return <Loading />;
  if (!billInfo || !hasAccess)
    return (
      <div className="auth-container">
        <ErrorHandlePage>
          <Result
            status="403"
            title="Numarul de identificare fiscal incorect"
            subTitle="Ne pare rau, nu sunteti autorizati sa accesati aceaasta pagina!"
            extra={
              <Button type="primary">
                <Link to={APP_PREFIX_PATH}>
                  <span>Find your way</span>
                </Link>
              </Button>
            }
          />
        </ErrorHandlePage>
      </div>
    );
  return (
    <div className="auth-container">
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/img/others/img-17.jpg)`,
          backgroundSize: "cover",
          minHeight: "100%",
        }}
      >
        <div ref={ref} style={{ margin: "15px 0" }}>
          <Card
            style={{
              width: 350,
              maxWidth: "100%",
              margin: "0",
            }}
          >
            <Flex alignItems="center" flexDirection="column">
              <Text>"{billCompany}"</Text>
              <Text>IDNO: {billInfo.IDNO}</Text>
              <Text className="text-center">{billInfo.Address}</Text>
              <Text>
                Inr. Nr:{" "}
                {billInfo.FiscalNumber.length === 0
                  ? "--"
                  : billInfo.FiscalNumber}{" "}
              </Text>
              <span>{billInfo.FreeTextHeader}</span>
            </Flex>
            <Flex justifyContent="between" className="mb-3">
              <div>
                <Text>{Utils.padNumber(billInfo!.ShiftNumber) ?? ""}</Text>
                <br />
                <Text>#-{billInfo.Workplace}</Text>
                <br />
                <Text>#-{billInfo.User}</Text>
              </div>
            </Flex>

            {billInfo.BillItems &&
              billInfo.BillItems.map((item, idx) => (
                <div>
                  {/* We map over BillItems here */}
                  <div>
                    <Text>
                      {item.Name.length > 31
                        ? item.Name.substr(0, 31)
                        : item.Name}
                    </Text>
                  </div>
                  <div className="text-right">
                    <Text style={{ letterSpacing: 1 }}>
                      {item.Quantity.toFixed(2)} x {item.BasePrice.toFixed(2)} =
                      {item.Summ.toFixed(2)}
                    </Text>
                  </div>
                </div>
              ))}
            <Divider dashed className="mb-2 mt-3" />
            <div>
              <Flex justifyContent="between">
                <Text className="h4 font-weight-bold m-0">TOTAL</Text>
                <Text className="h4 font-weight-bold m-0">
                  {(billInfo!.Summ - billInfo!.Discount).toFixed(2)}
                </Text>
              </Flex>
              {billInfo.Discount > 0 && (
                <Flex justifyContent="between">
                  <Text>Reducere:</Text>
                  <Text>{billInfo!.Discount.toFixed(2)}</Text>
                </Flex>
              )}
            </div>
            <Flex flexDirection="column">
              {billInfo.BillItems.reduce((acc, current) => {
                // @ts-ignore
                if (!acc.some((x: any) => x.VATCode === current.VATCode)) {
                  // @ts-ignore
                  acc.push(current);
                }
                return acc;
              }, [])
                .sort((a: any, b: any) =>
                  a.VATCode < b.VATCode ? -1 : a.VATCode < b.VATCode ? 1 : 0
                )
                .map((el: any, index: number, arr: any) => {
                  const totalVat = billInfo.BillItems.filter(
                    (bil) => bil.VATCode === el.VATCode
                    // @ts-ignore
                  ).reduce((acc, curr) => acc + curr.VATTotal, 0);

                  return (
                    <Flex justifyContent="between">
                      <div>
                        TVA {el.VATCode}={el.VATValue.toFixed(2)}%
                      </div>
                      <div>{totalVat.toFixed(2)}</div>
                    </Flex>
                  );
                })}
            </Flex>
            <Flex justifyContent="between">
              <div>{billInfo.PaymantType}</div>
              <div>{billInfo.Summ.toFixed(2)}</div>
            </Flex>
            {billInfo.Change > 0 && (
              <Flex justifyContent="between">
                <div>REST</div>
                <div>{billInfo.Change.toFixed(2)}</div>
              </Flex>
            )}
            <Text>{billInfo.Client && `#Card: ${billInfo.Client}`}</Text>
            <Text></Text>
            <Flex justifyContent="center" className="my-3 text-center">
              <div>
                <Text style={{ textTransform: "uppercase", letterSpacing: 10 }}>
                  Va multumim!
                </Text>
                <br />
                <div>
                  <Text style={{ letterSpacing: 1 }}>
                    {billInfo.TotalArticle}{" "}
                    {billInfo.TotalArticle > 1 ? "ARTICOLE" : "ARTICOL"}
                  </Text>
                </div>
              </div>
            </Flex>
            <Flex justifyContent="between">
              <div>
                <Text>{Utils.padNumber(billInfo.Number)}</Text>
              </div>
              <div className="text-right">
                <Text style={{ letterSpacing: 1 }}>{billInfo.Date}</Text>
              </div>
            </Flex>
            <Flex
              alignItems="center"
              flexDirection="column"
              className="text-center"
            >
              <Text className="text-uppercase h1">Bon fiscal!</Text>
              <QRCode
                value={`https://eservicii.md/fiscal?bill=${query.get(
                  "bill"
                )}&device=${query.get("device")}`}
              />
              <small className="mt-2">
                Scaneaza codul pentru vizualizarea bonului online!
              </small>
              <div>{billInfo.FreeTextFooter}</div>
            </Flex>
          </Card>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            right: 30,
            bottom: 30,
          }}
        >
          <Tooltip title="Descarca .png" className="mb-2" placement="left">
            <Button shape="circle" onClick={() => exportComponentAsPNG(ref)}>
              <DownloadOutlined />
            </Button>
          </Tooltip>
          {navigator.share && (
            <Tooltip title="Share" placement="left">
              <Button
                shape="circle"
                type="primary"
                onClick={() => {
                  navigator.share({
                    title: "Bon fiscal",
                    url: `https://eservicii.md/fiscal?bill=${query.get(
                      "bill"
                    )}&device=${query.get("device")}`,
                  });
                }}
              >
                <ShareAltOutlined />
              </Button>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
};

export default Fiscal;

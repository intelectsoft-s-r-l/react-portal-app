import { Button, Card, Divider, Result, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, RouteComponentProps } from "react-router-dom";
import { EnErrorCode } from "../../../../api";
import { BillService } from "../../../../api/bill-service";
import { IBill } from "../../../../api/bill-service/types";
import ErrorHandlePage from "../../../../components/shared-components/ErrorHandlePage";
import Flex from "../../../../components/shared-components/Flex";
import Loading from "../../../../components/shared-components/Loading";
import {
  APP_PREFIX_PATH,
  AUTH_PREFIX_PATH,
} from "../../../../configs/AppConfig";
import { SIGNOUT } from "../../../../redux/constants/Auth";
import Utils from "../../../../utils";
import { useQuery } from "../../../../utils/hooks/useQuery";
const bonJson = {
  Company: "Tirex Petrol",
  IDNO: 100360000008275,
  Address1: "raionul Soroca, com. Varancau",
  Address2: "nedentificata 8/2 ap.54",
  DCPE: "Inr. Nr: DCPE-0001-00014",
  BonNumber: "00165",
  BonID: "01",
  Location: "PECO Singera 1",
  Admins: "IS Support",
  Liters: 18.05,
  PricePerLiter: 18.85,
  TotalPrice: 340.25,
  TotalPriceNet: "250.00",
  FuelType: "A95",
  Discount: 90.25,
  TVAPercent: "20.00%",
  TVA: 41.67,
  Card: "2975/Universal 1",
  ArticolNumber: "00001",
  Date: "12.02.2021",
  Time: "16:38:35",
};

const { Text } = Typography;
interface MatchParams {
  bill: string;
  device: string;
}
let testArray = [
  {
    Name: "A95",
    Quantity: 20,
    Summ: 377,
    BasePrice: 18.85,
    VATCode: "A",
    VATTotal: 20,
  },
  {
    Name: "A95",
    Quantity: 20,
    Summ: 377,
    BasePrice: 18.85,
    VATCode: "B",
    VATTotal: 30,
  },
];
const Fiscal = ({ match, history }: RouteComponentProps<MatchParams>) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [hasAccess, setHasAccess] = useState<boolean>(true);
  const instance = new BillService();
  const [billInfo, setBillInfo] = useState<IBill | undefined>(undefined);
  const [billCompany, setBillCompany] = useState<string>("");
  const [vatCodeTotal, setVatCodeTotal] = useState<any>({
    a: 0,
    b: 0,
    c: 0,
  });
  const query = useQuery();
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
          let a = data.Bill?.BillItems.filter(
            (item) => item.VATCode === "A"
          ).reduce((acc, curr) => acc + curr.VATTotal, 0);

          let b = data.Bill?.BillItems.filter(
            (item) => item.VATCode === "B"
          ).reduce((acc, curr) => acc + curr.VATTotal, 0);

          let c = data.Bill?.BillItems.filter(
            (item) => item.VATCode === "C"
          ).reduce((acc, curr) => acc + curr.VATTotal, 0);
          setVatCodeTotal({ a, b, c });
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
    );
  return (
    <div
      className="h-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/img/others/img-17.jpg)`,
        backgroundSize: "cover",
      }}
    >
      <Card style={{ width: 350, maxWidth: "100%" }}>
        <Flex alignItems="center" flexDirection="column">
          <Text>"{billCompany}"</Text>
          <Text>IDNO: {billInfo.IDNO}</Text>
          <Text className="text-center">{billInfo.Address}</Text>
          <Text>
            Inr. Nr:{" "}
            {billInfo.FiscalNumber.length == 0 ? "--" : billInfo.FiscalNumber}{" "}
          </Text>
          <span>{billInfo.FreeTextHeader}</span>
        </Flex>
        <Flex justifyContent="between">
          <div>
            <Text>{billInfo!.OperatorCode ?? 0o0}</Text>
            <br />
            <Text>#--{billInfo.Workplace}</Text>
            <br />
            <Text>#--{billInfo.User}</Text>
          </div>
          <Text>{billInfo.ShiftNumber ?? ""}</Text>
        </Flex>

        {billInfo.BillItems &&
          billInfo.BillItems.map((item, idx) => (
            <Flex justifyContent="between" className="mt-3" key={idx}>
              {/* We map over BillItems here */}
              <div>
                <div>&nbsp;</div>
                <Text>{item.Name}</Text>
              </div>
              <div className="text-right">
                <Text style={{ letterSpacing: 2 }}>
                  {item.Quantity.toFixed(2)} Litri x {item.BasePrice}
                </Text>
                <br />
                <Text>{item.Summ.toFixed(2)}</Text>
              </div>
            </Flex>
          ))}
        <Divider dashed />
        <Flex justifyContent="between">
          <div>
            <Text className="h4">TOTAL</Text>
            <br />
            {billInfo.Discount > 0 && <Text>Reducere:</Text>}
          </div>
          <div className="text-right">
            <Text className="h3">
              {(billInfo!.Summ - billInfo!.Discount).toFixed(2)}
            </Text>
            <br />
            {billInfo.Discount > 0 && (
              <Text>{billInfo!.Discount.toFixed(2)}</Text>
            )}
          </div>
        </Flex>
        <Flex justifyContent="between" className="my-3">
          <div>
            {vatCodeTotal.a > 0 && <div>TVA A</div>}
            {vatCodeTotal.b > 0 && <div>TVA B</div>}
            {vatCodeTotal.c > 0 && <div>TVA C</div>}
            <div>{billInfo.PaymantType}</div>
          </div>
          <div className="text-right">
            {vatCodeTotal.a > 0 && <div>{vatCodeTotal.a.toFixed(2)}</div>}
            {vatCodeTotal.b > 0 && <div>{vatCodeTotal.b.toFixed(2)}</div>}
            {vatCodeTotal.c > 0 && <div>{vatCodeTotal.c.toFixed(2)}</div>}
            <div>{(billInfo!.Summ - billInfo!.Discount).toFixed(2)}</div>
          </div>
        </Flex>
        <Text>#Card: &nbsp;&nbsp;{billInfo.Client}</Text>
        <Flex justifyContent="center" className="my-3 text-center">
          <div>
            <Text style={{ textTransform: "uppercase", letterSpacing: 10 }}>
              Va multumim!
            </Text>
            <br />
            <div>
              <Text>
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
            <Text>{billInfo.Date.split(" ")[0]}</Text>
            <br />
            <Text>{billInfo.Date.split(" ")[1]}</Text>
          </div>
        </Flex>
        <Flex
          alignItems="center"
          flexDirection="column"
          className="text-center"
        >
          <Text className="text-uppercase h3">Bon fiscal!</Text>
          <div>{billInfo.FreeTextFooter}</div>
        </Flex>
      </Card>
    </div>
  );
};

export default Fiscal;

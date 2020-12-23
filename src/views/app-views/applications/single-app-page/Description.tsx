import { Empty } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ILocale } from "../../../../api/types.response";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import { IState } from "../../../../redux/reducers";

const Description = ({ LongDescription }: { LongDescription: ILocale }) => {
  const [longDesc, setLongDesc] = useState<Partial<ILocale>>({});
  const locale = useSelector((state: IState) => state["theme"]!.locale) ?? "en";
  useEffect(() => {
    try {
      setLongDesc(JSON.parse(window.atob(LongDescription.toString())));
    } catch {
      setLongDesc({ en: "", ru: "", ro: "" });
    }
  }, []);
  return (
    <div>
      <h2 className="mb-4">
        <IntlMessage id="app.Description" />
      </h2>
      {LongDescription ? (
        <p
          dangerouslySetInnerHTML={{
            __html: longDesc[locale] ?? "en",
          }}
        ></p>
      ) : (
        <Empty />
      )}
    </div>
  );
};
export default Description;

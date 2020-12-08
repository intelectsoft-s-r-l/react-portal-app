import { Empty } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import { IState } from "../../../../redux/reducers";

const Description = ({ LongDescription }: any) => {
    const [longDesc, setLongDesc] = useState<any>();
    const locale =
        useSelector((state: IState) => state["theme"]!.locale) ?? "en";
    useEffect(() => {
        try {
            setLongDesc(JSON.parse(window.atob(LongDescription)));
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
                        __html: longDesc ? longDesc[locale] : null,
                    }}
                ></p>
            ) : (
                <Empty />
            )}
        </div>
    );
};
export default Description;

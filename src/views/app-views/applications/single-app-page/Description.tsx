import { Empty } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Description = ({ LongDescription }) => {
    const [longDesc, setLongDesc] = useState<any>();
    const locale = useSelector((state) => state["theme"].locale);
    useEffect(() => {
        try {
            setLongDesc(JSON.parse(window.atob(LongDescription)));
        } catch {
            setLongDesc({ en: "", ru: "", ro: "" });
        }
    }, []);
    return (
        <div>
            <h2 className="mb-4">Description</h2>
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

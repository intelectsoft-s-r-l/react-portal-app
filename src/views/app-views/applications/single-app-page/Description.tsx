import { Empty } from "antd";
import React from "react";

const Description = ({ LongDescription }) => {
    return (
        <div>
            <h2 className="mb-4">Description</h2>
            {LongDescription ? (
                <p dangerouslySetInnerHTML={{ __html: LongDescription }}></p>
            ) : (
                <Empty />
            )}
        </div>
    );
};
export default Description;

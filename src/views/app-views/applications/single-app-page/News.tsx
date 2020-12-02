import React, { useEffect, useState } from "react";
const NewsArray = [
    {
        Photo:
            "https://static.officeholidays.com/images/935x475c/christmas.jpg",
        Header:
            "News. News.News.News.News.News.News.News.News.News.News.News.News.",
        Content:
            "News.News.News.News.News.News.News.News.News.News.News.News.News.News.News.News.News.News.News.News. ",
        Status: 1,
    },
    {
        Photo:
            "https://static.officeholidays.com/images/935x475c/christmas.jpg",
        Header:
            "News. News.News.News.News.News.News.News.News.News.News.News.News.",
        Content:
            "News.News.News.News.News.News.News.News.News.News.News.News.News.News.News.News.News.News.News.News. ",
        Status: 1,
    },
];

const News = () => {
    const [news, setNews] = useState<any>();
    useEffect(() => {
        setNews(NewsArray);
    }, []);
    return (
        <>
            <h2 className="mb-4">News</h2>
        </>
    );
};

export default News;

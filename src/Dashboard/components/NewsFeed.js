import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Dashboard.css";

const NewsFeed = ({ location }) => {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Fetch news data using Bing News API
        const newsResponse = await axios.get(
          `https://api.bing.microsoft.com/v7.0/news/search?q=${location} traffic&count=5`,
          {
            headers: {
              "Ocp-Apim-Subscription-Key": "5d37de4bda40423b8904c2a8fcc2b755",
            },
          }
        );

        // Map and set the fetched news data
        const news = newsResponse.data.value.map((article) => ({
          title: article.name,
          url: article.url,
        }));
        setNews(news);
      } catch (error) {
        console.error("Error fetching news:", error);
        setError("Failed to fetch news. Please try again later.");
      }
    };

    if (location) {
      fetchNews();
    }
  }, [location]);

  return (
    <div className="news-feed">
      <h3>Latest Traffic News</h3>
      {error && <p className="error">{error}</p>}
      {!error && news.length === 0 && <p>Loading news...</p>}
      <ul>
        {news.map((article, index) => (
          <li key={index}>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              {article.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsFeed;

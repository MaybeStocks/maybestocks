import axios from "axios";
import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";

// import {Card, Button} from "antd"
// const { Meta } = Card;

function NewsPage() {
  const [news, setNews] = useState([]);

  // var options = {
  //   method: "GET",
  //   url: "https://api.newscatcherapi.com/v2/search",
  //   params: { topic: "business", lang: "en", sort_by: "relevancy", page: "1" },
  //   headers: {
  //     "x-api-key": "eWVWtorxiZxhg2LTBTFi1MbE0OZJyzbquQZbLuhEkzY",
  //   },
  // };

  useEffect(() => {
    const loadNews = async () => {
      const response = await axios.get(
        " https://api.nytimes.com/svc/topstories/v2/business.json?api-key=QUVRvr0H9nWSlTG6Ptz7nNseYrvOmHWi"
      );
      console.log(response);
      setNews(response.data.results);
    };
    loadNews();
  }, []);

  // console.log("news", news);

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: "100vh" }}
    >
      {news &&
        news.map((item, index) => {
          return (
            <Card
              sx={{
                maxWidth: 500,
              }}
            >
              <CardMedia
                component="img"
                height="140"
                // image={item.urlToImage}
                image={item.multimedia ? item.multimedia[0].url : "No Image"}
                alt="image"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.abstract}
                </Typography>
              </CardContent>
              <CardActions>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <Button size="small">Read More</Button>
                </a>
              </CardActions>
            </Card>
          );
        })}
    </Grid>
  );
}

export default NewsPage;

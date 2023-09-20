import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";

export default function ActionAreaCard(props) {
  const { image, title, author, date_posted, content } = props;

  return (
    <Card sx={{ maxWidth: 200 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt={author}
        />
        <CardContent>
          <p>{author}</p>
          <p>{date_posted}</p>
          <p>{title}</p>
          <p>{content.slice(0, 40)}...</p>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

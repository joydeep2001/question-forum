import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import Link from "next/link";

type ActionCardProp = {
  imageURL: string;
  title: string;
  postId: string;
};

export default function ActionCard({
  imageURL,
  title,
  postId,
}: ActionCardProp) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={imageURL}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Link href={`/post/${postId}`}>
          <Button size="small" color="primary">
            Learn more
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}

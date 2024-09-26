"use client";

import ResponsiveAppBar from "@/components/AppBar";
import Grid from "@mui/material/Grid2";
import { Paper, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

import SearchBox from "@/components/SearchBox";
import Chip from "@mui/material/Chip";
import ActionCard from "@/components/ActionCard";
import Fab from "@mui/material/Fab";
import EditIcon from "@mui/icons-material/Edit";
import { AuthProvider } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import FormModal from "@/components/CreatePostForm";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/storage";

const Banner = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: "150px 250px",
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
  position: "relative",
  backgroundImage: "url('/banner.jpg')",
}));

type Post = {
  id: string,
  title: string,
  imageUrl: string,
  topics: string[]
}

export default function Home() {
  function handleDelete() {
    console.log("Eat 5 start do nothing");
  }
  function handleClick() {
    console.log("Eat 5 start do nothing");
  }
  function handleCreatePost() {
    setCreatePost(true);
  }
  function handleClose() {
    setCreatePost(false);
  }

  const [posts, setPosts] = useState<Post[]>([]); // State to hold Firestore posts

  const [showCreatePost, setCreatePost] = useState<boolean>(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "posts"));
        const postsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title as string,
          imageUrl: doc.data().imageUrl as string,
          topics: doc.data().topics as string[]
        }));
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);
  function updatePostsState(post: Post) {
    setPosts((state) => [...state, post]);
  }
  return (
    <AuthProvider>
      <Box sx={{ flexGrow: 1 }}>
        <ResponsiveAppBar />
        <Grid container>
          <Grid size={12}>
            <Banner>
              <SearchBox />
            </Banner>
          </Grid>
          <Grid size={12}>
            <Stack direction="row" spacing={1} sx={{ padding: 4 }}>
              <Chip
                label="Recent posts"
                color="primary"
                onClick={handleClick}
                onDelete={handleDelete}
              />

              <Chip
                label="React"
                color="primary"
                onClick={handleClick}
                onDelete={handleDelete}
              />
            </Stack>
          </Grid>
          <Grid size={12}>
            <Box gap={2} sx={{ padding: 4, display: "flex", flexWrap: "wrap" }}>
              {posts.map((post) => (
                <ActionCard
                  key={post.id}
                  title={post.title}
                  imageURL={post.imageUrl || "/default_image.png"}
                  postId={post.id}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
        <Fab
          onClick={handleCreatePost}
          color="secondary"
          aria-label="edit"
          style={{ position: "fixed", bottom: "16px", right: "16px" }}
        >
          <EditIcon />
        </Fab>
        {showCreatePost && (
          <FormModal
            updatePostsState={updatePostsState}
            handleClose={handleClose}
          />
        )}
      </Box>
    </AuthProvider>
  );
}

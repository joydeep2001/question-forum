"use client";

import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase/storage";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  CardMedia,
  Paper,
  Avatar,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import ReplyIcon from "@mui/icons-material/Reply";

import type { Post, Comment } from "@/lib/types/common";
import { useAuth } from "@/context/AuthContext";

export default function PostDetails() {
  const params = useParams();
  const postid = Array.isArray(params?.postid)
    ? params.postid[0]
    : params?.postid; // Ensure postid is a string
  const [post, setPost] = useState<Post | null>(null); // Store the post data
  const [comment, setComment] = useState(""); // State for the comment input
  const [reply, setReply] = useState<{ [key: string]: string }>({}); // Store reply for each comment

  const { profile, isLoggedIn } = useAuth();

  // Fetch post data from Firestore
  useEffect(() => {
    const fetchPost = async () => {
      if (postid) {
        const docRef = doc(db, "posts", postid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost(docSnap.data() as Post);
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchPost();
  }, [postid]);

  // Handle comment submission
  const handleAddComment = async () => {
    if (!isLoggedIn) {
      alert("You must be logged in before");
      return;
    }
    if (postid && comment.trim()) {
      const postRef = doc(db, "posts", postid);
      const commentPayload = {
        text: comment,
        timestamp: new Date().toISOString(),
        senderId: profile?.sub ?? "no name",
        senderName: profile?.nickname ?? "no nickname",
        image: profile?.picture ?? "no picture",
        replies: [],
      };
      await updateDoc(postRef, {
        comments: arrayUnion(commentPayload),
      });

      setComment("");

      setPost((post) => {
        const postCopy = JSON.parse(JSON.stringify(post)) as Post;

        if (!postCopy.comments) {
          postCopy.comments = [];
        }

        postCopy.comments?.push(commentPayload);
        return postCopy;
      });

      alert("Comment added!");
    }
  };

  // Handle reply submission for a specific comment
  const handleAddReply = async (commentIndex: number) => {
    const selectedComment = post?.comments?.[commentIndex];
    if (!isLoggedIn) {
      alert("You must be logged in before");
      return;
    }
    if (postid && selectedComment && reply[commentIndex]?.trim()) {
      const postRef = doc(db, "posts", postid);
      const replyPayload: Comment = {
        text: reply[commentIndex],
        timestamp: new Date().toISOString(),
        senderId: profile?.sub ?? "no name",
        senderName: profile?.nickname ?? "no nickname",
        image: profile?.picture ?? "no picture",
      };
      selectedComment.replies?.push(replyPayload);

      await updateDoc(postRef, {
        comments: post?.comments,
      });

      setReply((prev) => ({ ...prev, [commentIndex]: "" }));

      setPost((post) => {
        const postCopy = JSON.parse(JSON.stringify(post)) as Post;
        postCopy.comments![commentIndex] = selectedComment;
        return postCopy;
      });

      alert("Reply added!");
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: "100vh",
        p: 4,
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          minHeight: "100vh",
          height: "auto",
          width: "80%",
          maxWidth: 800,
        }}
      >
        <Box>
          {post ? (
            <>
              {/* User Details */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 4,
                  bgcolor: "#e3f2fd",
                  p: 2,
                  borderRadius: 1,
                }}
              >
                <Avatar
                  src={post.image} // Assuming post.image is the user's profile image
                  alt={post.userName}
                  sx={{ mr: 2 }}
                />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {post.userName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Posted on: {new Date(post.timestamp).toLocaleDateString()}{" "}
                    {/* Add timestamp if available */}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="h4" gutterBottom align="center">
                {post.title}
              </Typography>
              <CardMedia
                component="img"
                image={post.imageUrl}
                alt={post.title}
                sx={{
                  borderRadius: 2,
                  mb: 4,
                  objectFit: "contain",
                  maxHeight: 500,
                  width: "100%",
                }}
              />

              {/* Displaying Comments */}
              <Typography variant="h6" gutterBottom>
                Comments:
              </Typography>
              <Stack spacing={2}>
                {post.comments?.map((comment: Comment, index: number) => (
                  <Box
                    key={index}
                    sx={{
                      borderBottom: "1px solid #ccc",
                      p: 2,
                      bgcolor: "#fafafa",
                      borderRadius: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={comment.image}
                        alt={comment.senderName}
                        sx={{ mr: 2 }}
                      />
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {comment.senderName}
                        </Typography>
                        <Typography variant="body2">{comment.text}</Typography>
                      </Box>
                    </Box>
                    {/* Display replies */}
                    {comment.replies?.map((reply: Comment, replyIndex: number) => (
                      <Box
                        key={replyIndex}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          pl: 4,
                          mt: 2,
                          bgcolor: "#f0f0f0",
                          borderRadius: 1,
                        }}
                      >
                        <Avatar
                          src={reply.image}
                          alt={reply.senderName}
                          sx={{ mr: 2 }}
                        />
                        <Box>
                          <Typography variant="body1" fontWeight="bold">
                            {reply.senderName}
                          </Typography>
                          <Typography variant="body2">{reply.text}</Typography>
                        </Box>
                      </Box>
                    ))}

                    {/* Reply button and input */}
                    <Box sx={{ mt: 2 }}>
                      <IconButton
                        onClick={() =>
                          setReply((prev) => ({
                            ...prev,
                            [index]: prev[index] ? "" : "replying", // Toggle reply input
                          }))
                        }
                      >
                        <ReplyIcon />
                      </IconButton>
                      {reply[index] !== "" && (
                        <Box>
                          <TextField
                            label="Write a reply"
                            variant="outlined"
                            fullWidth
                            value={reply[index] ?? ""}
                            onChange={(e) =>
                              setReply((prev) => ({
                                ...prev,
                                [index]: e.target.value,
                              }))
                            }
                            multiline
                            rows={2}
                            sx={{ mb: 2, mt: 1 }}
                          />
                          <Button
                            variant="contained"
                            fullWidth
                            onClick={() => handleAddReply(index)}
                          >
                            Submit Reply
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </Box>
                ))}
              </Stack>

              {/* Comment Input */}
              <Box sx={{ mt: 4 }}>
                <TextField
                  label="Add a comment"
                  variant="outlined"
                  fullWidth
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  multiline
                  rows={3}
                  sx={{ mb: 2 }}
                />
                <Button
                  sx={{ mt: 2 }}
                  variant="contained"
                  fullWidth
                  onClick={handleAddComment}
                >
                  Submit Comment
                </Button>
              </Box>
            </>
          ) : (
            <Typography align="center">Loading...</Typography>
          )}
        </Box>
      </Paper>
    </Grid>
  );
}

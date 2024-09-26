import React, { useState } from "react";
import { Modal, Box, TextField, Button, Chip, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebase/storage";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import type {Post} from "@/lib/types/common";

const style = {
  position: "absolute",
  top: 0,
  left: "50%",
  transform: "translateX(-50%)",
  height: "100%",
  width: "50%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflowY: "auto", // Allow scrolling if content overflows
};

export default function FormModal({
  handleClose,
  updatePostsState
}: {
  handleClose: () => void;
  updatePostsState: (post: Post) => void;
}) {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [inputTopic, setInputTopic] = useState("");
  const [error, setError] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const { profile } = useAuth();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedImage = event.target.files[0];
      setImage(selectedImage);

      // Create a preview of the uploaded image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  const handleTopicKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "," && inputTopic.trim()) {
      event.preventDefault(); // Prevent adding a comma to the input
      setTopics([...topics, inputTopic.trim()]);
      setInputTopic(""); // Clear the input
    }
  };

  const handleDeleteTopic = (topicToDelete: string) => {
    setTopics(topics.filter((topic) => topic !== topicToDelete));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!title || topics.length === 0 || !image) {
      setError("Please fill in all fields.");
      return;
    }

    setIsUploading(true); // Show loading state during the upload

    try {
      // 1. Upload the image to Firebase Storage
      const imageRef = ref(storage, `images/${image.name}`);
      const uploadTask = uploadBytesResumable(imageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // You can track progress here if you want
          console.log(snapshot.state);
        },
        (error) => {
          console.error("Upload failed:", error);
          setIsUploading(false);
          setError("Failed to upload the image");
        },
        async () => {
          // When the upload is complete, get the download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // 2. Store form data in Firestore
          const post = await addDoc(collection(db, "posts"), {
            title,
            imageUrl: downloadURL,
            topics,
            userId: profile?.sub,
            userName: profile?.nickname,
            image: profile?.picture,
            timestamp: Date.now()
          });

          // 3. Reset the form and close the modal
          setTitle("");
          setImage(null);
          setImagePreview(null);
          setTopics([]);
          setInputTopic("");
          setError("");
          setIsUploading(false);
          handleClose();

          //4. Update the posts state
          updatePostsState({
            id: post.id,
            title,
            imageUrl: downloadURL,
            topics,
            userId: profile?.sub ?? "no name",
            userName: profile?.nickname ?? "no name",
            image: profile?.picture ?? "pic",
            timestamp: Date.now()
          });
        }
      );
    } catch (error) {
      console.error("Error submitting the form:", error);
      setError("Failed to submit the form");
      setIsUploading(false);
    }
  };

  return (
    <div>
      <Modal
        open={true}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          {profile ? (
            <>
              <h2 id="modal-title">Submit Your Question</h2>

              {/* Error Message */}
              {error && <p style={{ color: "red" }}>{error}</p>}

              {/* Title Field */}
              <TextField
                label="Title"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                margin="normal"
                error={!title && error !== ""}
                helperText={!title && error !== "" ? "Title is required." : ""}
              />

              {/* Image Upload Field */}
              <Button
                variant="contained"
                component="label"
                sx={{ mt: 2, mb: 2 }}
              >
                Upload Image
                <input type="file" hidden onChange={handleImageUpload} />
              </Button>
              {image && (
                <div>
                  <p>Selected file: {image.name}</p>
                  {imagePreview && (
                    <Image
                      width={300}
                      height={300}
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        width: "100%",
                        maxHeight: "300px",
                        objectFit: "contain",
                        marginTop: "10px",
                      }}
                    />
                  )}
                </div>
              )}

              {/* Topics Field */}
              <TextField
                label="Topics (comma separated)"
                fullWidth
                value={inputTopic}
                onChange={(e) => setInputTopic(e.target.value)}
                onKeyDown={handleTopicKeyDown}
                margin="normal"
              />
              {/* Chips for Topics */}
              <Stack
                direction="row"
                spacing={1}
                sx={{ mt: 1, flexWrap: "wrap" }}
              >
                {topics.map((topic, index) => (
                  <Chip
                    key={index}
                    label={topic}
                    onDelete={() => handleDeleteTopic(topic)}
                    deleteIcon={<CloseIcon />}
                  />
                ))}
              </Stack>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Submit"}
              </Button>
            </>
          ) : (
            <Link
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
              href="/api/auth/login"
            >
              <Button variant="contained" color="secondary">
                Login
              </Button>
            </Link>
          )}
        </Box>
      </Modal>
    </div>
  );
}

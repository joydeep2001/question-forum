export type Comment = {
  text: string,
  senderId: string,
  senderName: string,
  image: string,
  timestamp: string
}

export type Post = {
  id: string;
  userId: string;
  userName: string;
  image: string;
  title: string;
  imageUrl: string;
  topics: string[];
  comments?: Comment[];
  timestamp: number
};

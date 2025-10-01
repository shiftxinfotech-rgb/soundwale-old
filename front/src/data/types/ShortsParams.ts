import {RoleBean} from './RoleParam';

export type ShortsResponse = {
  status?: boolean;

  data?: ShortsBean[];
};

export type CommentResponse = {
  status?: boolean;

  data?: {
    comments: CommentBean[];
  };
};

export interface CommentBean {
  comment_id: number;
  user_id: number;
  message: string;
  created_at: string;
  user: UserBean;
  replies: ReplyBean[];
}

export interface UserBean {
  id: number;
  name: string;
  email: string;
  image_url: string;
}

export interface ReplyBean {
  reply_id: number;
  user_id: number;
  message: string;
  created_at: string;
  user: UserBean;
}

export type ShortsBean = {
  id: number;
  video_url: string;
  uploaded_by: UploadedBy;
  description: string;
  roles: RoleBean[];
  likes_count: number;
  comments_count: number;
  is_likes: number;
  comments: CommentBean[];
};

export type UploadedBy = {
  id: number;
  email: string;
  name: string;
  image_url: string;
};

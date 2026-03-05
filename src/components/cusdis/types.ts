export type CusdisComment = {
  id: string;
  content: string;
  by_nickname: string;
  by_email?: string;
  createdAt: string;
  parentId?: string | null;
  replies: {
    data: CusdisComment[];
    commentCount: number;
    pageCount: number;
    pageSize: number;
  };
};

export type CommentsResponse = {
  data: {
    data: CusdisComment[];
    commentCount: number;
    pageCount: number;
    pageSize: number;
  };
};

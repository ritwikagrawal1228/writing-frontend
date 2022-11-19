/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Answer = {
  __typename?: 'Answer';
  Status: Scalars['String'];
  answer: Scalars['String'];
  answerSpentTime: Scalars['Int'];
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  problem: Problem;
  problemId: Scalars['String'];
  updatedAt: Scalars['String'];
  user: User;
  userId: Scalars['String'];
};

export type CreateAnswerInput = {
  answer: Scalars['String'];
  answerSpentTime: Scalars['Int'];
  problemId: Scalars['String'];
  status: Scalars['String'];
};

export type CreateProblemInput = {
  question: Scalars['String'];
  taskType: Scalars['String'];
  title: Scalars['String'];
  userId: Scalars['String'];
};

export type CreateReplyInput = {
  comment: Scalars['String'];
  reviewId: Scalars['String'];
  userId: Scalars['String'];
};

export type CreateReviewInput = {
  answerId: Scalars['String'];
  comment: Scalars['String'];
  line: Scalars['String'];
  userId: Scalars['String'];
};

export type CreateReviewRequestInput = {
  answerId: Scalars['String'];
  comment?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type CreateUserInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
};

export type Invitation = {
  __typename?: 'Invitation';
  answer: Answer;
  answerId: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createAnswer: Answer;
  createProblem: Problem;
  createReply: Reply;
  createReview: Review;
  createReviewRequest: ReviewRequest;
  createUser: User;
  updateAnswer: Answer;
  updateProblem: Problem;
  updateReply: Reply;
  updateReview: Review;
  updateUser: User;
};


export type MutationCreateAnswerArgs = {
  input: CreateAnswerInput;
};


export type MutationCreateProblemArgs = {
  input: CreateProblemInput;
};


export type MutationCreateReplyArgs = {
  input: CreateReplyInput;
};


export type MutationCreateReviewArgs = {
  input: CreateReviewInput;
};


export type MutationCreateReviewRequestArgs = {
  input: CreateReviewRequestInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationUpdateAnswerArgs = {
  input: UpdateAnswerInput;
};


export type MutationUpdateProblemArgs = {
  input: UpdateProblemInput;
};


export type MutationUpdateReplyArgs = {
  input: UpdateReplyInput;
};


export type MutationUpdateReviewArgs = {
  input: UpdateReviewInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type Problem = {
  __typename?: 'Problem';
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  question: Scalars['String'];
  questionImageUrl: Scalars['String'];
  taskType: Scalars['String'];
  title: Scalars['String'];
  updatedAt: Scalars['String'];
  user: User;
  userId: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  InvitationByEmail: Invitation;
  answer: Answer;
  answersByProblemId: Array<Answer>;
  problem: Problem;
  problemsByUserId: Array<Problem>;
  repliesByReviewId: Array<Reply>;
  reviewRequestsByUserId: Array<ReviewRequest>;
  reviewsByAnswerId: Array<Review>;
  searchUsers: Array<User>;
  user: User;
};


export type QueryInvitationByEmailArgs = {
  email: Scalars['String'];
};


export type QueryAnswerArgs = {
  answerId: Scalars['String'];
};


export type QueryAnswersByProblemIdArgs = {
  problemId: Scalars['String'];
  status?: InputMaybe<Scalars['String']>;
};


export type QueryProblemArgs = {
  problemId: Scalars['String'];
};


export type QueryProblemsByUserIdArgs = {
  isAnswered?: InputMaybe<Scalars['Boolean']>;
  taskType?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  userId: Scalars['String'];
};


export type QueryRepliesByReviewIdArgs = {
  reviewId: Scalars['String'];
};


export type QueryReviewRequestsByUserIdArgs = {
  userId: Scalars['String'];
};


export type QueryReviewsByAnswerIdArgs = {
  answerId: Scalars['String'];
};


export type QuerySearchUsersArgs = {
  email?: InputMaybe<Scalars['String']>;
  plan?: InputMaybe<Scalars['String']>;
  squareId?: InputMaybe<Scalars['String']>;
};


export type QueryUserArgs = {
  userId: Scalars['String'];
};

export type Reply = {
  __typename?: 'Reply';
  comment: Scalars['String'];
  id: Scalars['ID'];
  review: Review;
  reviewId: Scalars['String'];
};

export type Review = {
  __typename?: 'Review';
  answer: Answer;
  answerId: Scalars['String'];
  comment: Scalars['String'];
  id: Scalars['ID'];
  line: Scalars['String'];
  user: User;
  userId: Scalars['String'];
};

export type ReviewRequest = {
  __typename?: 'ReviewRequest';
  answer: Answer;
  answerId: Scalars['String'];
  comment: Scalars['String'];
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  status: Scalars['String'];
  updatedAt: Scalars['String'];
  user: User;
  userId: Scalars['String'];
};

export type UpdateAnswerInput = {
  answer: Scalars['String'];
  answerId: Scalars['String'];
  answerSpentTime: Scalars['Int'];
  problemId: Scalars['String'];
  status: Scalars['String'];
};

export type UpdateProblemInput = {
  problemId: Scalars['String'];
  question: Scalars['String'];
  taskType: Scalars['String'];
  title: Scalars['String'];
  userId: Scalars['String'];
};

export type UpdateReplyInput = {
  comment: Scalars['String'];
  replyId: Scalars['String'];
  reviewId: Scalars['String'];
  userId: Scalars['String'];
};

export type UpdateReviewInput = {
  answerId: Scalars['String'];
  comment: Scalars['String'];
  line: Scalars['String'];
  reviewId: Scalars['String'];
  userId: Scalars['String'];
};

export type UpdateUserInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  userId: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  id: Scalars['ID'];
  introduction: Scalars['String'];
  isAdmin: Scalars['Boolean'];
  isDarkMode: Scalars['Boolean'];
  isEmailVerified: Scalars['Boolean'];
  isSubscribeEmail: Scalars['Boolean'];
  isSubscribePush: Scalars['Boolean'];
  language: Scalars['String'];
  plan: Scalars['String'];
  problems: Array<Problem>;
  profileImageUrl: Scalars['String'];
  squareId: Scalars['String'];
  studyTarget: Scalars['String'];
  userType: Scalars['String'];
};

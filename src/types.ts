export type ID = string;

export type User = {
  id: ID;
  username: string;
  discriminator: string; // e.g. "0001"
  avatar?: string | null;
  role?: "owner" | "moderator" | "member" | "bot";
};

export type Guild = {
  id: ID;
  name: string;
  icon?: string | null;
  unread?: boolean;
};

export type Channel = {
  id: ID;
  guildId?: ID | null;
  name: string;
  type: "text" | "voice" | "dm";
};

export type Message = {
  id: ID;
  channelId: ID;
  author: User;
  content: string;
  attachments?: Array<{ url: string; filename?: string }>;
  createdAt: string;
  editedAt?: string | null;
  temp?: boolean;
};

import { v4 as uuid } from "uuid";
import type { Guild, Channel, User, Message } from "../types";

function makeUser(
  name: string,
  disc = "0001",
  role: User["role"] = "member"
): User {
  return {
    id: uuid(),
    username: name,
    discriminator: disc,
    avatar: null,
    role,
  };
}

const me = makeUser("Eshwar S", "0001", "owner");
const user2 = makeUser("InnocentZERO", "0023");
const user3 = makeUser("KingDudeDS", "0099");
const bot = makeUser("DevBot", "0000", "bot");

export const USERS: Record<string, User> = {
  [me.id]: me,
  [user2.id]: user2,
  [user3.id]: user3,
  [bot.id]: bot,
};

export const GUILDS: Guild[] = [
  { id: "g-1", name: "Eoncord HQ", icon: "/icons/server1.png", unread: true },
  { id: "g-2", name: "Developers Hub", icon: "/icons/server2.png" },
];

export const CHANNELS: Channel[] = [
  { id: "c-general", guildId: "g-1", name: "general", type: "text" },
  { id: "c-ann", guildId: "g-1", name: "announcements", type: "text" },
  { id: "c-voice", guildId: "g-1", name: "General", type: "voice" },
];

export const MESSAGES: Record<string, Message[]> = {
  // channelId -> messages ordered oldest -> newest
  "c-general": [
    {
      id: uuid(),
      channelId: "c-general",
      author: user2,
      content: "Welcome to the channel!",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: uuid(),
      channelId: "c-general",
      author: me,
      content: "This is a mock message from Eshwar.",
      createdAt: new Date().toISOString(),
    },
  ],
  "c-ann": [],
  "c-voice": [],
};

export const SESSIONS: Record<string, { userId: string; token: string }> = {};

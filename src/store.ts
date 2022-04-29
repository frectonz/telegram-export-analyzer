import { makeStore } from "./helpers/makeStore";
import { None, Option, Result } from "optionem";

export interface Content {
  id: number;
  name: string;
  type: string;
  messages: (
    | NormalMessage
    | CreateGroupMessage
    | InviteMembers
    | RemoveMembers
    | InviteMembersToGroupCalls
    | EditGroupTitle
    | MigrateFromGroup
  )[];
}

interface Message {
  id: number;
  date: string;
  text: string;
}

interface NormalMessage extends Message {
  from: string;
  from_id: string;
  type: "message";
  forwarded_from?: string;
}

interface ServiceMessage extends Message {
  actor: string;
  actor_id: string;
  type: "service";
  action: string;
}

// action:
//   | "create_group"
//   | "edit_group_title"
//   | "edit_group_photo"
//   | "invite_members"
//   | "remove_members"
//   | "migrate_to_supergroup"
//   | "pin_message"
//   | "invite_to_group_call"
//   | "migrate_from_group"
//   | "score_in_game"

interface WithMembers extends ServiceMessage {
  members: string[];
}

interface CreateGroupMessage extends WithMembers {
  title: string;
  action: "create_group";
}

interface InviteMembers extends WithMembers {
  action: "invite_members";
}

interface RemoveMembers extends WithMembers {
  action: "remove_members";
}

interface InviteMembersToGroupCalls extends WithMembers {
  action: "invite_to_group_call";
}

interface EditGroupTitle extends ServiceMessage {
  action: "edit_group_title";
  title: string;
}

interface MigrateFromGroup extends ServiceMessage {
  action: "migrate_from_group";
  title: string;
}

type Error =
  | { type: "NoFileSelected" }
  | { type: "FailedToParseFile"; filename: string };
export type State = Option<Result<Content, Error>>;
export type Action = { type: "SET_STATE"; payload: State };

export const { StoreProvider, useDispatch, useStore } = makeStore<
  State,
  Action
>((state, action) => {
  switch (action.type) {
    case "SET_STATE":
      return action.payload;
    default:
      return state;
  }
}, new None());

export function getMembersWithMessages({
  messages,
}: Content): { name: string; messages: number }[] {
  const membersWithMessages = messages.reduce(
    (acc: Map<string, number>, message) => {
      if (message.type == "message") {
        const messages = acc.get(message.from) || 0;
        acc.set(message.from || message.from_id, messages + 1);
      }

      if (message.type === "service") {
        if (message.action === "remove_members") {
          message.members.forEach((member) => {
            acc.delete(member);
          });
        }
      }

      return acc;
    },
    new Map()
  );

  const members = Array.from(membersWithMessages.entries())
    .map(([name, messages]) => ({
      name,
      messages,
    }))
    .sort((a, b) => b.messages - a.messages);

  return members;
}

export function countMessages({ messages }: Content) {
  const totalMessages = messages.reduce((acc: number, message) => {
    if (message.type === "message") {
      acc += 1;
    }
    return acc;
  }, 0);

  return totalMessages;
}

export function getForwardedMessages({ messages }: Content) {
  const forwardedMessages = messages.reduce((acc: NormalMessage[], message) => {
    if (message.type === "message") {
      if (message.forwarded_from) {
        acc.push(message);
      }
    }
    return acc;
  }, []);

  return forwardedMessages;
}

export function shouldNavigateToAnalyticsPage(state: State) {
  return state.match({
    None() {
      return false;
    },
    Some(value) {
      return value.match({
        Ok() {
          return true;
        },
        Err() {
          return false;
        },
      });
    },
  });
}

export function shouldNavigateToHomePage(state: State) {
  return state.match({
    None() {
      return true;
    },
    Some(value) {
      return value.match({
        Ok() {
          return false;
        },
        Err() {
          return true;
        },
      });
    },
  });
}

export function getGroupNameHistory({
  messages,
}: Content): { actor: string; date: string; title: string }[] {
  const groupNameHistory = messages.reduce(
    (acc: { actor: string; date: string; title: string }[], message) => {
      if (message.type === "service") {
        if (message.action === "create_group") {
          acc.push({
            actor: message.actor || message.actor_id,
            date: message.date,
            title: message.title,
          });
        } else if (message.action === "edit_group_title") {
          acc.push({
            actor: message.actor || message.actor_id,
            date: message.date,
            title: message.title,
          });
        } else if (message.action === "migrate_from_group") {
          acc.push({
            actor: message.actor,
            date: message.date,
            title: message.title,
          });
        }
      }
      return acc;
    },
    []
  );

  return groupNameHistory;
}

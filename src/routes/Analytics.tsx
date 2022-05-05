import { useEffect } from "react";
import { Link, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import {
  Content,
  useStore,
  countMessages,
  getGroupNameHistory,
  getForwardedMessages,
  getMembersWithMessages,
  shouldNavigateToHomePage,
} from "../store";
import StatBoxes from "./Analytics/StatsBox";
import MembersList from "./Analytics/MembersList";
import GroupNameHistory from "./Analytics/GroupNameHistory";
import Messages from "./Analytics/Messages";

export default function Analytics() {
  const store = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (shouldNavigateToHomePage(store)) {
      navigate("/");
    }
  }, [store]);

  return store.match({
    None() {
      return <></>;
    },
    Some(value) {
      return value.match({
        Ok(store) {
          return <AnalyticsDisplay content={store} />;
        },
        Err() {
          return <></>;
        },
      });
    },
  });
}

function AnalyticsDisplay({ content }: { content: Content }) {
  const totalMessages = countMessages(content);
  const members = getMembersWithMessages(content);
  const forwardedMessages = getForwardedMessages(content);
  const groupNameHistory = getGroupNameHistory(content);

  return (
    <main className="container mx-auto p-2">
      <section className="my-8 mx-4">
        <div className="badge badge-secondary uppercase">
          {content.type.replace("_", " ")}
        </div>
        <h1 className="text-4xl font-bold">
          Analysis results for <b className="text-primary">{content.name}</b>{" "}
        </h1>
      </section>
      <section className="py-8">
        <Routes>
          <Route
            path=""
            element={
              <>
                <Link to="/analytics/messages/cats">Messages</Link>
                <StatBoxes
                  totalMembers={members.length}
                  totalMessages={totalMessages}
                  totalForwardedMessages={forwardedMessages.length}
                />
                <MembersList
                  title="Top 10 Chattiest Members"
                  members={members.slice(0, 10)}
                  totalMessages={totalMessages}
                />
                <GroupNameHistory history={groupNameHistory} />
              </>
            }
          />
          <Route
            path="members"
            element={
              <MembersList
                title="All Members"
                members={members}
                totalMessages={totalMessages}
              />
            }
          />
          <Route path="messages" element={<Outlet />}>
            <Route path=":userID" element={<Messages content={content} />} />
          </Route>
        </Routes>
      </section>
    </main>
  );
}

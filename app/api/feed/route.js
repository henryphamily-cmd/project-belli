import { getDbSnapshot, findUserById } from "@/lib/users";
import { getUserIdFromRequest, unauthorized } from "@/lib/api";

export async function GET(request) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return unauthorized();

  const [db, user] = await Promise.all([getDbSnapshot(), findUserById(userId)]);
  if (!user) return unauthorized();

  const userEvents = user.logs.map((log) => ({
    id: `u-${log.id}`,
    actor: `${user.profile.name} ${user.profile.handle}`,
    date: log.date,
    type: "log",
    restaurantId: log.restaurantId,
    rating: log.rating,
    note: log.note
  }));

  const friendEvents = db.friendEvents.map((event) => {
    const friend = db.friendProfiles.find((profile) => profile.id === event.friendId);
    return {
      ...event,
      actor: friend ? `${friend.name} ${friend.handle}` : "Friend"
    };
  });

  const feed = userEvents.concat(friendEvents).sort((a, b) => new Date(b.date) - new Date(a.date));
  return Response.json({ feed, friends: db.friendProfiles });
}

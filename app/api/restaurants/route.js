import { getDbSnapshot } from "@/lib/users";

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export async function GET() {
  const db = await getDbSnapshot();
  const ratingsByRestaurant = new Map();

  for (const user of db.users) {
    for (const log of user.logs) {
      const list = ratingsByRestaurant.get(log.restaurantId) || [];
      list.push(log.rating);
      ratingsByRestaurant.set(log.restaurantId, list);
    }
  }

  for (const event of db.friendEvents) {
    if (event.type !== "log") continue;
    const list = ratingsByRestaurant.get(event.restaurantId) || [];
    list.push(event.rating);
    ratingsByRestaurant.set(event.restaurantId, list);
  }

  const restaurants = db.restaurants.map((item) => {
    const ratings = ratingsByRestaurant.get(item.id) || [];
    return {
      ...item,
      community: {
        avg: Number(average(ratings).toFixed(2)),
        count: ratings.length
      }
    };
  });

  return Response.json({ restaurants });
}

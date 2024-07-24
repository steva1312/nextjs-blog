import { db } from "@/server/db";

export default async function Home(){

  const posts = await db.query.posts.findMany();

  return (
    <div>
      Stevin Blog

      <div>
        {posts.map(post => (
          <div key={post.id}>
            {post.name}
          </div>
        ))}
      </div>
    </div>
  );
}

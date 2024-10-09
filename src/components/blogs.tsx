import { BlogSelect, UserSelect } from "@/lib/schema-types";
import Blog from "./blog";

export default function Blogs({ blogs, user } : { blogs: BlogSelect[], user?: UserSelect }) {
  return (
    <div className="flex flex-col items-center gap-6">
      {blogs.map(blog => 
        <Blog blog={blog} user={user} key={blog.id} />
      )}
    </div>
  );
}
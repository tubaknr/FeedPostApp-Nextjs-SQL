import Posts from "@/components/posts";
import { Suspense } from "react";
import { getPosts } from "@/lib/posts";

async function LatestPosts() {
  const latestPosts = await getPosts(2);
  return <Posts posts={latestPosts} />
}

export default function Home() {
  
  return (
    <>
    <h1>Welocme back!</h1>
    <p>Here's what you've missed.</p>
    
    <section id="latest-posts">
    <Suspense fallback={<p>Loading recent posts...</p>}>
      <LatestPosts />
    </Suspense>
    </section>
    
    </>
  );
}

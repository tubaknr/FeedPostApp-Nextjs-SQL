import Posts from "@/components/posts";
import { getPosts } from "@/lib/posts";

// // STATIC METADATA:
// export const metadata = {
//   title: 'Latest Posts',  // google da çıkar. sitenin başlığı olarak.  hem de sekme simi olur.
//   description: 'Browse our latest posts!', // sitenin başlığı altındaki açıklama kısmıdır.
// }



// DYNAMIC METADATA
export async function generateMetadata() {
  const posts = await getPosts();
  const numberOfPosts = posts.length;
  return{
    title: `Browse all our ${numberOfPosts} posts.`,
    description: 'Browse all our posts.',
  }
}

export default async function FeedPage() {
    const posts = await getPosts();
    return(
        <>
        <h1>All posts by all users</h1>
        <Posts posts={posts} />
        </>
    )
}
import { formatDate } from "@/lib/format";
import LikeButton from "./like-icon";


function Post({post}){

    return(
        <>
        <article className="post">
            <div className="post-image">
                <img src={post.image} alt={post.title}/>
            </div>
            <div className="post-content">
            <div>
                <div>
                    <h2>{post.title}</h2>
                    <p>Shared by {post.userFirstName} on {' '}
                        <time date={post.createdAt}>
                            {formatDate(post.createdAt)}
                        </time>
                    </p>
                </div>

                <div>
                    <LikeButton />
                </div>
            </div>

            <p>{post.content}</p>
        
        </div>
    </article>
        
    </>
);
}


export default function Posts({posts}){
    if (!posts || posts.length === 0){
    return <p>There are no posts yet. Maybe start sharing some?</p>
    }

    return(
        <>
        <ul>
            {posts.map((post) => (
                <li key={post.id}>
                    <Post post={post}/>
                </li>
            )
            )}
        </ul>
        </>
    );
}
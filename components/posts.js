"use client";
import Image from "next/image";
import { formatDate } from "@/lib/format";
import LikeButton from "./like-icon";
import { togglePostLikeStatus } from "@/actions/posts";
import { use, useOptimistic } from "react";

// pre optimization
function imageLoader(config){
    console.log(config);
    const urlStart = config.src.split('upload/')[0];
    const urlEnd = config.src.split('upload/')[1];
    const transformations = `w_200,q_${config.quality}` // userın yüklediği resmin boyutunu küçült
    // now smaller image is requested from backend. 
    return `${urlStart}upload/${transformations}/${urlEnd}`; // resmin yeni url'i
}

function Post({post, action}){
    // console.log("POSTID:", post.id);
    // console.log("ISLIKED POST COMP :", (post.isLiked));

    return(
        <>
        <article className="post">
            <div className="post-image">
                <Image loader={imageLoader} src={post.image} fill alt={post.title} quality={50}/>
            </div>
            <div className="post-content">
            <header>
                <div>
                    <h2>{post.title}</h2>
                    <p>
                        Shared by {post.userFirstName} on {' '}
                        <time dateTime={post.createdAt}>
                            {formatDate(post.createdAt)}
                        </time>
                    </p>
                </div>

                <div>
                    <form 
                        action={togglePostLikeStatus.bind(null, post.id)} 
                        className={post.isLiked ? "liked" : ""}
                        >
                    <LikeButton />
                    </form>
                </div>
            </header>

            <p>{post.content}</p>
        
        </div>
    </article>
        
    </>
);
}


export default function Posts({ posts }){

    // State Management of the posts
    const [optimisticPosts, updateOptimisticPosts] =  //useOptimistic returns [optimisticPosts, updateOptimisticPosts]
        useOptimistic(posts, (prevPosts, updatedPostId) => { // this fcn takes 2 args
                const updatedPostIndex = prevPosts.findIndex(post => post.id === updatedPostId);
                console.log("INDEXXXXX: " ,updatedPostIndex);

                if (updatedPostIndex === -1){
                    return prevPosts;
                }
                
                // update in immutable way
                const updatedPost = { ...prevPosts[updatedPostIndex] };
                updatedPost.likes = updatedPost.likes + (updatedPost.isLiked ? -1 : 1);
                updatedPost.isLiked = !updatedPost.isLiked;
                const newPosts = [...prevPosts];
                newPosts[updatedPostIndex] = updatedPost;
                return newPosts; //optimisticPosts olarak dönecek
            })

    if (!optimisticPosts || optimisticPosts.length === 0){
        return <p>There are no posts yet. Maybe start sharing some?</p>
    }

    // action
    async function updatePost(postId) {
        console.log("UPDATEPOST POSTID: ", postId);
        try{
            console.log("UPDATEPOST POSTID TRY : ", postId);
            // update UI immediately
            updateOptimisticPosts(postId);
            
            // persist the like status to server
            await togglePostLikeStatus(postId);
        }catch(error){
            updateOptimisticPosts(postId);
            console.log("COMPONENTS/POSTS.JS UPDATEPOST ERROR : ", error);
        }

    }

    return(
        <>
        <ul>
            {optimisticPosts.map((post) => (
                <li key={post.id}>
                    <Post post={post} action={updatePost}/>
                </li>
            )
            )}
        </ul>
        </>
    );
}
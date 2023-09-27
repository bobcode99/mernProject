// import { useEffect, useState } from "react";
// import { getSamplePosts } from "../services/getLimitService";
// import { PostsTypes } from "../FilterableLimitTable";

// const PostListComponent = () => {
//     const [posts, setPosts] = useState<Array<PostsTypes>>([]);

//     useEffect(() => {
//         // Fetch and set the posts when the component mounts
//         getSamplePosts()
//             .then((data) => setPosts(data.posts))
//             .catch((error) => console.error(error));
//     }, []);

//     return (
//         <div>
//             <h1>All Posts</h1>
//             <div>
//                 {posts.map((post) => (
//                     <div key={post.id}>
//                         <h2>{post.title}</h2>
//                         <p>{post.body}</p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default PostListComponent;

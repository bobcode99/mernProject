// const getLimitService = async () => {
//     const response = await fetch("https://jsonplaceholder.typicode.com/posts1");
//     const jsonResponse = response.json;

// import { PostsTypes } from "../FilterableLimitTable";
// import axios, { AxiosError, AxiosResponse } from "axios";

// export const getSamplePosts = async (): Promise<PostsResponse> => {
//     const response = await fetch("https://jsonplaceholder.typicode.com/posts");

//     if (!response.ok) {
//         throw new Error("Failed to fetch data");
//     }

//     const jsonResponse: PostsResponse = await response.json();

//     console.log("jsonResponse: ", jsonResponse);
//     return jsonResponse;
// };

// export const getSamplePosts = async (): Promise<
//     AxiosResponse<PostsResponse>
// > => {
//     try {
//         const res = await axios.get<PostsResponse>(
//             `https://jsonplaceholder.typicode.com/posts`
//         );
//         console.log("res: ", res);

//         return Promise.resolve(res);
//     } catch (error) {
//         return Promise.reject(`GET /todos ERROR: ${error}`);
//     }
// };

// axios.interceptors.response.use(
//     (response) => response,
//     (error: AxiosError) => {
//         console.error("Axios Response Error:", error);
//         return Promise.reject(error);
//     }
// );

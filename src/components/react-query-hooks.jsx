import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { addPost, fetchPosts, tagData } from "../api/api";

const ReactQueryHooks = () => {
  const [page, setPage] = useState(1);

  const queryClient = useQueryClient(); // this gives access to react-query internal api
  // useQuery demonstration
  const {
    data: postData,
    isLoading,
    isError,
    error,
    status,
  } = useQuery({
    queryKey: ["posts", { page }],
    queryFn: () => fetchPosts(page),
    // cacheTime: 50000,
    staleTime: 1000*60*5,
    // gcTime: 0, // set the time after which a data will be stale
    // refetchInterval : 1000*5, // after the specified time, data will be refetched by calling the api.
  });

  // console.log(postData, "postData");

  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: tagData,
    staleTime: Infinity,
  });

  // console.log(tags);

  // useMutation demonstration
  // useMutation gives a bunch of functions
  const {
    mutate,
    isPending,
    isError: postIsError,
    error: postError,
    reset, // this is used to reset the error when ever any error occured
  } = useMutation({
    mutationFn: addPost,
    // onMutate runs before mutation takes place
    onMutate: () => {
      // what ever is passed from this function can be accessed as context in onSuccess function
      return { id: 1000 };
    },
    // onSuccess runs place after mutation is completed.
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
        // exact:true,
        // predicate is basically used for advance validation
        // predicate : (query) =>{
        //   query.queryKey[0] === "posts" && query.queryKey[1].page >= 2
        // }
      });
    },
    // onError function runs when there is any error occured
    // onError : (error, variables, context) =>{},
    // onsettled function runs on both either onSuccess or onError
    // onSettled : (data, error, variables, context) =>{}
  });

  // console.log(postError);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title");
    // here keys refers to the name of input fields of a form
    const tags = Array.from(formData.keys()).filter(
      (key) => formData.get(key) === "on"
    );
    if (!title || !tags) return;
    mutate({ id: postData?.data?.data?.length + 1, title, tags });
    e.target.reset();
  }

  return (
    <div className="container">
      <h1 className="title">My Posts</h1>

      {/* form */}
      <form onSubmit={handleSubmit} className="formContainer">
        <input
          type="text"
          name="title"
          placeholder="Enter Your post"
          className="postBox"
        />
        <div className="checkboxes">
          {tags?.map((tag) => (
            <div key={tag}>
              <input type="checkbox" name={tag} id={tag} />
              <label htmlFor={tag}>{tag}</label>
            </div>
          ))}
        </div>
        <button className="addBtn">Add</button>
      </form>

      {/* pages  */}
      <div className="pages">
        <button onClick={() => setPage((oldPage) => Math.max(oldPage - 1, 0))}
        disabled = {!postData?.prev}
        >
          Previous Page
        </button>
        <span>{page}</span>
        <button 
        disabled={!postData?.next}
        onClick={()=>setPage((oldPage)=>oldPage+1)}
        >Next Page</button>
      </div>

      {isLoading && isLoading && <p>Loading...</p>}
      {error && <p>{error?.message}</p>}
      {postIsError && (
        <div>
          <p style={{ cursor: "pointer" }}>Unable to post</p>{" "}
          <button onClick={() => reset()}>Click</button>
        </div>
      )}
      {postData?.data?.map((post) => {
        return (
          <div key={post.id} className="post">
            <div>{post.title}</div>
            {post?.tags?.map((tag) => (
              <span key={tag}> {tag}</span>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default ReactQueryHooks;

// import React, { useState } from "react";
// import { myTodo } from "../config";
// import { useMutation } from "@tanstack/react-query";
// const UseMutation = () => {
//   const [newTodo, setNewTodo] = useState("");

//   const addNewTodo = (getNewTodo) => {
//     return myTodo.push(getNewTodo)
//   };

//   const mutaion = useMutation(addNewTodo, {
//     onSuccess: () => {
//       console.log("New Todo Added");
//     },
//     onError: (error) => {
//       console.log("Error occured ", error);
//     },
//   });

//   function handleAddTodo() {
//     mutaion.mutate({title:newTodo})
//   }

//   //   console.log(myTodo);

//   return (
//     <div>
//       <label htmlFor="newTodo">Add Task</label>
//       <input
//         id="newTodo"
//         type="text"
//         value={newTodo}
//         onChange={(e) => setNewTodo(e.target.value)}
//       />
//       <button onClick={handleAddTodo} style={{ cursor: "pointer" }}>
//         Add
//       </button>
//     </div>
//   );
// };

// export default UseMutation;

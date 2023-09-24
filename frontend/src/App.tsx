import { useState, useEffect } from "react";
import { createServer } from "miragejs";

// Create a MirageJS server instance
const server = createServer({
  routes() {
    this.namespace = "api";

    this.get("/users", () => {
      return {
        users: [
          { id: 1, name: "Bob" },
          { id: 2, name: "Jiali" },
        ],
      };
    });
  },
});

export default function App() {
  let [users, setUsers] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((json) => {
        setUsers(json.users);
        console.log(json);
      });
  }, []);

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

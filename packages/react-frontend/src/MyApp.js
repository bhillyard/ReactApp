import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(id, index) {
    // Make Http Delete request to the backend
    fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.status === 204) {
          const updated = [...characters];
          updated.splice(index, 1);
          //characters.filter((character, i) => i !== index);
          setCharacters(updated);
        } else if (response.status === 404) {
          console.log("Resource not found");
        } else {
          console.log("Unexpected status code:", response.status);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function updateList(person) {
    postUser(person)
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else {
          console.log("Unexpected status code:", response.status);
          return null;
        }
      })
      .then((userWithId) => {
        if (userWithId) {
          setCharacters([...characters, userWithId]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => { console.log(error); });
  }, [] );

  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList}/>
    </div>
  );
}

export default MyApp;

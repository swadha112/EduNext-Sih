import React from 'react';
import './Users.css';


const userData = [
  { title: "Class 10", image: "path-to-image1" },
  { title: "Class 11-12", image: "path-to-image2" },
  { title: "College Students", image: "path-to-image3" },
  { title: "Study Abroad", image: "path-to-image4" },
  { title: "Professionals", image: "path-to-image5" },
  { title: "Counsellors", image: "edunext/src/assets/cons.jpg" }
];

const Users = () => {
  return (
    <div className="user-container">
      {userData.map((user, index) => (
        <div key={index} className="user">
          <img src={user.image} alt={user.title} className="user-image" />
          <div className="user-title">{user.title}</div>
        </div>
      ))}
    </div>
  );
}

export default Users;

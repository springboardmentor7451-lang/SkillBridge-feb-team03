import { useEffect, useState } from "react";
import "./Profile.css";

export default function Profile(){

const [user] = useState(() => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
});

useEffect(()=>{

},[]);

if(!user){
return(
<div className="profile-page">
<h2>No user data found</h2>
</div>
);
}

return(

<div className="profile-page">

<h1 className="profile-title">
My Profile
</h1>

<div className="profile-card">

<h2>{user.name}</h2>

<p>
<strong>Email:</strong> {user.email}
</p>

<p>
<strong>Role:</strong> {user.role}
</p>

</div>

</div>

);

}
import { useState } from "react";
import AuthLayout from "../Components/Authlayout";

export default function NGOProfileForm(){

const [name,setName] = useState("");
const [location,setLocation] = useState("");
const [website,setWebsite] = useState("");
const [mission,setMission] = useState("");
const [focus,setFocus] = useState("");

const handleSubmit=(e)=>{
e.preventDefault();

const profile={
name,
location,
website,
mission,
focus
};

localStorage.setItem("ngoProfile",JSON.stringify(profile));

alert("NGO Profile Saved");
};

return(

<AuthLayout>

<form className="auth-form" onSubmit={handleSubmit}>

<h2>NGO Profile</h2>

<label>Organization Name</label>
<input
type="text"
placeholder="Enter organization name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<label>Location</label>
<input
type="text"
placeholder="City, Country"
value={location}
onChange={(e)=>setLocation(e.target.value)}
/>

<label>Website</label>
<input
type="text"
placeholder="https://example.org"
value={website}
onChange={(e)=>setWebsite(e.target.value)}
/>

<label>Mission</label>
<textarea
placeholder="Describe your mission"
value={mission}
onChange={(e)=>setMission(e.target.value)}
/>

<label>Focus Areas</label>
<input
type="text"
placeholder="Education, Health, Environment"
value={focus}
onChange={(e)=>setFocus(e.target.value)}
/>

<button className="auth-btn">
Save Profile
</button>

</form>

</AuthLayout>

);

}
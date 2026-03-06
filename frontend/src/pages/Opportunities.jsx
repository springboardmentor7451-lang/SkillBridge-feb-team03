import { useState } from "react";
import "./Opportunities.css";

export default function Opportunities() {

const [opportunities] = useState([
{
id:1,
title:"React Developer Volunteer",
location:"Remote",
duration:"2 Months",
skills:["React","JavaScript","Frontend"],
description:"Help our NGO build a modern website using React."
},
{
id:2,
title:"English Teaching Volunteer",
location:"Mumbai",
duration:"3 Months",
skills:["Teaching","English","Communication"],
description:"Teach English to underprivileged children."
},
{
id:3,
title:"Graphic Designer",
location:"Remote",
duration:"1 Month",
skills:["Photoshop","Design","Creativity"],
description:"Create posters and social media graphics."
},
{
id:4,
title:"Community Health Volunteer",
location:"Hyderabad",
duration:"2 Weeks",
skills:["Healthcare","First Aid","Support"],
description:"Assist doctors in organizing community health camps."
},
{
id:5,
title:"Data Analyst Volunteer",
location:"Remote",
duration:"2 Months",
skills:["Excel","Python","Data Analysis"],
description:"Analyze NGO impact data and prepare reports."
},
{
id:6,
title:"Social Media Manager",
location:"Remote",
duration:"3 Months",
skills:["Marketing","Instagram","Content"],
description:"Manage NGO social media and increase awareness."
},
{
id:7,
title:"Event Coordinator",
location:"Bangalore",
duration:"1 Month",
skills:["Management","Planning","Communication"],
description:"Help organize charity fundraising events."
},
{
id:8,
title:"UI/UX Designer",
location:"Remote",
duration:"2 Months",
skills:["Figma","UX","Design"],
description:"Design better user interfaces for NGO platforms."
}
]);

const [applied,setApplied] = useState([]);

const handleApply = (id,title)=>{

if(applied.includes(id)){
alert("You already applied for this opportunity");
return;
}

setApplied([...applied,id]);

alert("Application submitted for: " + title);

};

return(

<div className="opp-page">

<h1 className="opp-title">
Volunteer Opportunities
</h1>

<div className="opp-grid">

{opportunities.map((opp)=>(
<div className="opp-card" key={opp.id}>

<h3>{opp.title}</h3>

<p className="opp-meta">
{opp.location} • {opp.duration}
</p>

<div className="skills">

{opp.skills.map((skill,index)=>(
<span key={index} className="skill-tag">
{skill}
</span>
))}

</div>

<p className="opp-desc">
{opp.description}
</p>

<button
className="apply-btn"
onClick={()=>handleApply(opp.id,opp.title)}
>

{applied.includes(opp.id) ? "Applied" : "Apply"}

</button>

</div>
))}

</div>

</div>

)

}
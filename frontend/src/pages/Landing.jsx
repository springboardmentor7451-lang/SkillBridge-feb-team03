import "./Landing.css";

export default function Landing(){
return(

<div className="landing-container">

<section className="hero">

<h1>
Connect Skills with <span>Real Impact</span>
</h1>

<p>
SkillBridge helps passionate volunteers collaborate with NGOs to create meaningful social change.
</p>

<div className="hero-buttons">
<a href="/volunteer-signup" className="btn-primary">Become a Volunteer</a>
<a href="/ngo-signup" className="btn-secondary">Register Your NGO</a>
</div>

</section>

<section className="features">

<div className="feature-card">
<h3>Volunteer Opportunities</h3>
<p>Find impactful opportunities to use your skills.</p>
</div>

<div className="feature-card">
<h3>NGO Collaboration</h3>
<p>NGOs can connect with talented volunteers easily.</p>
</div>

<div className="feature-card">
<h3>Skill Development</h3>
<p>Gain real experience while helping communities.</p>
</div>

</section>

</div>

);
}
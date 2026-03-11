const input = document.getElementById("input");
const messages = document.getElementById("messages");

/* INITIAL WELCOME MESSAGE */

window.onload = function(){

addMessage("bot",`👋 Welcome to the Smart Home Automation Assistant!

I can help you with:

• ZEA CRM platform  
• Smart home automation workflows  
• Sales funnels & follow-ups  
• CRM integrations  
• Pricing plans  

If you'd like to explore how our Smart Home Automation platform can work for your business, choose an option below.`);

addQuickButtons();

};

/* SEND MESSAGE */

async function sendMessage(){

const message = input.value.trim();

if(!message) return;

addMessage("user", message);

input.value = "";

/* DEMO REQUEST */

if(message.toLowerCase().includes("demo")){

addMessage("bot",
"Great! I can arrange a live demo for you.\n\nPlease share your details below."
);

showLeadForm();
return;
}

/* TYPING ANIMATION */

const typingRow = document.createElement("div");
typingRow.className = "message-row bot";

const avatar = document.createElement("div");
avatar.className = "avatar";
avatar.innerText = "🤖";

const typingBubble = document.createElement("div");
typingBubble.className = "typing-bubble";

typingBubble.innerHTML = `
<div class="typing-dot"></div>
<div class="typing-dot"></div>
<div class="typing-dot"></div>
`;

typingRow.appendChild(avatar);
typingRow.appendChild(typingBubble);

messages.appendChild(typingRow);

scrollBottom();

try{

const response = await fetch("http://localhost:3000/chat",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({message})
});

const data = await response.json();

messages.removeChild(typingRow);

addMessage("bot", data.reply);

addSuggestions();

}catch{

messages.removeChild(typingRow);

addMessage("bot","⚠️ Server connection error");

}

}

/* ADD MESSAGE */

function addMessage(type,text){

const row = document.createElement("div");
row.className = `message-row ${type}`;

const avatar = document.createElement("div");
avatar.className = "avatar";

const bubble = document.createElement("div");
bubble.className = `message ${type==="user"?"user-bubble":"bot-bubble"}`;

bubble.innerText = text;

if(type==="user"){

avatar.innerText="🧑";
row.appendChild(bubble);
row.appendChild(avatar);

}else{

avatar.innerText="🤖";
row.appendChild(avatar);
row.appendChild(bubble);

}

messages.appendChild(row);

scrollBottom();

}

/* QUICK BUTTONS BELOW WELCOME */

function addQuickButtons(){

const container = document.createElement("div");
container.className="quick-buttons";

const options=[
"ZEA CRM Overview",
"Smart home automation workflow",
"Pricing plans",
"Book a demo"
];

options.forEach(text=>{

const btn=document.createElement("button");
btn.className="quick-btn";
btn.innerText=text;

btn.onclick=()=>{

container.remove();

input.value=text;
sendMessage();

};

container.appendChild(btn);

});

messages.appendChild(container);

scrollBottom();

}

/* SUGGESTIONS AFTER BOT RESPONSE */

function addSuggestions(){

const container=document.createElement("div");
container.className="quick-buttons";

const options=[
"Features of ZEA CRM",
"Pricing plans",
"CRM integrations"
];

options.forEach(text=>{

const btn=document.createElement("button");
btn.className="quick-btn";
btn.innerText=text;

btn.onclick=()=>{

input.value=text;
sendMessage();

};

container.appendChild(btn);

});

messages.appendChild(container);

scrollBottom();

}

/* LEAD FORM */

function showLeadForm(){

const form=document.createElement("div");
form.className="lead-form";

form.innerHTML=`

<h4>Request Demo</h4>
<input placeholder="Name" id="lead-name">
<input placeholder="Email" id="lead-email">
<input placeholder="Phone" id="lead-phone">
<button onclick="submitLead()">Submit</button>
`;

messages.appendChild(form);

scrollBottom();

}

function submitLead(){

addMessage("bot",
"✅ Thank you!\n\nOur Smart Home Automation specialist will contact you shortly to schedule your demo."
);

}

/* SCROLL */

function scrollBottom(){
messages.scrollTop = messages.scrollHeight;
}

input.addEventListener("keypress",e=>{
if(e.key==="Enter") sendMessage();
});

/* VOICE DICTATION */

function startDictation(){

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if(!SpeechRecognition){
alert("Voice recognition not supported in this browser");
return;
}

const recognition = new SpeechRecognition();

recognition.lang = "en-IN";
recognition.interimResults = true;
recognition.maxAlternatives = 5;

let finalTranscript="";

recognition.start();

document.getElementById("voice-btn").style.background="#ff3b3b";

recognition.onresult=function(event){

let interimTranscript="";

for(let i=event.resultIndex;i<event.results.length;i++){

let transcript=event.results[i][0].transcript;

if(event.results[i].isFinal){
finalTranscript+=transcript;
}else{
interimTranscript+=transcript;
}

}

input.value=finalTranscript+interimTranscript;

};

recognition.onend=function(){

document.getElementById("voice-btn").style.background="#0b6cff";

if(finalTranscript.trim()!==""){

input.value=finalTranscript.trim();
sendMessage();

}

};

recognition.onerror=function(){
document.getElementById("voice-btn").style.background="#0b6cff";
};

}
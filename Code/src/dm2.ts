// THE PROJECT: the_time_traveler

import { assign, createActor, setup } from "xstate";
import { Settings, speechstate } from "speechstate";
import { createBrowserInspector } from "@statelyai/inspect";
import { KEY } from "./azure";
import { NLU_KEY } from "./azure";
import { DMContext, DMEvents } from "./types";

const inspector = createBrowserInspector();

const azureCredentials = {
  endpoint:
    // "https://northeurope.api.cognitive.microsoft.com/sts/v1.0/issuetoken", OLD STUDENT ACCOUNT
    // "https://northeurope.api.cognitive.microsoft.com/",
    "https://northeurope.api.cognitive.microsoft.com/sts/v1.0/issuetoken",
  key: KEY,
};

const azureLanguageCredentials = {
  
  // lab4
  // endpoint: "https://timetraveler.cognitiveservices.azure.com/language/:analyze-conversations?api-version=2024-11-15-preview", /* your Azure CLU prediction URL */
  endpoint: "https://dreamons.cognitiveservices.azure.com/language/:analyze-conversations?api-version=2024-11-15-preview", /* your Azure CLU prediction URL */
  key: NLU_KEY, /** reference to your Azure CLU key - you will find it in azure.ts */
  deploymentName: "dreamons_deployment", /** your Azure CLU deployment */
  projectName: "dreamons", /** your Azure CLU project name */
};

const settings: Settings = {

  // lab4
  azureLanguageCredentials: azureLanguageCredentials /** global activation of NLU */,

  azureCredentials: azureCredentials,
  azureRegion: "northeurope",
  asrDefaultCompleteTimeout: 0,
  asrDefaultNoInputTimeout: 5000,
  locale: "en-US",

  // lab2
  ttsDefaultVoice: "en-US-AvaMultilingualNeural", // previously was "en-US-DavisNeural"
  //en-US-AvaMultilingualNeural copied from SSML https://speech.microsoft.com/portal/8032a881d1714f93a1097e4d35d8b4a6/audiocontentcreation/folder/602a3e1e-7257-4721-8111-009550c308f6/file/aff29c34-c355-429d-9b7e-3b8bb07db2af
  
  // lab3
  // speechRecognitionEndpointId: "c9cf0d8b-777e-479e-afdd-9d399383fe53", // dreamons | lab3
  //speechRecognitionEndpointId: "70c24a75-8171-461b-98d1-bb26b9fc8fff", // dreamons_time_traveler | project OLD STUDENT ACCOUNT
  
  // deatctivated
  // speechRecognitionEndpointId: "4db5d244-539f-4b7b-a049-c4057de3c804", // dreamons_time_traveler | project
  
};

interface GrammarEntry {

  person?: string;
  time?: string;
  space?: string;
  answer?: string;
  reply?: string;
  archetype?: string;
  message?: string; 
  interpretation?: string;

//   name?: string; //optional
//  telephone?: string; //optional


}


let voices = [];

function loadVoices() {
  voices = speechSynthesis.getVoices();
}

// Listen for voices to be loaded
speechSynthesis.onvoiceschanged = loadVoices;

// Load voices initially
loadVoices();




const grammar: { [index: string]: GrammarEntry } = {

  // Person | The 12 Jungian Archetypes

  // 1. The Ego Types (Focus: Order & Structure)
  "the photographer": { person: "Zack Grand Hotel. Say cheeese!"},
  "photographer": { person: "Zack Grand Hotel. Say cheeese!"},
  "zack grand hotel": { person: "Zack Grand Hotel. I want to liveee!!!"},
  "zack": { person: "Zack Grand Hotel. Have you ever heard about the ASL goodbye?"},
  "fede": { person: "Zack Grand Hotel. Have you ever heard about the ASL goodbye?"},
  "federico": { person: "Zack Grand Hotel. Have you ever heard about the ASL goodbye?"},

  "the hierophant": { person: "The Hierophant. We have the atomic bomb. Now, we could create. Or we could destroy."},
  "hierophant": { person: "The Hierophant. We have the atomic bomb. Now, we could create. Or we could destroy."},
  "the elephant": { person: "The Hierophant. We have the atomic bomb. Now, we could create. Or we could destroy."},
  "i am the elephant": { person: "The Hierophant. We have the atomic bomb. Now, we could create. Or we could destroy."},
  "the pope": { person: "The Hierophant. Look around you Billy. There is nothing. The empire of nothing."},
  "matte": { person: "The Hierophant. One chance. I know that I have only one opportunity. To get back in the game."},
  "look here, there is nothing. the empire of nothing": { person: "The Hierophant" },
  "the young pope": { person: "The Hierophant. I should remind you that your choices are bets. Just as they are for everyone else." },
  "pope": { person: "The pope. Me? am i asked to be the hierophant?" },
  "bisce": { person: "The Pope. It was a long time ago, my friend" },
  "matteo": { person: "The Pope. I have only one opportunity to get back in the game" },

  "the emperor": { person: "Billy. Take a seat and make yourself comfortable. Because. Now. I will show you my empire. "},

  "billy": { person: "Billy. Endings are never easy. Nobody prepares you for them."},
  "marco": { person: "Billy. I promise. I will not forget. And I will find you."},
  "have you ever heard about the italian dance?": { person: "Billy" },
  "i will not forget": { person: "Billy" },
  "i want to be billy": { person: "Billy. Menzi Idol?! ah ah ah." }, 
  "emperor": { person: "Billy. i am the villain of the story" },

  "the idol": { person: "Menzi Idol. To save yourself, you must die."},
  "menzi": { person: "Menzi Idol. And then? And then nothing happened. It's just over like that!"},
  "menzi idol": { person: "Menzi Idol. I mean. It leaves you with that feeling of incompleteness. If you know what I mean. And you ask yourself. And what. If it happened?"},
  "idol": { person: "Menzi Idol. So for the return, you go back to savona too like your brother zack grand hotel, isn't it?" },
  "andrea": { person: "Menzi Idol. What if it happened?" },
  "manzino": { person: "Menzi Idol. You know, billy, i think i should change my life." },
  "the menzi idol": { person: "Menzi Idol. To save yourself, you must die." }, //fixed adding a comma
  "manzi": { person: "Menzi Idol. But so, you are a bastard." }, // it doesn't work because it is censored *******


  // 2. The Soul Types (Focus: Freedom & Identity)
  "the voyager": { person: "The voyager. I got all I need right now. A surfboard. A tacos. And a friend."},
  "voyager": { person: "The voyager. I got all I need right now. A surfboard. A tacos. And a friend."},
  "explorer": { person: "The voyager. I will do my best. I promise." },
  "julien": { person: "The voyager. I have everything i have always needed right now: a surfboard, a tacos. And a friend." },
  "giulio": { person: "The voyager. How are you, johnny?" },

  "the devil": { person: "The Devil"},
  "devil": { person: "The Devil"},

  "the master": { person: "Master"},
  "master": { person: "Master"},

  "the artist": { person: "The New Da Vinci"},
  "artist": { person: "The New Da Vinci"},

  // 3. The Self Types (Focus: Mastery & Power)
  "the french": { person: "The French"},
  "french": { person: "The French"},

  "the empress": { person: "The Empress"},
  "empress": { person: "The Empress"},

  "the kid": { person: "Kodi Grand Hotel. Billy, I want to change the world."},
  "kodi grand hotel": { person: "Kodi Grand Hotel"},
  "kodi": { person: "Kodi Grand Hotel"},
  "the illusionist": { person: "Kodi Grand Hotel"},
  "ale": { person: "Kodi Grand Hotel. Billy, i want to change the world" },
  "alessandro": { person: "Kodi Grand Hotel. So for the dessert we have tiramisu" },
  "kid": { person: "Kodi Grand Hotel. Sometimes it is just a matter of time" },
  "magician": { person: "Kodi Grand Hotel. No, i am sorry menzi. i go to turin" },


  "the player": { person: "The Gamer"},
  "player": { person: "The Gamer"},
  "the gamer": { person: "The Gamer"},
  "gamer": { person: "The Gamer"},

  // miscellaneous notes
  // "hello world": { person: "hello world"}, // Pay attention! You have to write everything in lowercase otherwise the function will not work properly
  // "dreamons": { person: "dreamons" }, // it is an invented word. it finds out something different


  // Time
  "past": { time: "past" },  // Caregiver, Innocent, Everyman, Ruler | Reflecting on the past, nostalgia, and tradition
  "i want to go back": { time: "past" }, // Caregiver, Innocent, Everyman, Ruler | Reflecting on the past, nostalgia, and tradition
  "i want to go to yesterday": { time: "past" }, // Jester, Lover, Hero, Rebel | Living in the moment, fun-loving, spontaneous
  "gotopast": { time: "past" }, 

  "present": { time: "present" }, // Jester, Lover, Hero, Rebel | Living in the moment, fun-loving, spontaneous
  "today": { time: "present" }, // Jester, Lover, Hero, Rebel | Living in the moment, fun-loving, spontaneous
  "gotopresent": { time: "present" }, 

  "future": { time: "future" }, // Sage, Visionary, Magician, Creator, Explorer | Looking ahead, planning, and reflecting on the future 
  "i want to go to the future": { time: "future" }, // Sage, Visionary, Magician, Creator, Explorer | Looking ahead, planning, and reflecting on the future 
  "i want to go to tomorrow": { time: "future" }, // Sage, Visionary, Magician, Creator, Explorer | Looking ahead, planning, and reflecting on the future 
  "gotofuture": { time: "future" }, 
  

  // Space

  "savona": { space: "Savona, the city of the Grand Hotel, the kindom of the pope." },
  "varazze": { space: "Varazze, the Vatican city, where equilibrium and dogmas reign." },
  "helsinki": { space: "Helsinki, the coldest city, where everything has started." },
  "morbegno": { space: "Morbegno, the small valley, where the tradition lives." },

  "morocco": { space: "Morocco, the country of sand, where you will truly live." },
  "santa monica": { space: "Santa Monica, the city of artists, where dreams and freedom are exactly the same thing." },
  "florence": { space: "Florence, the cradle of heart, wehere the empire used to be." },
  "gothenburg": { space: "Gothenburg, the city of Kanelbulle. If someting is everywhere, it's like it doesn't exist anymore." },

  "paris": { space: "Paris, the city of love." },
  "lake": { space: "The Lake of Como, the lake of the Empress." },
  "turin": { space: "Turin, the city of the environment, where if you go there instead of Savona so you are a bastard." },
  "atlantic city": { space: "Atlantic City, the city of perdition, where you can easily get lost." },


  "gotosavona": { space: "Savona, the city of the Grand Hotel, the kindom of the pope." },
  "gotovarazze": { space: "Varazze, the Vatican city, where equilibrium and dogmas reign." },
  "gotohelsinki": { space: "Helsinki, the coldest city, where everything has started." },
  "gotomorbegno": { space: "Morbegno, the small valley, where the tradition lives." },

  "gotomorocco": { space: "Morocco, the country of sand, where you will truly live." },
  "gotosantamonica": { space: "Santa Monica, the city of artists, where dreams and freedom are exactly the same thing." },
  "gotoflorence": { space: "Florence, the cradle of heart, where the empire used to be." },
  "gotogothenburg": { space: "Gothenburg, the city of Kanelbulle. If someting is everywhere, it's like it doesn't exist anymore." },

  "gotoparis": { space: "Paris, the city of love." },
  "gotolake": { space: "The Lake of Como, the lake of the Empress." },
  "gototurin": { space: "Turin, the city of the environment, where you go to change the world." },
  "gotoatlanticcity": { space: "Atlantic City, the city of perdition, where you can easily get lost." },





  // Answer | Jung questions

  "innocent": { answer: "Innocent" }, 
  "everyman": { answer: "Everyman" }, 
  "hero": { answer: "Hero" }, 
  "caregiver": { answer: "Caregiver" }, 

  //"explorer": { answer: "Explorer" }, 
  "rebel": { answer: "Rebel" }, 
  "lover": { answer: "Lover" }, 
  "creator": { answer: "Creator" }, 

  "jester": { answer: "Jester" }, 
  "sage": { answer: "Sage" }, 
  //"magician": { answer: "Magician" }, 
  "ruler": { answer: "Ruler" }, 


// Q1: What drives you the most in life?
"discovery": { answer: "Innocent" },
"adventure": { answer: "Explorer" },
"power": { answer: "Ruler" },
"leadership": { answer: "Ruler" },
"helping": { answer: "Caregiver" },
"nurturing": { answer: "Caregiver" },
"wisdom": { answer: "Sage" },
"knowledge": { answer: "Sage" },
"rebellion": { answer: "Rebel" },
"change": { answer: "Rebel" },
"belonging": { answer: "Everyman" },
"connection": { answer: "Everyman" },
"achievement": { answer: "Hero" },
"recognition": { answer: "Hero" },

// Q2: How do you handle stress?
"fight": { answer: "Hero" },
"think": { answer: "Sage" },
"run": { answer: "Explorer" },
"help": { answer: "Caregiver" },
"inspire": { answer: "Magician" },
"laugh": { answer: "Jester" },
"create": { answer: "Creator" },
"lead": { answer: "Ruler" },
"explore": { answer: "Explorer" },
"solve": { answer: "Sage" },
"comfort": { answer: "Caregiver" },
//"rebel": { answer: "Rebel" },

// Q3: What is your main goal in life?
"success": { answer: "Ruler" },
"learning": { answer: "Sage" },
//"helping": { answer: "Caregiver" },
"leading": { answer: "Ruler" },
"creating": { answer: "Creator" },
"exploring": { answer: "Explorer" },
"connecting": { answer: "Everyman" },
"peace": { answer: "Innocent" },
"love": { answer: "Lover" },
"freedom": { answer: "Explorer" },
//"adventure": { answer: "Explorer" },
//change": { answer: "Rebel" },

// Q4: What do you seek most?
//"power": { answer: "Ruler" },
"understanding": { answer: "Sage" },
//"connection": { answer: "Everyman" },
//"peace": { answer: "Innocent" },
//"wisdom": { answer: "Sage" },
//"freedom": { answer: "Explorer" },
//"love": { answer: "Lover" },
"excitement": { answer: "Jester" },
//"leadership": { answer: "Ruler" },
"loyalty": { answer: "Everyman" },
"fun": { answer: "Jester" },
"stability": { answer: "Ruler" },

// Q5: How do you prefer to spend your free time?
"reading": { answer: "Sage" },
"helping others": { answer: "Caregiver" },
"traveling": { answer: "Explorer" },
//"creating": { answer: "Creator" },
"relaxing": { answer: "Innocent" },
"playing sports": { answer: "Hero" },
//"leading": { answer: "Ruler" },
"thinking": { answer: "Sage" },
"teaching": { answer: "Sage" },
"laughing": { answer: "Jester" },
"bonding": { answer: "Everyman" },
"challenging the norm": { answer: "Rebel" },

// Q6: Which word best describes you?
"brave": { answer: "Hero" },
"wise": { answer: "Sage" },
"kind": { answer: "Caregiver" },
"creative": { answer: "Creator" },
"loyal": { answer: "Everyman" },
"ambitious": { answer: "Ruler" },
"peaceful": { answer: "Innocent" },
"adventurous": { answer: "Explorer" },
"rebellious": { answer: "Rebel" },
"intellectual": { answer: "Sage" },
"strong": { answer: "Hero" },
"loving": { answer: "Lover" },

// Q7: What is your greatest strength?
"courage": { answer: "Hero" },
//"wisdom": { answer: "Sage" },
"empathy": { answer: "Caregiver" },
"creativity": { answer: "Creator" },
//leadership": { answer: "Ruler" },
"passion": { answer: "Lover" },
//freedom": { answer: "Explorer" },
//"love": { answer: "Lover" },
"intelligence": { answer: "Sage" },
//"loyalty": { answer: "Everyman" },
"vision": { answer: "Magician" },
"humor": { answer: "Jester" },

// Q8: What do you value most?
"family": { answer: "Caregiver" },
//"success": { answer: "Ruler" },
"truth": { answer: "Sage" },
//"change": { answer: "Rebel" },
"security": { answer: "Ruler" },
//"creativity": { answer: "Creator" },
//"love": { answer: "Lover" },
//"adventure": { answer: "Explorer" },
"friendship": { answer: "Everyman" },
//"knowledge": { answer: "Sage" },
//"freedom": { answer: "Explorer" },
"equality": { answer: "Everyman" },

// Q9: What kind of leader are you?
"visionary": { answer: "Magician" },
"protector": { answer: "Caregiver" },
"builder": { answer: "Ruler" },
"motivator": { answer: "Hero" },
"teacher": { answer: "Sage" },
"innovator": { answer: "Explorer" },
"challenger": { answer: "Rebel" },
"pacifier": { answer: "Everyman" },
"strategist": { answer: "Ruler" },
"helper": { answer: "Caregiver" },
"organizer": { answer: "Ruler" },
"guide": { answer: "Sage" },

// Q10: When in doubt, you...
"ask for help": { answer: "Caregiver" },
"trust yourself": { answer: "Ruler" },
"take charge": { answer: "Hero" },
"think it through": { answer: "Sage" },
"take action": { answer: "Hero" },
"stay calm": { answer: "Innocent" },
"escape": { answer: "Explorer" },
"find new possibilities": { answer: "Rebel" },

// Q11: What is your greatest fear?
"losing control": { answer: "Ruler" },
"being wrong": { answer: "Sage" },
"being unimportant": { answer: "Everyman" },
"failure": { answer: "Hero" },
"boredom": { answer: "Explorer" },
"being misunderstood": { answer: "Lover" },
"rejection": { answer: "Caregiver" },
"being weak": { answer: "Hero" },
"stagnation": { answer: "Rebel" },
"being alone": { answer: "Everyman" },
//"change": { answer: "Innocent" },
"being ordinary": { answer: "Explorer" },

// Q12: If you had a superpower, what would it be?
"super strength": { answer: "Hero" },
"invisibility": { answer: "Explorer" },
"flying": { answer: "Explorer" },
"mind reading": { answer: "Sage" },
"shape-shifting": { answer: "Magician" },
"time travel": { answer: "Explorer" },
"teleportation": { answer: "Explorer" },
"healing": { answer: "Caregiver" },
"super speed": { answer: "Hero" },
"telekinesis": { answer: "Magician" },
"perfect memory": { answer: "Sage" },
"endless energy": { answer: "Hero" },

// Q1: Which object would you take with you for a trip around the world?
"map": { answer: "Explorer" },
"compass": { answer: "Explorer" },
"leadership book": { answer: "Ruler" },
"first-aid kit": { answer: "Caregiver" },
"camera": { answer: "Innocent" },
"journal": { answer: "Sage" },
"backpack": { answer: "Rebel" },
"satellite phone": { answer: "Hero" },
"travel guide": { answer: "Explorer" },
"notebook": { answer: "Sage" },
"passport": { answer: "Explorer" },
"meditation pillow": { answer: "Lover" },


// Q2: When faced with a challenge, what is your instinctive reaction?
"to fight": { answer: "Hero" },
"to seek guidance": { answer: "Sage" },
"to analyze": { answer: "Sage" },
"to escape": { answer: "Explorer" },
"to stand firm": { answer: "Hero" },
"to help others": { answer: "Caregiver" },
"to lead": { answer: "Ruler" },
"to explore": { answer: "Explorer" },
"to create": { answer: "Creator" },
"to be independent": { answer: "Rebel" },
"to comfort": { answer: "Caregiver" },
"to embrace it": { answer: "Lover" },

// Q3: How do you prefer to spend your time?
"exploring new places": { answer: "Explorer" },
"leading a team": { answer: "Ruler" },
"acquiring knowledge": { answer: "Sage" },
//"helping others": { answer: "Caregiver" },
"analyzing situations": { answer: "Sage" },
"creating new ideas": { answer: "Creator" },
//"challenging the norm": { answer: "Rebel" },
"working towards a greater good": { answer: "Hero" },
"seeking peace": { answer: "Innocent" },
"building relationships": { answer: "Everyman" },
"finding meaning": { answer: "Sage" },
"achieving success": { answer: "Ruler" },

// Q4: Which of these qualities resonates with you the most?
//"power": { answer: "Ruler" },
//"wisdom": { answer: "Sage" },
//"creativity": { answer: "Creator" },
//"leadership": { answer: "Ruler" },
//"loyalty": { answer: "Everyman" },
//"freedom": { answer: "Explorer" },
//"passion": { answer: "Lover" },
//"trust": { answer: "Caregiver" },
"independence": { answer: "Rebel" },
//"courage": { answer: "Hero" },
"compassion": { answer: "Caregiver" },
"ambition": { answer: "Hero" },

// Q5: If you could make a significant change in the world, what would it be?
"ending injustice": { answer: "Hero" },
"bringing peace": { answer: "Innocent" },
"discovering new horizons": { answer: "Explorer" },
"empowering others": { answer: "Caregiver" },
"creating lasting knowledge": { answer: "Sage" },
"breaking boundaries": { answer: "Rebel" },
"building connections": { answer: "Everyman" },
"finding truth": { answer: "Sage" },
"bringing innovation": { answer: "Magician" },
"promoting equality": { answer: "Everyman" },
"bringing joy": { answer: "Jester" },
"leading by example": { answer: "Ruler" },

// Q6: What motivates you when times get tough?
"the desire to help others": { answer: "Caregiver" },
"to lead a cause": { answer: "Ruler" },
"to prove yourself": { answer: "Hero" },
"to bring about change": { answer: "Rebel" },
"to gain wisdom": { answer: "Sage" },
"to discover new truths": { answer: "Explorer" },
"to explore the unknown": { answer: "Explorer" },
"to seek justice": { answer: "Hero" },
"to be true to yourself": { answer: "Rebel" },
"to make a lasting impact": { answer: "Hero" },
"to build something meaningful": { answer: "Creator" },
"to create happiness": { answer: "Jester" },

// Q7: What is your approach to relationships?
"I seek deep connections": { answer: "Lover" },
"I value loyalty": { answer: "Everyman" },
"I strive to help and support others": { answer: "Caregiver" },
"I like to lead": { answer: "Ruler" },
"I prefer independence": { answer: "Rebel" },
"I crave adventure": { answer: "Explorer" },
"I enjoy intellectual conversations": { answer: "Sage" },
"I seek freedom": { answer: "Explorer" },
"I prioritize honesty": { answer: "Sage" },
"I like to protect others": { answer: "Caregiver" },
"I seek love": { answer: "Lover" },
"I challenge the status quo": { answer: "Rebel" },

// Q8: How do you see the future?
"a place for progress and innovation": { answer: "Magician" },
"a place where everyone belongs": { answer: "Everyman" },
"a world where people live harmoniously": { answer: "Innocent" },
"a world where I can make a real difference": { answer: "Hero" },
"a society where I can lead": { answer: "Ruler" },
"a place for discovering new frontiers": { answer: "Explorer" },
"a world that rewards courage": { answer: "Hero" },
"a society that seeks wisdom": { answer: "Sage" },
"a place where I can express myself": { answer: "Lover" },
"a world full of opportunities": { answer: "Explorer" },
"a world that challenges the rules": { answer: "Rebel" },
"a place where people connect deeply": { answer: "Everyman" },

// Q9: When you're facing a problem, what do you focus on first?
"finding a solution": { answer: "Hero" },
"understanding the bigger picture": { answer: "Sage" },
"helping others involved": { answer: "Caregiver" },
"making a decision": { answer: "Ruler" },
"finding new ways to do things": { answer: "Rebel" },
"breaking the problem into smaller pieces": { answer: "Sage" },
"solving it quickly": { answer: "Hero" },
"following the rules": { answer: "Ruler" },
"thinking outside the box": { answer: "Explorer" },
"seeing the emotional side": { answer: "Lover" },
"considering the long-term impact": { answer: "Sage" },
"evaluating it based on facts and logic": { answer: "Sage" },

// Q10: What do you value most in your life?
//"success": { answer: "Ruler" },
"deep connections": { answer: "Everyman" },
//"wisdom": { answer: "Sage" },
//"knowledge": { answer: "Sage" },
//"change": { answer: "Rebel" },
//"security": { answer: "Ruler" },
//"freedom": { answer: "Explorer" },
//"love": { answer: "Lover" },
//"recognition": { answer: "Hero" },
"trust": { answer: "Caregiver" },
//"helping others": { answer: "Caregiver" },
//"leadership": { answer: "Ruler" },

// Q11: What is your ultimate goal?
"to explore new worlds": { answer: "Explorer" },
"to lead and inspire": { answer: "Ruler" },
"to make a meaningful impact": { answer: "Hero" },
"to break boundaries": { answer: "Rebel" },
"to create something lasting": { answer: "Creator" },
"to seek truth": { answer: "Sage" },
"to help others grow": { answer: "Caregiver" },
"to find balance": { answer: "Innocent" },
"to achieve greatness": { answer: "Hero" },
"to bring people together": { answer: "Everyman" },
"to leave a legacy": { answer: "Ruler" },
"to find inner peace": { answer: "Innocent" },

// Q12: When making a decision, what do you rely on most?
"your emotions": { answer: "Lover" },
"your intellect": { answer: "Sage" },
"your experience": { answer: "Explorer" },
"your intuition": { answer: "Magician" },
"your heart": { answer: "Lover" },
"your principles": { answer: "Rebel" },
"your logic": { answer: "Sage" },
"your values": { answer: "Caregiver" },
"your gut feeling": { answer: "Hero" },
"your vision": { answer: "Ruler" },
"your instincts": { answer: "Explorer" },
"your desires": { answer: "Lover" },


  
  // Reply
  "yes": { reply: "yes" }, 
  "of course": { reply: "yes" }, 
  "for sure": { reply: "yes" },
  "replyyes": { reply: "yes" }, 
  
  "no": { reply: "no" }, 
  "no way": { reply: "no" }, 
  "absolutely not": { reply: "no" },
  "goodbye": { reply: "no" },
  "bye": { reply: "no" },
  "replyno": { reply: "no" }, 

};



function isInGrammar(utterance: string) {
  return utterance.toLowerCase() in grammar;
}

function getPerson(utterance: string) {
  return (grammar[utterance.toLowerCase()] || {}).person; 
}

function getTime(utterance: string) {
  return (grammar[utterance.toLowerCase()] || {}).time;
}

function getSpace(utterance: string) {
  return (grammar[utterance.toLowerCase()] || {}).space;
}

function getAnswer(utterance: string) {
  return (grammar[utterance.toLowerCase()] || {}).answer;
}

function getReply(utterance: string) {
  return (grammar[utterance.toLowerCase()] || {}).reply;
}

let finalArchetype = 0; // Initialize at the start

// Coefficients for different states
const finalArchetypePersonCoeff = 0.5;
const finalArchetypeTimeCoeff = 0.8;
const finalArchetypeSpaceCoeff = 0.8;
const finalArchetypeAnswerCoeff = 1;

// Create an object to hold the final archetype scores for each person
const archetypeScores = {
    ZackArchetypeScore: 0,
    HierophantArchetypeScore: 0,
    BillyArchetypeScore: 0,
    MenziArchetypeScore: 0,
    VoyagerArchetypeScore: 0,
    DevilArchetypeScore: 0,
    MasterArchetypeScore: 0,
    ArtistArchetypeScore: 0,
    FrenchArchetypeScore: 0,
    EmpressArchetypeScore: 0,
    KidArchetypeScore: 0,
    PlayerArchetypeScore: 0
};

// Function to update archetype scores based on intent
function updateArchetypeScore(personIntentX, state) {
  let coeff = 0;

  // Determine the coefficient based on the current state
  switch (state) {
    case 'AskForWho':
      coeff = finalArchetypePersonCoeff;
      break;
    case 'AskForWhen':
      coeff = finalArchetypeTimeCoeff;
      break;
    case 'AskForWhere':
      coeff = finalArchetypeSpaceCoeff;
      break;
    case 'Questions':
      coeff = finalArchetypeAnswerCoeff;
      break;
    default:
      coeff = 1;
      break;
  }

  // Update the specific archetype score based on the personIntent
  if (personIntentX?.category) {
    const archetypeKey = `${personIntentX.category}ArchetypeScore`;
    if (archetypeScores.hasOwnProperty(archetypeKey)) {
      archetypeScores[archetypeKey] += personIntentX?.confidenceScore * coeff;
    }
  }
}

// Function to reset all archetype scores to 0
function resetArchetypeScores() {
  // Loop through the archetypeScores and reset each value to 0
  for (let key in archetypeScores) {
    if (archetypeScores.hasOwnProperty(key)) {
      archetypeScores[key] = 0;
    }
  }

  console.log("All archetype scores have been reset.");
  console.log("Reset Archetype Scores:", archetypeScores);
}

function getRandomQuestion() {
  const questions = [
    "What drives you the most in life? Discovery, adventure, power, leadership, helping others, wisdom, knowledge, rebellion, change, belonging, connection, achievement or recognition?",
    "When faced with a challenge, what is your instinctive reaction? To fight, to seek guidance, to analyze, to escape, to stand firm, to help others, to lead, to explore, to create, to be independent, to comfort, or to embrace it?",
    "How do you prefer to spend your time? Exploring new places, leading a team, acquiring knowledge, helping others, analyzing situations, creating new ideas, challenging the norm, working towards a greater good, seeking peace, building relationships, finding meaning, or achieving success?",
    "Which of these qualities resonates with you the most? Power, wisdom, creativity, leadership, loyalty, freedom, passion, trust, independence, courage, compassion, or ambition?",
    "If you could make a significant change in the world, what would it be? Ending injustice, bringing peace, discovering new horizons, empowering others, creating lasting knowledge, breaking boundaries, building connections, finding truth, bringing innovation, promoting equality, bringing joy, or leading by example?",
    "What motivates you when times get tough? The desire to help others, to lead a cause, to prove yourself, to bring about change, to gain wisdom, to discover new truths, to explore the unknown, to seek justice, to be true to yourself, to make a lasting impact, to build something meaningful, or to create happiness?",
    "What is your approach to relationships? I seek deep connections, I value loyalty, I strive to help and support others, I like to lead, I prefer independence, I crave adventure, I enjoy intellectual conversations, I seek freedom, I prioritize honesty, I like to protect others, I seek love, or I challenge the status quo?",
    "How do you see the future? A place for progress and innovation, a place where everyone belongs, a world where people live harmoniously, a world where I can make a real difference, a society where I can lead, a place for discovering new frontiers, a world that rewards courage, a society that seeks wisdom, a place where I can express myself, a world full of opportunities, a world that challenges the rules, or a place where people connect deeply?",
    "When you're facing a problem, what do you focus on first? Finding a solution, understanding the bigger picture, helping others involved, making a decision, finding new ways to do things, breaking the problem into smaller pieces, solving it quickly, following the rules, thinking outside the box, seeing the emotional side, considering the long-term impact, or evaluating it based on facts and logic?",
    "What do you value most in your life? Success, deep connections, wisdom, knowledge, change, security, freedom, love, recognition, trust, helping others, or leadership?",
    "What is your ultimate goal? To explore new worlds, to lead and inspire, to make a meaningful impact, to break boundaries, to create something lasting, to seek truth, to help others grow, to find balance, to achieve greatness, to bring people together, to leave a legacy, or to find inner peace?",
    "When making a decision, what do you rely on most? Your emotions, your intellect, your experiences, your values, your instincts, your desires, your leadership skills, your curiosity, your creative solutions, your ability to adapt, your compassion, or your sense of adventure?",
    "What makes you happiest? Adventure, helping others, success, knowledge, freedom, love, creativity, leading, exploring, peace, fun, or change?",
    "How do you handle stress? Fight, think, run, help, inspire, laugh, create, lead, explore, solve, comfort, or rebel?",
    "What is your main goal in life? Success, learning, helping, leading, creating, exploring, connecting, peace, love, freedom, adventure, or change?",
    "What do you seek most? Power, understanding, connection, peace, wisdom, freedom, love, excitement, leadership, loyalty, fun, or stability?",
    "How do you prefer to spend your free time? Reading, helping others, traveling, creating, relaxing, playing sports, leading, thinking, teaching, laughing, bonding, or challenging the norm?",
    "Which word best describes you? Brave, wise, kind, creative, loyal, ambitious, peaceful, adventurous, rebellious, intellectual, strong, or loving?",
    "What is your greatest strength? Courage, wisdom, empathy, creativity, leadership, passion, freedom, love, intelligence, loyalty, vision, or humor?",
    "What do you value most? Family, success, truth, change, security, creativity, love, adventure, friendship, knowledge, freedom, or equality?",
    "What kind of leader are you? Visionary, protector, builder, motivator, teacher, innovator, challenger, pacifier, strategist, helper, organizer, or guide?",
    "When in doubt, you... Ask for help, trust yourself, take charge, think it through, take action, stay calm, escape, or find new possibilities?",
    "What is your greatest fear? Losing control, being wrong, being unimportant, failure, boredom, being misunderstood, rejection, being weak, stagnation, being alone, change, or being ordinary?",
    "If you had a superpower, what would it be? Super strength, invisibility, flying, mind reading, shape-shifting, time travel, teleportation, healing, super speed, telekinesis, perfect memory, or endless energy?",
    "Which object would you take with you for a trip around the world? Map, compass, leadership book, first-aid kit, camera, journal, backpack, satellite phone, travel guide, notebook, passport, or meditation pillow?",
    "Do you believe in the empire? Yes, No, Maybe, Absolutely, It depends, I don't know, Only if it's just, Definitely not, I believe in individual freedom, I believe in order, I believe in chaos, or I believe in the greater good?",
    

  ];

  // Randomly select a question from the list
  return questions[Math.floor(Math.random() * questions.length)];
}


// Archetype descriptions mapped to the corresponding score keys
const archetypeDescriptions = {
  ZackArchetypeScore: "And now. Say. Cheese. Once, the world was simple. I still see it that way. It seems you love the past. The Innocent. You enjoy reading old classics, appreciating nature walks, and painting nostalgic scenes. You love simplicity, peace, and a calm life. Your strength is your optimism and an unwavering sense of right and wrong, but your weakness is your naivety—sometimes you struggle to face harsh realities. Your unique ability lies in inspiring others with your pure, unblemished view of the world. Motto: 'See the world with fresh eyes, where everything is possible.' You are very affine to The Hierophant. I think you are very similar to Zack Grand Hotel.",

  HierophantArchetypeScore: "Me? Am I asked to be the hierophant? I am the story of those who came before me. It seems you love the past. The Everyman. Your hobbies include spending time with loved ones, seeking wisdom from history, and teaching others. You love tradition, stability, and community. Your strength is your deep connection with humanity and relatability. However, your weakness can be your reluctance to take risks, as you prefer the comfort of the known. Your unique strength is your ability to provide guidance rooted in the wisdom of the past. Motto: 'We are all part of this journey; together, we are stronger.' You are very affine to The Innocent. I think you are very similar to The Hierophant.",

  BillyArchetypeScore: "After everything I did. And now. Where is everything? The empire of nothing. I act. I fight. I change the world—one battle at a time. It seems you love the present. The Hero. You enjoy training in martial arts, volunteering, and leading teams. You love action, justice, and proving yourself through hard work. Your strength is your courage and determination, but your weakness is that you often focus too much on action and neglect self-care or emotions. Your unique strength is your natural ability to lead in moments of crisis. Motto: 'Fight for what's right, no matter the cost.' You are very affine to The Ruler. I think you are very similar to Billy.",

  MenziArchetypeScore: "And what. If it happened. I remember. I protect. I heal. It seems you love the past. The Caregiver. Your hobbies include cooking for others, nurturing family bonds, and helping those in need. You love compassion, helping others heal, and family unity. Your strength is your empathy and reliability, but your weakness is that you tend to over-give and neglect your own needs. Your unique strength is your ability to heal both emotional and physical wounds. Motto: 'There is no greater love than to care for others.' You are very affine to The Hero. I think you are very similar to Menzi Idol.",

  VoyagerArchetypeScore: "I will explore. I promise. The future is out there, waiting for me to find it. It seems you love the future. The Explorer. You enjoy traveling, learning new languages, and experiencing new cultures. You love adventure, freedom, and discovering the unknown. Your strength is your curiosity and adaptability, but your weakness is that you can be restless and struggle with commitment. Your unique strength is your ability to thrive in new and challenging environments. Motto: 'The world is full of possibilities, and I will find them all.' You are very affine to The Magician. I think you are very similar to The Voyager.",

  DevilArchetypeScore: "Tear down the old, for the present demands change. It seems you love the present. The Rebel. Your hobbies include questioning authority, disrupting the status quo, and challenging norms. You love freedom, independence, and revolutionizing systems. Your strength is your strong will and determination to break free from conventions, but your weakness is that you can be reckless, alienating others in the process. Your unique strength is your ability to inspire change through disruptive thinking. Motto: 'Tear down the old and make room for the new.' You are very affine to The Ruler. I think you are very similar to The Devil.",

  MasterArchetypeScore: "Love fiercely, live deeply, and let the moment take you. It seems you love the present. The Lover. You enjoy romantic gestures, creating art, and meditative practices. You love deep connections, beauty, and passion in all forms. Your strength is your emotional intelligence and the depth of your love, but your weakness is becoming overly dependent on relationships and losing yourself. Your unique strength is your ability to connect with others emotionally, creating lasting bonds. Motto: 'Love is the answer to everything.' You are very affine to The Jester. I think you are very similar to The Master.",

  ArtistArchetypeScore: "I am the new da vinci. The future is a canvas, and I am the artist. It seems you love the future. The Creator. You enjoy painting, sculpting, writing, and innovating in every medium. You love self-expression, freedom, and creating something new and beautiful. Your strength is your creativity and vision, but your weakness is perfectionism—often getting lost in the process and neglecting the practical side. Your unique strength is your ability to turn the intangible into tangible works of art. Motto: 'Create what has never been before.' You are very affine to The Sage. I think you are very similar to The New Da Vinci.",

  FrenchArchetypeScore: "Laugh, dance, and defy! It seems you love the present. The Jester. You enjoy making others laugh, partying, and acting. You love fun, joy, and breaking societal expectations. Your strength is your humor and wit, and your ability to lighten any situation, but your weakness is that you can be taken too lightly and not always taken seriously when needed. Your unique strength is your ability to see life from a different angle and turn pain into humor. Motto: 'Laugh, and the world will laugh with you.' You are very affine to The Magician. I think you are very similar to The French.",

  EmpressArchetypeScore: "Truth is eternal. I seek it beyond time. It seems you love the future. The Sage. Your hobbies include reading philosophical texts, meditating, and guiding others through wisdom. You love knowledge, truth, and inner peace. Your strength is your deep understanding and spiritual insight, but your weakness is that you can become distant or overly focused on theory, neglecting emotional connections. Your unique strength is your ability to offer timeless wisdom and see the deeper truths of life. Motto: 'Seek truth, for truth is eternal.' You are very affine to The Lover. I think you are very similar to The Empress.",

  KidArchetypeScore: "I want to change the world. Step by step. One person at time. I bend reality. I shape what is to come. It seems you love the future. The Magician. Your hobbies include experimenting with new ideas, pushing boundaries, and learning magic tricks. You love transformation, innovation, and pushing the limits of what’s possible. Your strength is your visionary thinking, but your weakness is that you can be seen as manipulative or unreliable. Your unique strength is your ability to transform situations and people with your innovation. Motto: 'The impossible is only a challenge waiting to be conquered.' You are very affine to The Rebel. I think you are very similar to The Kid.",

  PlayerArchetypeScore: "Do you sell emotions? The past is my kingdom, and its lessons are my throne. It seems you love the past. The Ruler. You enjoy strategizing, organizing, and leading teams. You love power, control, and responsibility. Your strength is your leadership skills and decisiveness, but your weakness is being overbearing and too focused on control. Your unique strength is your natural authority and ability to guide others toward success. Motto: 'The world is mine to command.' You are very affine to The Hero. I think you are very similar to The Gamer."
};

// Mapping of internal archetype keys to final Jungian archetype names
const archetypeMapping = {
  ZackArchetypeScore: "the Innocent",
  HierophantArchetypeScore: "the Everyman",
  BillyArchetypeScore: "the Hero",
  MenziArchetypeScore: "the Caregiver",
  VoyagerArchetypeScore: "the Explorer",
  DevilArchetypeScore: "the Rebel",
  MasterArchetypeScore: "the Lover",
  ArtistArchetypeScore: "the Creator",
  FrenchArchetypeScore: "the Jester",
  EmpressArchetypeScore: "the Sage",
  KidArchetypeScore: "the Magician",
  PlayerArchetypeScore: "the Ruler"
};

// Function to find the highest-scoring archetype
function findHighestArchetype() {
  let highestArchetypeKey = null;
  let highestScore = -Infinity;

  // Loop through archetype scores
  for (const archetype in archetypeScores) {
      if (archetypeScores[archetype] > highestScore) {
          highestScore = archetypeScores[archetype];
          highestArchetypeKey = archetype;
      }
  }

  // Map to final archetype name
  const highestArchetype = archetypeMapping[highestArchetypeKey] || "Unknown Archetype";

  // Get the description
  const highestDescription = archetypeDescriptions[highestArchetypeKey] || "No matching archetype found.";

  // Return both formatted archetype name and description
  return { highestArchetype, highestDescription };
}



// function getVoiceForPerson(person: string): string {
//   console.log(`📝 Getting voice for person: ${person}`);

//   switch (person.toLowerCase()) {
//     case "menzi":
      
//       return "en-US-DavisNeural"; //en-GB-RyanNeural //Fred //Flo
//     case "narrator":
//       return "en-US-AvaMultilingualNeural";
//     default:
//       return "en-US-AvaMultilingualNeural"; // Default voice
//   }
// }


const dmMachine = setup({

  types: {
    /** you might need to extend these */
    context: {} as DMContext,
    events: {} as DMEvents,
  },

  actions: {
 
    "spst.speak": ({ context }, params: { utterance: string }) => {
      // Log the utterance being spoken
      console.log(`🗣️ Speaking: "${params.utterance}"`);

      // Send the SPEAK message to spstRef
      context.spstRef.send({
        type: "SPEAK",
        value: {
          utterance: params.utterance,
        },
      });
    },
    
    "spst.speak.fr": ({ context }, params: { utterance: string }) => {
      // Log the utterance being spoken
      console.log(`🗣️ Speaking: "${params.utterance}"`);

      // Send the SPEAK message to spstRef
      context.spstRef.send({
        type: "SPEAK",
        value: {
          utterance: params.utterance,
          voice: "fr-FR-HenriNeural"
        },
      });
    },

    "spst.listen": ({ context }) => {
      console.log("👂 Listening...");
      context.spstRef.send({
        type: "LISTEN",
        value: { nlu: true }, /** Local activation of NLU */ /*lab4*/
      });
    },

  },

}).createMachine({
  context: ({ spawn }) => ({
    spstRef: spawn(speechstate, { input: settings }),

    person: null,
    time: null,
    space: null,
    answer: null,
    archetype: null,
    reply: null,
    message: null, 
    interpretation: null,

    // name: null, //optional
    // telephone: null, //optional

  }),
  id: "DM",
  initial: "Prepare",
  states: {

       Prepare: {
         entry: ({ context }) => context.spstRef.send({ type: "PREPARE" }),
         on: { ASRTTS_READY: "WaitToStart" },
       },

       WaitToStart: {
         on: { CLICK: "Greeting" },
       },


       /* GREETING */
        Greeting: {
          entry: [
            () => console.log("🟢 Entered Greeting state"),
            { 
              type: "spst.speak", 
              params: { 
                utterance: `
                  
                      <prosody rate="-40%" volume="+20%" pitch="-8%">
                        It's been a long time. <break time="500ms" /> How are you? 
                        <break time="700ms" />
                        Welcome to Dreamons... <break time="600ms" />
                        You will walk through the time.
                      </prosody>
                                
                  `,
              } 
            }
          ],
          on: { SPEAK_COMPLETE: "AskForWho" },
        },


        /* PERSON */
        AskForWho: {
          entry: [
            () => console.log("🟢 Asking for character..."),
            { type: "spst.speak", params: { utterance: `Who. Are. You.` } }
          ],
          on: { SPEAK_COMPLETE: "AskForWhoListen" },
        },
        
        AskForWhoListen: {
          initial: "Ask",
          entry: [
            () => console.log("👂 Listening for character..."),
            { type: "spst.listen" },
            // Reset all person archetypes to 0 when entering this state
            assign(({ context }) => {
              const resetArchetypes = {
                ZackArchetypeScore: 0,
                HierophantArchetypeScore: 0,
                BillyArchetypeScore: 0,
                MenziArchetypeScore: 0,
                VoyagerArchetypeScore: 0,
                DevilArchetypeScore: 0,
                MasterArchetypeScore: 0,
                ArtistArchetypeScore: 0,
                FrenchArchetypeScore: 0,
                EmpressArchetypeScore: 0,
                KidArchetypeScore: 0,
                PlayerArchetypeScore: 0,
              };
              return {
                ...context,
                ...resetArchetypes, // Reset archetypes
                noInputCount: 0,    // Reset no-input counter
              };
            })
          ],

          on: {
            LISTEN_COMPLETE: [
              {
                target: "CheckGrammarPerson",
                guard: ({ context }) => !!context.person,
              },
              { target: ".NoInput" },
 
              {
                target: "Greeting",
                guard: ({ context }) => {
                  const helpIntent = context.interpretation?.intents?.find(
                    intent => intent.category === "Help"
                  );
                  const isHelpIntent = helpIntent && helpIntent.confidenceScore > 0.80;
                  const isHelpUtterance = context.time?.[0]?.utterance?.toLowerCase() === "help";
              
                  return isHelpUtterance || isHelpIntent;
                },
              },
            ],
          },


          states: {

            Ask: {
              entry: [
                () => console.log("🔊 Listening for input..."),
                { type: "spst.listen" },
                ({ context }) => {
                  context.noInputCount = (context.noInputCount || 0); // Ensure it's at least 0
                }
              ],
              on: {
                RECOGNISED: {
                  actions: assign(({ event }) => {
                    console.log("🎤 ASR recognized:", event);  // Log ASR recognition
                    return {
                      person: event.value,
                      interpretation: event.nluValue
                    };
                  }),
                },

                ASR_NOINPUT: {
                  actions: assign({ person: null }), /* FIX_NO_INPUT*/
                },
                ASR_STOP: {
                  actions: () => console.log("⚠️ ASR STOP received - possibly prematurely."),
                },
              },
            },
            
            NoInput: {
              entry: [
                ({ context }) => {
                  if (context.noInputCount === undefined) {
                    context.noInputCount = 0; // Ensure it's initialized to 0
                  }
                  console.log(`⚠️ NoInput detected: Attempt ${context.noInputCount + 1}`);
                },
             
                {
                  type: "spst.speak",
                  params: ({ context }) => {
                    if (context.noInputCount === 0) {  // First no-input case
                      return { utterance: "Sorry, I didn't hear you. Please tell me." };
                    } else if (context.noInputCount === 1) {  // Second no-input case
                      return { utterance: "I still didn't get that. Can you please say if you are the photographer, the pope, the idol, the emperor, the voyager, the devil, the master, the artist, the french, the empress, the kid or the player?" };
                    } else {  // Third no-input case
                      return { utterance: "I couldn't understand. Let's stop here." };
                    }
                  }
                },
                assign(({ context }) => ({
                  noInputCount: context.noInputCount + 1  // Increase AFTER speaking
                }))
              ],
              on: {
                SPEAK_COMPLETE: [
                  { target: "Ask",
                    guard: ({ context }) => context.noInputCount < 3  // Only retry if attempts < 3  // VERY IMPORTANT CONDITION. OTHERWISE IT DOESN'T STOP AFTER ATTEMPT 3.
                  },  // Retry listening if not exceeded max attempts
                  
                  {
                    target: "#DM.Finish",  // Exit after 3 no-inputs
                    guard: ({ context }) => context.noInputCount >= 3  
                  },
                  
                ]
              }
            },


          },
        },

        Finish: {
          entry: [
            () => console.log("🔴 Ending conversation."),
            { type: "spst.speak", params: { utterance: "It was nice to see you again anyway. Goodbye!" } },
            assign({ noInputCount: 0 })  // Reset noInputCount to zero
          ],
          on: {
            CLICK: "Done",
          },
        },

        CheckGrammarPerson: {
          entry: [

            ({ context }) => {

              // Extract person entitity from recognized context if it exists
              const personEntity = context.interpretation?.entities.find(entity => entity.category === "person");
              console.log(`👤 Person: ${personEntity?.text || "undefined"}`);

              // // Extract top intent | lab4
              // Extract the intents array from context
              const intents = context.interpretation?.intents;
              // Find the top intent with the highest confidence score
              const topIntent = intents?.reduce((prev, current) => (prev.confidenceScore > current.confidenceScore ? prev : current), {});
              // Define the valid persons
              const validPersons = ["Zack", "Hierophant", "Billy", "Menzi", "Voyager", "Devil", "Master", "Artist", "French", "Empress", "Kid", "Player"];
              // Check if topIntent exists and has a confidence score above 0.80 and the category matches one of the valid persons
              const isTopIntent = topIntent && topIntent.confidenceScore > 0.80 && validPersons.includes(topIntent.category);
              // Log the details
              console.log(`🚀 topIntent: ${topIntent ? topIntent.category : "N/A"} with confidence score: ${isTopIntent ? topIntent.confidenceScore : "N/A"}`);


              // lab 5
              // Check if the personEntity is in the grammar
              const inGrammar = personEntity?.text && isInGrammar(personEntity.text);
              console.log(`✅ Is "${personEntity?.text}" in grammar? ${inGrammar ? "Yes" : "No"}`);

              
              // 👤 Check personIntent - Characters
              const checkPersonIntent = (category) => {
                const personIntent = context.interpretation?.intents?.find(intent => intent.category === category);
                return personIntent && personIntent.confidenceScore > 0.80;
              };
              const validPersons2 = ["Zack", "Hierophant", "Billy", "Menzi", "Voyager", "Devil", "Master", "Artist", "French", "Empress", "Kid", "Player"];
              validPersons2.forEach(person => {
                const isPerson = checkPersonIntent(person);
                console.log(`👤 Is this a ${person} selection? ${isPerson ? "Yes" : "No,"} with confidence score: ${context.interpretation?.intents?.find(intent => intent.category === person)?.confidenceScore || "N/A"}`);
              });

             
      
            
            },
        
        
            {
              type: "spst.speak.fr", // From now on there should be a new voice. ONLY IN THIS STATE.
              params: ({ context }) => {

                // 🔹 First, extract person entity before using it
                const personEntity = context.interpretation?.entities.find(entity => entity.category === "person");

                // Extract top intent
                const intents = context.interpretation?.intents;
                const topIntent = intents?.reduce((prev, current) => (prev.confidenceScore > current.confidenceScore ? prev : current), {});
                const validPersons = ["Zack", "Hierophant", "Billy", "Menzi", "Voyager", "Devil", "Master", "Artist", "French", "Empress", "Kid", "Player"];
                const isTopIntent = topIntent && topIntent.confidenceScore > 0.80 && validPersons.includes(topIntent.category);

                // 🔹 Now it's safe to check `inGrammar`
                const inGrammar = personEntity?.text && isInGrammar(personEntity.text);
                console.log(`✅ Is "${personEntity?.text}" in grammar? ${inGrammar ? "Yes" : "No"}`);

                // Extract person utterance safely
                const spokenPerson = context.person?.[0]?.utterance !== undefined 
                  ? context.person[0].utterance 
                  : (isTopIntent ? topIntent.category : "unknown");

                console.log(`🗣️ Determined spokenPerson: ${spokenPerson}`);

                // Store previous person entity
                context.previousPerson = personEntity ? personEntity.text : "Someone unknown. This is still the first time travelling.";

                const fullName = grammar[spokenPerson]?.person || spokenPerson;
                console.log(`👤 Full name: ${fullName}`);


                
                // 👤 Check personIntent - Characters
                const checkPersonIntent = (category) => {
                  const personIntent = context.interpretation?.intents?.find(intent => intent.category === category);
                  return personIntent && personIntent.confidenceScore > 0.80;
                };
                const validPersons2 = ["Zack", "Hierophant", "Billy", "Menzi", "Voyager", "Devil", "Master", "Artist", "French", "Empress", "Kid", "Player"];
                validPersons2.forEach(person => {
                  const isPerson = checkPersonIntent(person);
                  console.log(`👤 Is this a ${person} selection? ${isPerson ? "Yes" : "No,"} with confidence score: ${context.interpretation?.intents?.find(intent => intent.category === person)?.confidenceScore || "N/A"}`);
                });


              

                // For later. Ensure you store only the text
                context.previousPerson = personEntity ? personEntity.text : "Someone unknown. This is still the first time travelling.";

        
              
       
                // console.log(finalArchetype); // Should print 0.4 (0.8 * 0.5)

                // 😊 The user says exactly the word/person/character that is stored in the grammar if it is not it goes to the topIntent case before to go to the out-of-grammar case
                if (isInGrammar(spokenPerson)) {

                  // 🔮 Update the specific archetype score for the person selected (e.g., Zack, Menzi, etc.)
                  
                  console.log(`🔮 Previous ${topIntent.category} Archetype Score: ${archetypeScores[`${topIntent.category}ArchetypeScore`]}`);

                  const manualIntent = { category: topIntent.category, confidenceScore: 1 };
                  updateArchetypeScore(manualIntent, "AskForWho"); // Pass topIntent and state ("AskForWho" in this case)
                  // Log the updated archetype score for the selected person
                  console.log(`🔮 Updated ${topIntent.category} Archetype Score: ${archetypeScores[`${topIntent.category}ArchetypeScore`]}`);
                  
                  return {
                    utterance: `${spokenPerson}. From now on. You will be. ${getPerson(spokenPerson)}.`,
                  }
                }
                
                // 🚀 Logic when topIntent has high confidence
                else if (isTopIntent) {
                  context.person = topIntent.category.toLowerCase();

                  // 🔮 Update the specific archetype score for the person selected (e.g., Zack, Menzi, etc.)
                  updateArchetypeScore(topIntent, "AskForWho"); // Pass topIntent and state ("AskForWho" in this case)

                  // Log the updated archetype score for the selected person
                  console.log(`🔮 ${topIntent.category} Archetype Score: ${archetypeScores[`${topIntent.category}ArchetypeScore`]}`);

                  

                  return {
                    nextState: "AskForWhen", // Transition to "AskForWhen" state
                    utterance: `${context.person}. From now on. You will be. ${getPerson(context.person)}`,  
                  };
                }

            

                // 🔙 go back case!
                else if (context.person?.[0]?.utterance?.toLowerCase() === "help") {

                  resetArchetypeScores();  // Call the reset function to reset all scores
                  console.log(`🔮 Previous ${topIntent.category} Archetype Score: ${archetypeScores[`${topIntent.category}ArchetypeScore`]}`);
                  console.log(`🔮 Updated ${topIntent.category} Archetype Score: ${archetypeScores[`${topIntent.category}ArchetypeScore`]}`);
                  
                  return {
                    utterance: "Let's go back!",
                    nextState: "Greeting"
                  };
                }



                // 🔮 guess case
                else if (isTopIntent && topIntent.confidenceScore > 0.70) {
                  return {
                    nextState: "AskForWho",
                    utterance: `Did you mean ${topIntent.category}? If yes, repeat the name.`,
                  };
                }

                // ❌ Out-of-grammar case
                else {
                  
                  return {
                    utterance: "I didn't quite understand your request.",
                    nextState: "AskForWho",
                  };
                }


                
                
              }
            },
            assign({ noInputCount: 0 })  // Reset noInputCount to zero /*FIX_NO_INPUT*/
            
          ],


        
          on: {
            SPEAK_COMPLETE: [

              {
                // If the user says "help", move to "Greeting"
                guard: ({ context }) => {
                  const spokenPerson = context.person?.[0]?.utterance;
                  return typeof spokenPerson === "string" && spokenPerson.toLowerCase() === "help";
                },
                target: "Greeting",
              },
          
              {
                // If the spokenPerson is in the grammar, go to "AskForWhen"
                guard: ({ context }) => {
                  const spokenPerson = context.person?.[0]?.utterance;
                  return typeof spokenPerson === "string" && isInGrammar(spokenPerson);
                },
                target: "AskForWhen",
              },

              {
                //topIntent approach
                guard: ({ context }) => {
                  // Extract the intents array from context
                  const intents = context.interpretation?.intents;
                  // Find the top intent with the highest confidence score
                  const topIntent = intents?.reduce((prev, current) => (prev.confidenceScore > current.confidenceScore ? prev : current), {});
                  // Define the valid persons
                  const validPersons = ["Zack", "Hierophant", "Billy", "Menzi", "Voyager", "Devil", "Master", "Artist", "French", "Empress", "Kid", "Player"];
                  // Check if topIntent exists and has a confidence score above 0.80 and the category matches one of the valid persons
                  const isTopIntent = topIntent && topIntent.confidenceScore > 0.80 && validPersons.includes(topIntent.category);

                  return isTopIntent; // Transition to AskForWhen if topIntent has suffcient confidence
                },
                target: "AskForWhen", // Transition to AskForWhen state
              },

              { target: "AskForWho" }, // 🔄 Go back if not in grammar
            ],
          },
        },

        



        /* TIME */
        AskForWhen: {
          entry: [
            () => console.log("🟢 Asking for when..."),
            
            // HTML part
            ({ context }) => {
              // Debugging: Log what is inside `context.person`
              console.log("🔍 Context person data:", context.person);
        
              // Ensure spokenPerson is retrieved safely
              const spokenPerson =
              typeof context.person === "string"
                ? context.person
                : context.person?.text ||
                  context.person?.[0]?.utterance?.toLowerCase().trim() ||
                  "unknown";
              console.log(`🎭 Recognized spoken person: "${spokenPerson}"`);

        
              // Determine background based on recognized name
              let background;
              switch (spokenPerson) {

                case "the photographer":
                case "zack grand hotel":
                case "zack":
                case "fede":
                case "federico":
                  background = "/photographer.gif";
                  break;

                case "the hierophant":
                case "hierophant":
                case "the pope":
                case "matte":
                case "look here, there is nothing. the empire of nothing":
                case "pope":
                case "bisce":
                case "matteo":
                  background = "/hierophant.gif";
                  break;

                case "the emperor":
                case "billy":
                case "marco":
                case "have you ever heard about the italian dance?":
                case "i will not forget":
                case "i want to be billy":
                case "emperor":
                  background = "/billy.gif";
                  break;

                case "the idol":
                case "menzi":
                case "menzi idol":
                case "idol":
                case "andrea":
                case "manzino":
                case "the menzi idol":
                case "manzi":
                  background = "/menzi.gif";
                  break;

                case "the voyager":
                case "explorer":
                case "voyager":
                case "julien":
                case "giulio":
                  background = "/explorer.gif";
                  break;

                case "the devil":
                case "devil":
                  background = "/devil.gif"; // Default background
                  break;

                case "the master":
                case "master":
                  background = "/undefined_character.gif"; // Default background
                  break;

                case "the artist":
                case "artist":
                  background = "/artist.gif";
                  break;

                case "the french":
                case "french":
                  background = "/undefined_character.gif"; // Default background
                  break;

                case "the empress":
                case "empress":
                case "the sage":
                  background = "/empress.gif"; // Default background
                  break;

                case "the kid":
                case "kid":
                case "kodi grand hotel":
                case "kodi":
                case "the illusionist":
                case "ale":
                case "alessandro":
                case "kid":
                case "magician":
                  background = "/kid.gif";
                  break;

                case "the player":
                case "the gamer":
                case "player":
                  background = "/player.gif.gif";
                  break;
                  

                default:
                  background = "/undefined_character.gif"; // Default background

              }
              console.log(`🎭 Setting background to: ${background}`);
              document.body.style.backgroundImage = `url("${background}")`;
            },

            { type: "spst.speak", params: { utterance: `To when you want to travel? Past, present or future?` } }
          ],
          meta: { view: "AskForWhen" },
          on: { SPEAK_COMPLETE: "AskForWhenListen" },
        },
        
        AskForWhenListen: {
          initial: "Ask",
          entry: [
            () => console.log("👂 Listening for when..."),
            { type: "spst.listen"}
          ],

          context: {
            noInputCount: 0  // Re-Initialize no-input counter
          },

          on: {
            LISTEN_COMPLETE: [
              {
                target: "CheckGrammarWhen",
                guard: ({ context }) => !!context.time,
              },
 
              {
                target: "Greeting",
                guard: ({ context }) => {
                  const helpIntent = context.interpretation?.intents?.find(
                    intent => intent.category === "Help"
                  );
                  const isHelpIntent = helpIntent && helpIntent.confidenceScore > 0.80;
                  const isHelpUtterance = context.time?.[0]?.utterance?.toLowerCase() === "help";
              
                  return isHelpUtterance || isHelpIntent;
                },
              },

              { target: ".NoInput" },
            ],
          },

        states: {

            Ask: {
              entry: [
                () => console.log("🔊 Listening for input..."),
                { type: "spst.listen" },
                ({ context }) => {
                  if (context.noInputCount === undefined) {
                    context.noInputCount = 0; // Ensure it's initialized to 0
                  }
                  console.log(`⚠️ NoInput detected: Attempt ${context.noInputCount + 1}`);
                },
              ],
              on: {
                RECOGNISED: {
                  actions: assign(({ event }) => {
                    console.log("🎤 ASR recognized:", event);  // Log ASR recognition
                    return {
                      time: event.value,
                      interpretation: event.nluValue
                    };
                  }),
                },

                ASR_NOINPUT: {
                    actions: assign({ time: null }),
                },
                ASR_STOP: {
                  actions: () => console.log("⚠️ ASR STOP received - possibly prematurely."),
                },
              },
            },
            
            NoInput: {
              entry: [
                ({ context }) => {
                  if (context.noInputCount === undefined) {
                    context.noInputCount = 0; // Ensure it's initialized to 0
                  }
                  console.log(`⚠️ NoInput detected: Attempt ${context.noInputCount + 1}`);
                },
             
                {
                  type: "spst.speak",
                  params: ({ context }) => {
                    if (context.noInputCount === 0) {  // First no-input case
                      return { utterance: "Sorry, I didn't hear you. Please tell me Past, Present or Future." };
                    } else if (context.noInputCount === 1) {  // Second no-input case
                      return { utterance: "I still didn't get that. Can you please say if you want to travel in the past, in the present or in the future?" };
                    } else {  // Third no-input case
                      return { utterance: "I couldn't understand. Let's stop here." };
                    }
                  }
                },
                assign(({ context }) => ({
                  noInputCount: context.noInputCount + 1  // Increase AFTER speaking
                }))
              ],
              on: {
                SPEAK_COMPLETE: [
                  { target: "Ask",
                    guard: ({ context }) => context.noInputCount < 3  // Only retry if attempts < 3  // VERY IMPORTANT CONDITION. OTHERWISE IT DOESN'T STOP AFTER ATTEMPT 3.
                  },  // Retry listening if not exceeded max attempts
                  
                  {
                    target: "#DM.Finish",  // Exit after 3 no-inputs
                    guard: ({ context }) => context.noInputCount >= 3  
                  },
                  
                ]
              }
            },


          },
        },

        Finish: {
          entry: [
            () => console.log("🔴 Ending conversation."),
            { type: "spst.speak", params: { utterance: "It was nice to see you again anyway. Goodbye!" } },
            assign({ noInputCount: 0 })  // Reset noInputCount to zero
          ],
          on: {
            CLICK: "Done",
          },
        },

        CheckGrammarWhen: {
          entry: [
   
            ({ context }) => {

              // Extract time entitity from recognized context if it exists
              const timeEntity = context.interpretation?.entities.find(entity => entity.category === "time");
              console.log(`⏱️ Time Entity: ${timeEntity?.text || "undefined"}`);

              const spokenTime = context.time?.[0]?.utterance || "unknown"; // ✅ Safe access
              const inGrammar = isInGrammar(spokenTime);
              console.log(`🔍 You just said: ${spokenTime}`);


              // Extract top intent | lab4
              const topIntent = context.interpretation?.topIntent;
              console.log(`😎 topIntent: ${topIntent}`);


            

              // ⏱️ Check time
              const checkTimeIntent = (category) => {
                const timeIntent = context.interpretation?.intents?.find(intent => intent.category === category);
                return timeIntent && timeIntent.confidenceScore > 0.80;
              };
              const validTime = ["GoToPast", "GoToPresent", "GoToFuture"];
              validTime.forEach(time => {
                const isTime = checkTimeIntent(time);
                console.log(`⏱️ Is this a ${time} selection? ${isTime ? "Yes" : "No,"} with confidence score: ${context.interpretation?.intents?.find(intent => intent.category === time)?.confidenceScore || "N/A"}`);
              });


              
            
            },
        
        
        
        
        
            {
              type: "spst.speak.fr", // From now on there should be a new voice. ONLY IN THIS STATE.
              params: ({ context }) => {

                const spokenTime = context.time?.[0]?.utterance || "unknown";
                const fullTime = grammar[spokenTime]?.time || spokenTime; // Look up full time in grammar

           
     
              // NEW VERSION | lab5

                // Extract the intents array from context
                const intents = context.interpretation?.intents;
                // Find the top intent with the highest confidence score
                const topIntent = intents?.reduce((prev, current) => (prev.confidenceScore > current.confidenceScore ? prev : current), {});
                // Define the valid times
                const validTime = ["GoToPast", "GoToPresent", "GoToFuture"];
                // Check if topIntent exists and has a confidence score above 0.80 and the category matches one of the valid times
                const isTopIntent = topIntent && topIntent.confidenceScore > 0.80 && validTime.includes(topIntent.category);
                // Log the details
                console.log(`🚀 topIntent: ${topIntent ? topIntent.category : "N/A"} with confidence score: ${isTopIntent ? topIntent.confidenceScore : "N/A"}`);


                // Mapping between time intents and archetypes
                const timeToArchetypes = {
                  "GoToPast": ["Zack", "Empress"],
                  "GoToPresent": ["Hierophant", "Menzi", "Master", "French"],
                  "GoToFuture": ["Billy", "Voyager", "Devil", "Artist", "Kid", "Player"]
                };

       

                // 😊 The user says exactly the time that is stored in the grammar if it is not it goes to the topIntent case before going to the out-of-grammar case
                if (isInGrammar(spokenTime)) {

                  // 🔮 Log the previous archetype score for the top intent
                  console.log(`🔮 Previous ${topIntent.category} Archetype Score: ${archetypeScores[`${topIntent.category}ArchetypeScore`]}`);

                  // Check if the topIntent is a time intent (GoToPast, GoToPresent, GoToFuture)
                  if (validTime.includes(topIntent.category)) {
                    // Get the corresponding archetypes from the mapping
                    const archetypesToUpdate = timeToArchetypes[topIntent.category];

                    // Update the archetype scores for each associated archetype
                    archetypesToUpdate.forEach(archetype => {
                      const manualIntent = { category: archetype, confidenceScore: 1 };
                      updateArchetypeScore(manualIntent, "AskForWhen"); // Update score for each archetype
                    });

                    // Log the updated archetype scores
                    const updatedScores = archetypesToUpdate.map(archetype => {
                      return `${archetype}: ${archetypeScores[`${archetype}ArchetypeScore`]}`;
                    }).join(", ");
                    console.log(`🔮 Updated archetype scores for: ${updatedScores}`);
                  }

                  return {
                    utterance: `Get ready to travel through the ${getTime(spokenTime)}.`,
                  };
}
                
                // 🚀 Logic when topIntent has high confidence
                else if (isTopIntent) {
                  context.time = topIntent.category.toLowerCase();

                  // 🔮 Log the previous archetype score for the top intent
                  console.log(`🔮 Previous ${topIntent.category} Archetype Score: ${archetypeScores[`${topIntent.category}ArchetypeScore`]}`);

                  // 🔮 Check if we need to update the archetype scores for all or just the associated archetypes
                  if (topIntent.category === "GoToPast" || topIntent.category === "GoToPresent" || topIntent.category === "GoToFuture") {
                    // Get the corresponding archetypes from the mapping
                    const archetypesToUpdate = timeToArchetypes[topIntent.category];

                    // If updating all associated archetypes
                    archetypesToUpdate.forEach(archetype => {
                      const manualIntent = { category: archetype, confidenceScore: 1 };
                      updateArchetypeScore(manualIntent, "AskForWhen"); // Update each archetype's score
                    });

                    // Log the updated archetype scores
                    const updatedScores = archetypesToUpdate.map(archetype => {
                      return `${archetype}: ${archetypeScores[`${archetype}ArchetypeScore`]}`;
                    }).join(", ");
                    console.log(`🔮 Updated archetype scores for: ${updatedScores}`);

                  }

                  return {
                    nextState: "AskForWhere", // Transition to "AskForWhere" state
                    utterance: `${getTime(context.time)}. Get ready to travel through the ${getTime(context.time)}`
                  };
                }

            

                // 🔙 go back case!
                else if (context.time?.[0]?.utterance?.toLowerCase() === "help") {

                  resetArchetypeScores();  // Call the reset function to reset all scores
                  console.log(`🔮 Previous ${topIntent.category} Archetype Score: ${archetypeScores[`${topIntent.category}ArchetypeScore`]}`);
                  console.log(`🔮 Updated ${topIntent.category} Archetype Score: ${archetypeScores[`${topIntent.category}ArchetypeScore`]}`);
                  
                  return {
                    utterance: "Let's go back!",
                    nextState: "AskForWho"
                  };
                }



                // 🔮 guess case
                else if (isTopIntent && topIntent.confidenceScore > 0.70) {
                  return {
                    nextState: "AskForWhen",
                    utterance: `Did you mean ${topIntent.category}? If yes, repeat the time period.`,
                  };
                }

                // ❌ Out-of-grammar case
                else {
                  
                  return {
                    utterance: "I don't know that time.",
                    nextState: "AskForWhen",
                  };
                }



              },

            },
            assign({ noInputCount: 0 })  // Reset noInputCount to zero /***/

          ],
        
          on: {
            SPEAK_COMPLETE: [



              {
                // If the user says "help", move to "AskForWho"
                guard: ({ context }) => {
                  const spokenTime = context.time?.[0]?.utterance;
                  return typeof spokenTime === "string" && spokenTime.toLowerCase() === "help";
                },
                target: "AskForWho",
              },
          
              {
                // If the spokenTime is in the grammar, go to "AskForWhere"
                guard: ({ context }) => {
                  const spokenTime = context.time?.[0]?.utterance;
                  return typeof spokenTime === "string" && isInGrammar(spokenTime);
                },
                target: "AskForWhere",
              },

              {
                //topIntent approach
                guard: ({ context }) => {
                  // Extract the intents array from context
                  const intents = context.interpretation?.intents;
                  // Find the top intent with the highest confidence score
                  const topIntent = intents?.reduce((prev, current) => (prev.confidenceScore > current.confidenceScore ? prev : current), {});
                  // Define the valid times
                  const validTime = ["GoToPast", "GoToPresent", "GoToFuture"];
                  // Check if topIntent exists and has a confidence score above 0.80 and the category matches one of the valid times
                  const isTopIntent = topIntent && topIntent.confidenceScore > 0.80 && validTime.includes(topIntent.category);

                  return isTopIntent; // Transition to AskForWhere if topIntent has suffcient confidence
                },
                target: "AskForWhere", // Transition to AskForWhere state
              },

              { target: "AskForWhen" }, // 🔄 Go back if not in grammar

            ],
          },
        },


        /* SPACE */
        AskForWhere: {
          entry: [
            () => console.log("🟢 Asking for where..."),
            { type: "spst.speak", params: { utterance: `Where do you want to travel?` } }
          ],
          on: { SPEAK_COMPLETE: "AskForWhereListen" },
        },
        

        AskForWhereListen: {
          initial: "Ask",
          entry: [
            () => console.log("👂 Listening for where..."),
            { type: "spst.listen"}
          ],

          context: {
            noInputCount: 0  // Re-Initialize no-input counter
          },

          on: {
            LISTEN_COMPLETE: [
              {
                target: "CheckGrammarWhere",
                guard: ({ context }) => !!context.space,
              },
              { target: ".NoInput" },
              {
                target: "AskForWhen",
                guard: ({ context }) => {
                  const helpIntent = context.interpretation?.intents?.find(
                    intent => intent.category === "Help"
                  );
                  const isHelpIntent = helpIntent && helpIntent.confidenceScore > 0.80;
                  const isHelpUtterance = context.space?.[0]?.utterance?.toLowerCase() === "help";
              
                  return isHelpUtterance || isHelpIntent;
                },
              },
            ],
          },

        states: {

            Ask: {
              entry: [
                () => console.log("🔊 Listening for input..."),
                { type: "spst.listen" },
                ({ context }) => {
                  if (context.noInputCount === undefined) {
                    context.noInputCount = 0; // Ensure it's initialized to 0
                  }
                  console.log(`⚠️ NoInput detected: Attempt ${context.noInputCount + 1}`);
                },
              ],
              on: {
                RECOGNISED: {
                  actions: assign(({ event }) => {
                    console.log("🎤 ASR recognized:", event);  // Log ASR recognition
                    return {
                      space: event.value,
                      interpretation: event.nluValue
                    };
                  }),
                },

                ASR_NOINPUT: {
                    actions: assign({ space: null }),
                },
                ASR_STOP: {
                  actions: () => console.log("⚠️ ASR STOP received - possibly prematurely."),
                },
              },
            },
            
            NoInput: {
              entry: [
                ({ context }) => {
                  if (context.noInputCount === undefined) {
                    context.noInputCount = 0; // Ensure it's initialized to 0
                  }
                  console.log(`⚠️ NoInput detected: Attempt ${context.noInputCount + 1}`);
                },
             
                {
                  type: "spst.speak",
                  params: ({ context }) => {
                    if (context.noInputCount === 0) {  // First no-input case
                      return { utterance: "Sorry, I didn't hear you. Please tell me Helsinki, Atlantic City, Morocco, Santa Monica, Varazze, Morbegno, Florence, Savona, Turin, Paris, Gothenburg, Lake or something else." };
                    } else if (context.noInputCount === 1) {  // Second no-input case
                      return { utterance: "I still didn't get that. Can you please say Helsinki, Atlantic City, Morocco, Santa Monica, Varazze, Morbegno, Florence, Savona, Turin, Paris, Gothenburg, Lake or something else?" };
                    } else {  // Third no-input case
                      return { utterance: "I couldn't understand. Let's stop here." };
                    }
                  }
                },
                assign(({ context }) => ({
                  noInputCount: context.noInputCount + 1  // Increase AFTER speaking
                }))
              ],
              on: {
                SPEAK_COMPLETE: [
                  { target: "Ask",
                    guard: ({ context }) => context.noInputCount < 3  // Only retry if attempts < 3  // VERY IMPORTANT CONDITION. OTHERWISE IT DOESN'T STOP AFTER ATTEMPT 3.
                  },  // Retry listening if not exceeded max attempts
                  
                  {
                    target: "#DM.Finish",  // Exit after 3 no-inputs
                    guard: ({ context }) => context.noInputCount >= 3  
                  },
                  
                ]
              }
            },


          },
        },

        Finish: {
          entry: [
            () => console.log("🔴 Ending conversation."),
            { type: "spst.speak", params: { utterance: "It was nice to see you again anyway. Goodbye!" } },
            assign({ noInputCount: 0 })  // Reset noInputCount to zero
          ],
          on: {
            CLICK: "Done",
          },
        },

        CheckGrammarWhere: {
          entry: [
   
            ({ context }) => {

              // Extract space entitity from recognized context if it exists
              const spacentity = context.interpretation?.entities.find(entity => entity.category === "space");
              console.log(`🌍 Space Entity: ${spacentity?.text || "undefined"}`);

              const spokenSpace = context.space?.[0]?.utterance || "unknown"; // ✅ Safe access
              const inGrammar = isInGrammar(spokenSpace);
              console.log(`🔍 You just said: ${spokenSpace}`);


              // Extract top intent | lab4
              const topIntent = context.interpretation?.topIntent;
              console.log(`😎 topIntent: ${topIntent}`);


            

              // 🌍 Check space
              const checkSpaceIntent = (category) => {
                const spaceIntent = context.interpretation?.intents?.find(intent => intent.category === category);
                return spaceIntent && spaceIntent.confidenceScore > 0.80;
              };
              const validSpace = ["GoToHelsinki", "GoToAtlanticCity", "GoToMorocco", "GoToFlorence", "GoToSantaMonica", "GoToParis", "GoToGothenburg", "GoToLake", "GoToSavona", "GoToVarazze", "GoToTurin", "GoToMorbegno" ];
              validSpace.forEach(space => {
                const isSpace = checkSpaceIntent(space);
                console.log(`🌍 Is this a ${space} selection? ${isSpace ? "Yes" : "No,"} with confidence score: ${context.interpretation?.intents?.find(intent => intent.category === space)?.confidenceScore || "N/A"}`);
              });


              
            
            },
        
        
        
        
        
            {
              type: "spst.speak", // Here is where you can set a different voice!
              params: ({ context }) => {

                const spokenSpace = context.space?.[0]?.utterance || "unknown";
                const fullSpace = grammar[spokenSpace]?.time || spokenSpace; // Look up full space in grammar

           
     
              // NEW VERSION | lab5

                // Extract the intents array from context
                const intents = context.interpretation?.intents;
                // Find the top intent with the highest confidence score
                const topIntent = intents?.reduce((prev, current) => (prev.confidenceScore > current.confidenceScore ? prev : current), {});
                // Define the valid spaces
                const validSpace = ["GoToHelsinki", "GoToAtlanticCity", "GoToMorocco", "GoToFlorence", "GoToSantaMonica", "GoToParis", "GoToGothenburg", "GoToLake", "GoToSavona", "GoToVarazze", "GoToTurin", "GoToMorbegno" ];
                // Check if topIntent exists and has a confidence score above 0.80 and the category matches one of the valid spaces
                const isTopIntent = topIntent && topIntent.confidenceScore > 0.80 && validSpace.includes(topIntent.category);
                // Log the details
                console.log(`🚀 topIntent: ${topIntent ? topIntent.category : "N/A"} with confidence score: ${isTopIntent ? topIntent.confidenceScore : "N/A"}`);


                // Mapping between time intents and archetypes
                const spaceToArchetypes = {
                  "GoToHelsinki": ["Billy", "French"],
                  "GoToAtlanticCity": ["Player", "Devil"],
                  "GoToMorocco": ["Voyager", "Empress"],
                  "GoToFlorence": ["Billy", "Menzi", "Hierophant", "Zack", "Kid", "Artist", "Master"],
                  "GoToSantaMonica": ["Devil", "Player"],
                  "GoToParis": ["Hierophant", "French"],
                  "GoToGothenburg": ["Artist", "Billy"],
                  "GoToLake": ["Empress", "Voyager"],
                  "GoToSavona": ["Menzi", "Zack", "Kid"],
                  "GoToVarazze": ["Hierophant", "Master"],
                  "GoToTurin": ["Zack", "Kid"],
                  "GoToMorbegno": ["Billy", "Voyager", "Devil", "Hierophant", "Menzi", "Zack", "Kid"],
                };

       

                // 😊 The user says exactly the space that is stored in the grammar if it is not it goes to the topIntent case before going to the out-of-grammar case
                if (isInGrammar(spokenSpace)) {

                  // 🔮 Log the previous archetype score for the top intent
                  console.log(`🔮 Previous ${topIntent.category} Archetype Score: ${archetypeScores[`${topIntent.category}ArchetypeScore`]}`);

                  // Check if the topIntent is a time intent (GoToPast, GoToPresent, GoToFuture)
                  if (validSpace.includes(topIntent.category)) {
                    // Get the corresponding archetypes from the mapping
                    const archetypesToUpdate = spaceToArchetypes[topIntent.category];

                    // Update the archetype scores for each associated archetype
                    archetypesToUpdate.forEach(archetype => {
                      const manualIntent = { category: archetype, confidenceScore: 1 };
                      updateArchetypeScore(manualIntent, "AskForWhere"); // Update score for each archetype
                    });

                    // Log the updated archetype scores
                    const updatedScores = archetypesToUpdate.map(archetype => {
                      return `${archetype}: ${archetypeScores[`${archetype}ArchetypeScore`]}`;
                    }).join(", ");
                    console.log(`🔮 Updated archetype scores for: ${updatedScores}`);
                  }

                  return {
                    utterance: `Let's go to ${getSpace(spokenSpace)}.`,
                  };
}
                
                // 🚀 Logic when topIntent has high confidence
                else if (isTopIntent) {
                  context.space = topIntent.category.toLowerCase();

                  // 🔮 Log the previous archetype score for the top intent
                  console.log(`🔮 Previous ${topIntent.category} Archetype Score: ${archetypeScores[`${topIntent.category}ArchetypeScore`]}`);

                  // 🔮 Check if the category exists in spaceToArchetypes
                  if (spaceToArchetypes.hasOwnProperty(topIntent.category)) {
                    // Get the corresponding archetypes from the mapping
                    const archetypesToUpdate = spaceToArchetypes[topIntent.category];

                    // If updating all associated archetypes
                    archetypesToUpdate.forEach(archetype => {
                      const manualIntent = { category: archetype, confidenceScore: 1 };
                      updateArchetypeScore(manualIntent, "AskForWhere"); // Update each archetype's score
                    });

                    // Log the updated archetype scores
                    const updatedScores = archetypesToUpdate.map(archetype => {
                      return `${archetype}: ${archetypeScores[`${archetype}ArchetypeScore`]}`;
                    }).join(", ");
                    console.log(`🔮 Updated archetype scores for: ${updatedScores}`);
                  }

                  return {
                    nextState: "Starting", // Transition to "Starting" state
                    utterance: `${context.space}. Let's go to ${getSpace(context.space)}`
                  };
                }

            

                // 🔙 go back case!
                else if (context.space?.[0]?.utterance?.toLowerCase() === "help") {


                  // N.B. If the user goes back at this step, it will lose the acquired poitns got also from the selection of the character
                  resetArchetypeScores();  // Call the reset function to reset all scores
                  console.log(`🔮 Previous ${topIntent.category} Archetype Score: ${archetypeScores[`${topIntent.category}ArchetypeScore`]}`);
                  console.log(`🔮 Updated ${topIntent.category} Archetype Score: ${archetypeScores[`${topIntent.category}ArchetypeScore`]}`);
                  
                  return {
                    utterance: "Let's go back!",
                    nextState: "AskForWhen"
                  };
                }



                // 🔮 guess case
                else if (isTopIntent && topIntent.confidenceScore > 0.70) {
                  return {
                    nextState: "AskForWhere",
                    utterance: `Did you mean ${topIntent.category}? If yes, repeat the name of the place.`,
                  };
                }

                // ❌ Out-of-grammar case
                else {
                  
                  return {
                    utterance: "I don't know that place.",
                    nextState: "AskForWhere",
                  };
                }



              },

            },
            assign({ noInputCount: 0 })  // Reset noInputCount to zero /*FIX_NO_INPUT*/

          ],
        
          on: {
            SPEAK_COMPLETE: [



              {
                // If the user says "help", move to "AskForWhen"
                guard: ({ context }) => {
                  const spokenSpace = context.space?.[0]?.utterance;
                  return typeof spokenSpace === "string" && spokenSpace.toLowerCase() === "help";
                },
                target: "AskForWhen",
              },
          
              {
                // If the spokenSpace is in the grammar, go to "Starting"
                guard: ({ context }) => {
                  const spokenSpace = context.space?.[0]?.utterance;
                  return typeof spokenSpace === "string" && isInGrammar(spokenSpace);
                },
                target: "Starting",
              },

              {
                //topIntent approach
                guard: ({ context }) => {
                  // Extract the intents array from context
                  const intents = context.interpretation?.intents;
                  // Find the top intent with the highest confidence score
                  const topIntent = intents?.reduce((prev, current) => (prev.confidenceScore > current.confidenceScore ? prev : current), {});
                  // Define the valid spaces
                  const validSpace = ["GoToHelsinki", "GoToAtlanticCity", "GoToMorocco", "GoToFlorence", "GoToSantaMonica", "GoToParis", "GoToGothenburg", "GoToLake", "GoToSavona", "GoToVarazze", "GoToTurin", "GoToMorbegno" ];
                  // Check if topIntent exists and has a confidence score above 0.80 and the category matches one of the valid spaces
                  const isTopIntent = topIntent && topIntent.confidenceScore > 0.80 && validSpace.includes(topIntent.category);

                  return isTopIntent; // Transition to Starting if topIntent has suffcient confidence
                },
                target: "Starting", // Transition to Starting state
              },

              { target: "AskForWhere" }, // 🔄 Go back if not in grammar

            ],
          },
        },



        /* STARTING */
        Starting: {
          entry: [
            () => console.log("🟢 Starting..."),

            // Extract values and update context
            assign(({ context }) => {
              const spokenPerson =
                typeof context.person === "string"
                  ? context.person
                  : context.person?.text ||
                    context.person?.[0]?.utterance?.toLowerCase().trim() ||
                    "unknown";
              console.log(`👤 Recognized spoken person: "${spokenPerson}"`);

              const spokenTime =
                typeof context.time === "string"
                  ? context.time
                  : context.time?.text ||
                    context.time?.[0]?.utterance?.toLowerCase().trim() ||
                    "unknown";
              console.log(`⏱️ Recognized spoken time: "${spokenTime}"`);

              const spokenSpace =
                typeof context.space === "string"
                  ? context.space
                  : context.space?.text ||
                    context.space?.[0]?.utterance?.toLowerCase().trim() ||
                    "unknown";
              console.log(`🌎 Recognized spoken space: "${spokenSpace}"`);

              return { spokenPerson, spokenTime, spokenSpace };
            }),

            // Set background dynamically (consider moving to an effect if needed)
            ({ context }) => {
              let background;
              switch (context.spokenSpace) {
                case "helsinki":
                case "gotohelsinki":
                  background = "/helsinki.gif";
                  break;
                case "atlantic city":
                case "gotoatlanticcity":
                  background = "/atlanticcity.gif";
                  break;
                case "morocco":
                case "gotomorocco":
                  background = "/morocco.gif";
                  break;
                case "florence":
                case "gotoflorence":
                  background = "/florence.gif";
                  break;
                case "santa monica":
                case "gotosantamonica":
                  background = "/santamonica.gif";
                  break;
                default:
                  background = "/undefined_space.gif";
              }
              console.log(`🎭 Setting background to: ${background}`);
              document.body.style.backgroundImage = `url("${background}")`;
            },  

            // Speech action with function to access context
            { 
              type: "spst.speak", 
              params: ({ context }) => ({
                utterance: `Hi ${context.spokenPerson} I am H. Do you remember me? I have some questions for you.`
              }) 
            }
          ],
          meta: { view: "Starting" },
          on: { SPEAK_COMPLETE: "Questions" },
        },


        /* QUESTIONS */

        Questions: {

          entry: [
            assign(({ context }) => ({
              selectedQuestion: getRandomQuestion(),
            })),
            ({ context }) => console.log("❓ Selected Question:", context.selectedQuestion),
            { type: "spst.speak", params: ({ context }) => ({ utterance: context.selectedQuestion }) },
          ],

          on: { SPEAK_COMPLETE: "QuestionsListen" },
        },
        
        QuestionsListen: {
          initial: "Ask",
          entry: [
            () => console.log("👂 Listening for answer..."),
            { type: "spst.listen" },


          ],

          context: {
            noInputCount: 0  // Re-Initialize no-input counter
          },

          on: {
            LISTEN_COMPLETE: [
              {
                target: "CheckGrammarAnswer",
                guard: ({ context }) => !!context.answer,
              },
              { target: ".NoInput" },
 
              {
                target: "#DM.TravelAgain",
                guard: ({ context }) => {
                  const stopIntent = context.interpretation?.intents?.find(
                    intent => intent.category === "Stop"
                  );
                  const isStopIntent = stopIntent && stopIntent.confidenceScore > 0.80;
                  const isStopUtterance = context.time?.[0]?.utterance?.toLowerCase()?.trim() === "stop";
              
                  return isStopUtterance || isStopIntent;
                },
              },
            ],
          },


          states: {

            Ask: {
              entry: [
                () => console.log("🔊 Listening for input..."),
                { type: "spst.listen" },
                ({ context }) => {
                  if (context.noInputCount === undefined) {
                    context.noInputCount = 0; // Ensure it's initialized to 0
                  }
                  console.log(`⚠️ NoInput detected: Attempt ${context.noInputCount + 1}`);
                },
              ],
              on: {
                RECOGNISED: {
                  actions: assign(({ event }) => {
                    console.log("🎤 ASR recognized:", event);  // Log ASR recognition
                    return {
                      answer: event.value,
                      interpretation: event.nluValue
                    };
                  }),
                },

                ASR_NOINPUT: {
                    actions: assign({ answer: null }),
                },
                ASR_STOP: {
                  actions: () => console.log("⚠️ ASR STOP received - possibly prematurely."),
                },
              },
            },
            
            NoInput: {
              entry: [
                ({ context }) => {
                  if (context.noInputCount === undefined) {
                    context.noInputCount = 0; // Ensure it's initialized to 0
                  }
                  console.log(`⚠️ NoInput detected: Attempt ${context.noInputCount + 1}`);
                },
             
                {
                  type: "spst.speak",
                  params: ({ context }) => {
                    if (context.noInputCount === 0) {  // First no-input case
                      return { utterance: `Sorry, I didn't hear you. Please tell me. ${context.selectedQuestion}` };
                    } else if (context.noInputCount === 1) {  // Second no-input case
                      return { utterance: `I still didn't get that. ${context.selectedQuestion}` };
                    } else {  // Third no-input case
                      return { utterance: "I couldn't understand. Let's stop here." };
                    }
                  }
                },
                assign(({ context }) => ({
                  noInputCount: context.noInputCount + 1  // Increase AFTER speaking
                }))
              ],
              on: {
                SPEAK_COMPLETE: [
                  { target: "Ask",
                    guard: ({ context }) => context.noInputCount < 3  // Only retry if attempts < 3  // VERY IMPORTANT CONDITION. OTHERWISE IT DOESN'T STOP AFTER ATTEMPT 3.
                  },  // Retry listening if not exceeded max attempts
                  
                  {
                    target: "#DM.TravelAgain",  // Exit after 3 no-inputs  //target: "#DM.Finish",  // Exit after 3 no-inputs
                    guard: ({ context }) => context.noInputCount >= 3  
                  },
                  
                ]
              }
            },


          },
        },

        Finish: {
          entry: [
            () => console.log("🔴 Ending conversation."),
            { type: "spst.speak", params: { utterance: "It was nice to see you again anyway. Goodbye!" } },
            assign({ noInputCount: 0 })  // Reset noInputCount to zero
          ],
          on: {
            CLICK: "Done",
          },
        },

        CheckGrammarAnswer: {
          entry: [

            ({ context }) => {

              // Extract answer entitity from recognized context if it exists
              const answerEntity = context.interpretation?.entities.find(entity => entity.category === "answer");
              console.log(`⏱️ Answer Entity: ${answerEntity?.text || "undefined"}`);

              const spokenAnswer = context.answer?.[0]?.utterance || "unknown"; // ✅ Safe access
              const inGrammar = isInGrammar(spokenAnswer);
              console.log(`🔍 You just said: ${spokenAnswer}`);


              // Extract top intent | lab4
              const topIntent = context.interpretation?.topIntent;
              console.log(`😎 topIntent: ${topIntent}`);


            

              // 💭 Check answer
              const checkAnswerIntent = (category) => {
                const answerIntent = context.interpretation?.intents?.find(intent => intent.category === category);
                return answerIntent && answerIntent.confidenceScore > 0.80;
              };
              const validAnswer = ["Innocent", "Everyman", "Hero", "Caregiver", "Explorer", "Rebel", "Lover", "Creator", "Jester", "Sage", "Magician", "Ruler" ];
              validAnswer.forEach(answer => {
                const isAnswer = checkAnswerIntent(answer);
                console.log(`💭 Is this a ${answer} selection? ${isAnswer ? "Yes" : "No,"} with confidence score: ${context.interpretation?.intents?.find(intent => intent.category === answer)?.confidenceScore || "N/A"}`);
              });


              
            
            },
        
        
        
        
        
            {
              type: "spst.speak", 
              params: ({ context }) => {

                const spokenAnswer = context.answer?.[0]?.utterance || "unknown";
                const fullAnswer = (grammar[spokenAnswer] && grammar[spokenAnswer].answer) || spokenAnswer || "unknown";


                const spokenPerson =
                typeof context.person === "string"
                  ? context.person
                  : context.person?.text ||
                    context.person?.[0]?.utterance?.toLowerCase().trim() ||
                    "unknown";
                console.log(`👤 Recognized spoken person: "${spokenPerson}"`);

                const spokenTime =
                typeof context.time === "string"
                  ? context.time
                  : context.time?.text ||
                    context.time?.[0]?.utterance?.toLowerCase().trim() ||
                    "unknown";
                console.log(`⏱️ Recognized spoken time: "${spokenTime}"`);

                const spokenSpace =
                typeof context.space === "string"
                  ? context.space
                  : context.space?.text ||
                    context.space?.[0]?.utterance?.toLowerCase().trim() ||
                    "unknown";
                console.log(`🌎 Recognized spoken space: "${spokenSpace}"`);

           
     
              // NEW VERSION | lab5

                // Extract the intents array from context
                const intents = context.interpretation?.intents;
                // Find the top intent with the highest confidence score
                const topIntent = intents?.reduce((prev, current) => (prev.confidenceScore > current.confidenceScore ? prev : current), {});
                // Define the valid answers
                const validAnswer = ["Innocent", "Everyman", "Hero", "Caregiver", "Explorer", "Rebel", "Lover", "Creator", "Jester", "Sage", "Magician", "Ruler"];
                // Check if topIntent exists and has a confidence score above 0.80 and the category matches one of the valid answers
                const isTopIntent = topIntent && topIntent.confidenceScore > 0.80 && validAnswer.includes(topIntent.category);
                // Log the details
                console.log(`🚀 topIntent: ${topIntent ? topIntent.category : "N/A"} with confidence score: ${isTopIntent ? topIntent.confidenceScore : "N/A"}`);


                // Mapping between time intents and archetypes
                const answerToArchetypes = {

                  "Innocent": ["Zack"],
                  "Everyman": ["Hierophant"],
                  "Hero": ["Billy"],
                  "Caregiver": ["Menzi"],

                  "Explorer": ["Voyager"],
                  "Rebel": ["Devil"],
                  "Lover": ["Master"],
                  "Creator": ["Artist"],

                  "Jester": ["French"],
                  "Sage": ["Empress"],
                  "Magician": ["Kid"],
                  "Ruler": ["Player"],


                };

       

                // 😊 The user says exactly the time that is stored in the grammar if it is not it goes to the topIntent case before going to the out-of-grammar case
                if (isInGrammar(spokenAnswer)) {

                  // 🔮 Log the previous archetype score for the top intent
                  console.log(`🔮 Previous ${topIntent.category} Archetype Score: ${archetypeScores[`${topIntent.category}ArchetypeScore`]}`);

                  // Check if the topIntent is a time intent (GoToPast, GoToPresent, GoToFuture)
                  if (validAnswer.includes(topIntent.category)) {
                    // Get the corresponding archetypes from the mapping
                    const archetypesToUpdate = answerToArchetypes[topIntent.category];

                    // Update the archetype scores for each associated archetype
                    archetypesToUpdate.forEach(archetype => {
                      const manualIntent = { category: archetype, confidenceScore: 1 };
                      updateArchetypeScore(manualIntent, "Questions"); // Update score for each archetype
                    });

                    // Log the updated archetype scores
                    const updatedScores = archetypesToUpdate.map(archetype => {
                      return `${archetype}: ${archetypeScores[`${archetype}ArchetypeScore`]}`;
                    }).join(", ");
                    console.log(`🔮 Updated archetype scores for: ${updatedScores}`);
                  }

                  return {
                    utterance: `Thank you ${spokenPerson}.`,
                  };
}
                
                // 🚀 Logic when topIntent has high confidence
                else if (isTopIntent) {
                  context.answer = typeof topIntent.category === "string" ? topIntent.category.toLowerCase() : "unknown";

                  // 🔮 Log the previous archetype scores
                  console.log("🔮 ƒ Archetype Scores:");
                  Object.keys(archetypeScores).forEach(key => {
                    console.log(`${key}: ${archetypeScores[key] ?? "N/A"}`);
                  });

                  // 🔄 Initialize a set of archetypes to update
                  let archetypesToUpdate = new Set();

                  // ✅ Add archetypes from the mapping (GoToPast, GoToPresent, GoToFuture)
                  if (["Innocent", "Everyman", "Hero", "Caregiver", "Explorer", "Rebel", "Lover", "Creator", "Jester", "Sage", "Magician", "Ruler"].includes(topIntent.category)) {
                    answerToArchetypes[topIntent.category].forEach(archetype => archetypesToUpdate.add(archetype));
                  }

                  // ✅ Add corresponding intents to be updated
                  const extraIntents = ["Zack", "Hierophant", "Billy", "Menzi", "Voyager", "Devil", "Master", "Artist", "French", "Empress", "Kid", "Player"];
                  extraIntents.forEach(intent => archetypesToUpdate.add(intent));

                  // 🔄 Update **all selected archetypes**
                  archetypesToUpdate.forEach(archetype => {
                    const manualIntent = { category: archetype, confidenceScore: topIntent.confidenceScore };
                    updateArchetypeScore(manualIntent, "Questions");
                  });

                  // 🔮 Log the updated archetype scores
                  console.log("🔮 Updated Archetype Scores:");
                  Object.keys(archetypeScores).forEach(key => {
                    console.log(`${key}: ${archetypeScores[key] ?? "N/A"}`);
                  });

                  return {
                    nextState: "Questions", // Transition to "Questions" state in loop 
                    utterance: `Thank you ${spokenPerson}.`
                  };
                }
            

                // ✋ stop case! End of the loop
                else if (context.answer?.[0]?.utterance?.toLowerCase() === "stop") {


                  return {
                    utterance: "Ok. It's time.",
                    nextState: "#DM.TravelAgain"
                  };
                }



                // 🔮 guess case
                else if (isTopIntent && topIntent.confidenceScore > 0.60) {
                  return {
                    nextState: "Questions",
                    utterance: `This is a typical reply of the ${topIntent.category}, isn't it? If yes, just say ${topIntent.category}`,
                  };
                }

                // ❌ Out-of-grammar case
                else {
                  
                  return {
                    utterance: "I don't know what you mean. Please repeat.",
                    nextState: "Questions",
                  };
                }



              },

            },
            assign({ noInputCount: 0 })  // Reset noInputCount to zero /*FIX_NO_INPUT*/

          ],
            
        

        
          on: {
            SPEAK_COMPLETE: [

              {
                // If the user says "stop", move to "#DM.TravelAgain"
                guard: ({ context }) => {
                  const spokenAnswer = context.answer?.[0]?.utterance;
                  return typeof spokenAnswer === "string" && spokenAnswer.toLowerCase() === "stop";
                },
                target: "#DM.TravelAgain",
              },
          
              {
                // If the spokenAnswer is in the grammar, go to "AskForWhen"
                guard: ({ context }) => {
                  const spokenAnswer = context.answer?.[0]?.utterance;
                  console.log("👋 End of questions loop.");

                  return typeof spokenAnswer === "string" && isInGrammar(spokenAnswer);
                },
                target: "Questions",
              },

              {
                //topIntent approach
                guard: ({ context }) => {
                  // Extract the intents array from context
                  const intents = context.interpretation?.intents;
                  // Find the top intent with the highest confidence score
                  const topIntent = intents?.reduce((prev, current) => (prev.confidenceScore > current.confidenceScore ? prev : current), {});
                  // Define the valid answers
                  const validAnswer = ["Innocent", "Everyman", "Hero", "Caregiver", "Explorer", "Rebel", "Lover", "Creator", "Jester", "Sage", "Magician", "Ruler", "Zack", "Hierophant", "Billy", "Menzi", "Voyager", "Devil", "Master", "Artist", "French", "Empress", "Kid", "Player"];
                  // Check if topIntent exists and has a confidence score above 0.80 and the category matches one of the valid answers
                  const isTopIntent = topIntent && topIntent.confidenceScore > 0.80 && validAnswer.includes(topIntent.category);

                  return isTopIntent; // Transition to Questions if topIntent has suffcient confidence
                },
                target: "Questions", // Transition to AskForWhen state
              },

              { target: "Questions" }, // 🔄 Go back if not in grammar
            ],
          },
        },


        
        /* TRAVEL AGAIN */
        TravelAgain: {


          entry: {
            type: "spst.speak",
            params: ({ context }) => {
              // Ensure correct extraction of values
              const spokenPerson =
                typeof context.person === "string"
                  ? context.person.toLowerCase().trim()
                  : context.person?.[0]?.utterance?.toLowerCase().trim() || context.person?.text || "unknown";
          
              console.log(`👤 Recognized spoken person: "${spokenPerson}"`);
          
              const spokenTime =
                typeof context.time === "string"
                  ? context.time.toLowerCase().trim()
                  : context.time?.[0]?.utterance?.toLowerCase().trim() || context.time?.text || "unknown";
          
              console.log(`⏱️ Recognized time: "${getTime(spokenTime)}"`);
          
              const spokenSpace =
                typeof context.space === "string"
                  ? context.space.toLowerCase().trim()
                  : context.space?.[0]?.utterance?.toLowerCase().trim() || context.space?.text || "unknown";
          
              console.log(`🌎 Recognized space: "${getSpace(spokenSpace)}"`);
          
              // Return the object
              return {
                utterance: `${spokenPerson}, your journey in the ${getTime(spokenTime)} in ${getSpace(spokenSpace)} has come to an end. It has been great to see you again. I will not forget you. Do you want to travel again?`,
              };
            },
          },


          on: { SPEAK_COMPLETE: "TravelAgainListen" },
        },
        



        TravelAgainListen: {
          initial: "Ask",
          entry: [
            () => console.log("👂 Listening for reply..."),
            { type: "spst.listen"}
          ],

          context: {
            noInputCount: 0  // Re-Initialize no-input counter
          },

          on: {
            LISTEN_COMPLETE: [
              {
                target: "CheckGrammarTravelAgain",
                guard: ({ context }) => !!context.reply,
              },
              { target: ".NoInput" },
              {
                target: "UserArchetype",
                guard: ({ context }) => {
                  const stopIntent = context.interpretation?.intents?.find(
                    intent => intent.category === "Stop"
                  );
                  const isStopIntent = stopIntent && stopIntent.confidenceScore > 0.80;
                  const isStopUtterance = context.reply?.[0]?.utterance?.toLowerCase() === "stop";
              
                  return isStopUtterance || isStopIntent;
                },
              },
            ],
          },

        states: {

            Ask: {
              entry: [
                () => console.log("🔊 Listening for reply..."),
                { type: "spst.listen" },
                ({ context }) => {
                  if (context.noInputCount === undefined) {
                    context.noInputCount = 0; // Ensure it's initialized to 0
                  }
                  console.log(`⚠️ NoInput detected: Attempt ${context.noInputCount + 1}`);
                },
              ],
              on: {
                RECOGNISED: {
                  actions: assign(({ event }) => {
                    console.log("🎤 ASR recognized:", event);  // Log ASR recognition
                    return {
                      reply: event.value,
                      interpretation: event.nluValue
                    };
                  }),
                },

                ASR_NOINPUT: {
                    actions: assign({ reply: null }),
                },
                ASR_STOP: {
                  actions: () => console.log("⚠️ ASR STOP received - possibly prematurely."),
                },
              },
            },
            
            NoInput: {
              entry: [
                ({ context }) => {
                  if (context.noInputCount === undefined) {
                    context.noInputCount = 0; // Ensure it's initialized to 0
                  }
                  console.log(`⚠️ NoInput detected: Attempt ${context.noInputCount + 1}`);
                },
             
                {
                  type: "spst.speak",
                  params: ({ context }) => {
                    if (context.noInputCount === 0) {  // First no-input case
                      return { utterance: "Sorry, I didn't hear you. Do you want to travel again?" };
                    } else if (context.noInputCount === 1) {  // Second no-input case
                      return { utterance: "Please say yes or no." };
                    } else {  // Third no-input case
                      return { utterance: "I couldn't understand. Let's stop here." };
                    }
                  }
                },
                assign(({ context }) => ({
                  noInputCount: context.noInputCount + 1  // Increase AFTER speaking
                }))
              ],
              on: {
                SPEAK_COMPLETE: [
                  { target: "Ask",
                    guard: ({ context }) => context.noInputCount < 3  // Only retry if attempts < 3  // VERY IMPORTANT CONDITION. OTHERWISE IT DOESN'T STOP AFTER ATTEMPT 3.
                  },  // Retry listening if not exceeded max attempts
                  
                  {
                    target: "#DM.UserArchetype",  // Exit after 3 no-inputs
                    guard: ({ context }) => context.noInputCount >= 3  
                  },
                  
                ]
              }
            },


          },
        },



        CheckGrammarTravelAgain: {   
          entry: [
            ({ context }) => {
              const spokenReply = context.reply?.[0]?.utterance?.toLowerCase() || "unknown"; // ✅ Safe access & lowercase
              console.log(`🔍 You just said: ${spokenReply}`);
        
              const inGrammar = isInGrammar(spokenReply);
              console.log(`✅ Is "${spokenReply}" in grammar? ${inGrammar ? "Yes" : "No"}`);

            },
        
            {
              type: "spst.speak",
              params: ({ context }) => {

                const spokenPerson =
                typeof context.person === "string"
                  ? context.person.toLowerCase().trim()
                  : context.person?.[0]?.utterance?.toLowerCase().trim() || context.person?.text || "unknown";


     

                const spokenReply = context.reply?.[0]?.utterance?.toLowerCase() || "unknown";
                // const spokenPerson = context.person?.[0]?.utterance || "unknown"; // ✅ Safe access

                // Extract the intents array from context
                const intents = context.interpretation?.intents;
                // Find the top intent with the highest confidence score
                const topIntent = intents?.reduce((prev, current) => (prev.confidenceScore > current.confidenceScore ? prev : current), {});
                
                // Define the valid replies
                const validReply = ["ReplyYes", "ReplyNo"];
                // Check if topIntent exists and has a confidence score above 0.80 and the category matches one of the valid answers
                const isTopIntent = topIntent && topIntent.confidenceScore > 0.80 && validReply.includes(topIntent.category);
                // Log the details
                console.log(`🚀 topIntent: ${topIntent ? topIntent.category : "N/A"} with confidence score: ${isTopIntent ? topIntent.confidenceScore : "N/A"}`);


                

                // 😊 The user says exactly the reply that is stored in the grammar if it is not it goes to the topIntent case before going to the out-of-grammar case
                if (isInGrammar(spokenReply)) {
                  const reply = getReply(spokenReply);
                  
                  if (reply === "yes") {
                    return {
                      nextState: "AskForWhen", // Transition to "AskForWhen" state
                      utterance: `Okay ${spokenPerson}. Let's go back.`,
                    };
                  } else if (reply === "no") {
                    return {
                      nextState: "#DM.UserArchetype",
                      utterance: "Okay.",
                    };
                  }
                }
                
                // 🚀 Logic when topIntent has high confidence
                else if (isTopIntent) {
                  context.reply = topIntent.category.toLowerCase();
                
                  if (topIntent.category === "ReplyYes") {
                    return {
                      nextState: "AskForWhen", // Transition to "AskForWhen" state
                      utterance: `${context.reply}. Okay ${spokenPerson}. Let's go back.`,
                    };
                  } else if (topIntent.category === "ReplyNo") {
                    return {
                      nextState: "#DM.UserArchetype",
                      utterance: "Okay.",
                    };
                  }
                }

            

                // 🛑 stop case!
                else if (context.reply?.[0]?.utterance?.toLowerCase() === "stop") {
                  
                  return {
                    utterance: "Okay.",
                    nextState: "#DM.UserArchetype"
                  };
                }



                // 🔮 Guess case
                else if (isTopIntent && topIntent.confidenceScore > 0.70) {
                  if (topIntent.category === "ReplyYes") {
                    return {
                      nextState: "AskForWhen",
                      utterance: "Okay. Let's go back.",
                    };
                  } else if (topIntent.category === "ReplyNo") {
                    return {
                      nextState: "#DM.UserArchetype",
                      utterance: "Okay.",
                    };
                  } 

                }

                // ❌ Out-of-grammar case
                else {
                  
                  return {
                    utterance: "I didn't get you.",
                    nextState: "TravelAgain",
                  };
                }


              },
            },
            assign({ noInputCount: 0 })  // Reset noInputCount to zero /*FIX_NO_INPUT*/
          ],
        
          on: {
            SPEAK_COMPLETE: [
      
              {
                // If the user says "help", move to "AskForWho"
                guard: ({ context }) => {
                  const spokenReply = context.reply?.[0]?.utterance;
                  return typeof spokenReply === "string" && spokenReply.toLowerCase() === "stop";
                },
                target: "#DM.UserArchetype",
              },

              // in-grammar approach
              {
                guard: ({ context }) => {
                  const spokenReply = context.reply?.[0]?.utterance;
              
                  // Ensure spokenReply is a valid string and in grammar
                  if (typeof spokenReply === "string" && isInGrammar(spokenReply)) {
                    const reply = getReply(spokenReply);
                    return reply === "yes" || reply === "no"; // Allow only valid responses
                  }
                  return false; // Block invalid inputs
                },
                target: "AskForWhen", // Default target (will be overridden in the transition array)
              },
              {
                guard: ({ context }) => {
                  const spokenReply = context.reply?.[0]?.utterance;
                  return typeof spokenReply === "string" && isInGrammar(spokenReply) && getReply(spokenReply) === "no";
                },
                target: "#DM.UserArchetype"
              },
              
              // top-intent
              {
                guard: ({ context }) => {
                  const intents = context.interpretation?.intents;
                  if (!intents || intents.length === 0) return false;
              
                  // Find the top intent with the highest confidence score
                  const topIntent = intents.reduce((prev, current) => 
                    (prev.confidenceScore > current.confidenceScore ? prev : current)
                  );
              
                  // Ensure topIntent exists, has high confidence, and is "ReplyYes"
                  return topIntent?.confidenceScore > 0.80 && topIntent.category === "ReplyYes";
                },
                target: "AskForWhen"
              },
              {
                guard: ({ context }) => {
                  const intents = context.interpretation?.intents;
                  if (!intents || intents.length === 0) return false;
              
                  // Find the top intent with the highest confidence score
                  const topIntent = intents.reduce((prev, current) => 
                    (prev.confidenceScore > current.confidenceScore ? prev : current)
                  );
              
                  // Ensure topIntent exists, has high confidence, and is "ReplyNo"
                  return topIntent?.confidenceScore > 0.80 && topIntent.category === "ReplyNo";
                },
                target: "#DM.UserArchetype"
              },

              { target: "TravelAgain" }, // 🔄 Go back if not in GrammarEntry
            ],
          },
        },


        UserArchetype: {
          entry: [
            () => console.log("🟢 Entered user archetype state."),
        
            // HTML part
            ({ context }) => {
            // Ensure correct extraction of values
            const spokenPerson =
            typeof context.person === "string"
              ? context.person.toLowerCase().trim()
              : context.person?.[0]?.utterance?.toLowerCase().trim() || context.person?.text || "unknown";
      
          console.log(`👤 Recognized spoken person: "${spokenPerson}"`);
      
          const spokenTime =
            typeof context.time === "string"
              ? context.time.toLowerCase().trim()
              : context.time?.[0]?.utterance?.toLowerCase().trim() || context.time?.text || "unknown";
      
          console.log(`⏱️ Recognized time: "${getTime(spokenTime)}"`);
      
          const spokenSpace =
            typeof context.space === "string"
              ? context.space.toLowerCase().trim()
              : context.space?.[0]?.utterance?.toLowerCase().trim() || context.space?.text || "unknown";
      
          console.log(`🌎 Recognized space: "${getSpace(spokenSpace)}"`);
        
              // Ensure correct extraction of message (check if message is available)
              const spokenMessage = context.message?.[0]?.utterance || null; // Default to "null"
              console.log("📩 Message from the previous time traveler:", spokenMessage);
        
              // Determine background based on recognized space
              let background;
              switch (spokenSpace) {
                // Example case: you can add more cases as needed
                default:
                  background = "/user_archetype.gif"; // User archetype background
              }
              console.log(`🎭 Setting background to: ${background}`);
              document.body.style.backgroundImage = `url("${background}")`;
        
              // 🛠 ✅ **Fix: Directly store values in `context`**
              context.spokenPerson = spokenPerson;
              context.spokenTime = spokenTime;
              context.spokenSpace = spokenSpace;
              context.spokenMessage = spokenMessage; // Store the message in context as well
            },
        
            // Speak action using the updated context
            {
              type: "spst.speak", 
              params: ({ context }) => {
                const result = findHighestArchetype();
                console.log(`🏆 Highest Archetype: ${result.highestArchetype}`);
                console.log(`📖 Description: ${result.highestDescription}`);

                            // Ensure correct extraction of values
                const spokenPerson =
                  typeof context.person === "string"
                    ? context.person.toLowerCase().trim()
                    : context.person?.[0]?.utterance?.toLowerCase().trim() || context.person?.text || "unknown";
        
                const spokenTime =
                  typeof context.time === "string"
                    ? context.time.toLowerCase().trim()
                    : context.time?.[0]?.utterance?.toLowerCase().trim() || context.time?.text || "unknown";
            
                const spokenSpace =
                  typeof context.space === "string"
                    ? context.space.toLowerCase().trim()
                    : context.space?.[0]?.utterance?.toLowerCase().trim() || context.space?.text || "unknown";
        
                // Use context.spokenMessage in the response
                return {
                  utterance: `
                    <prosody rate="-40%" volume="+20%" pitch="-8%">
                      Okay ${spokenPerson}. I’m going to tell you something about your inner soul. 
                      <break time="500ms" /> 
                      I think you are ${result.highestArchetype}. 
                      <break time="700ms" />
                      ${result.highestDescription} 
                      <break time="600ms" />
                      ${
                        context.spokenMessage
                          ? `I have a message for you ${result.highestArchetype}. Listen. <break time="600ms" /> ${context.spokenMessage} <break time="800ms" />`
                          : ""
                      }
                      ${result.highestArchetype} Now, it's time.
                    </prosody>
                  `,
                };
              }
            }
          ],
        
          meta: { view: "UserArchetype" },
          on: { SPEAK_COMPLETE: "Ending" },
        },


        /* ENDING */
        Ending: {

          entry: {
            type: "spst.speak",
            params: ({ context }) => {
              // Ensure correct extraction of values
              const spokenPerson =
                typeof context.person === "string"
                  ? context.person.toLowerCase().trim()
                  : context.person?.[0]?.utterance?.toLowerCase().trim() || 
                    context.person?.text || 
                    "unknown";
        
              console.log(`👤 Recognized spoken person: "${spokenPerson}"`);
        
              return {
                utterance: `${spokenPerson}, do you want to leave a message for the next time traveler? If yes, say your message, otherwise just say no.`,
              };
            },
          },
          on: { SPEAK_COMPLETE: "EndingListen" },

        },

        EndingListen: {
          initial: "Ask",
          entry: [
            () => console.log("👂 Listening for reply..."),
            { type: "spst.listen"}
          ],

          context: {
            noInputCount: 0  // Re-Initialize no-input counter
          },

          on: {
            LISTEN_COMPLETE: [
 
              {
                target: "CheckGrammarEnding",
                guard: ({ context }) => !!context.message,
              },
              {
                target: "#DM.GoodbyeEnding",
                guard: ({ context }) => {
                  const stopIntent = context.interpretation?.intents?.find(
                    intent => intent.category === "Stop"
                  );
                  const isStopIntent = stopIntent && stopIntent.confidenceScore > 0.80;
                  const isStopUtterance = context.message?.[0]?.utterance?.toLowerCase() === "stop";
              
                  return isStopUtterance || isStopIntent;
                },
              },
              {
                target: "CheckGrammarEnding",
                guard: ({ context }) => !!context.reply,
              },
              { target: ".NoInput" },
            ],
          },

        states: {

            Ask: {
              entry: [
                () => console.log("🔊 Listening for reply..."),
                { type: "spst.listen" },
                ({ context }) => {
                  if (context.noInputCount === undefined) {
                    context.noInputCount = 0; // Ensure it's initialized to 0
                  }
                  console.log(`⚠️ NoInput detected: Attempt ${context.noInputCount + 1}`);
                },
              ],
              on: {
                RECOGNISED: {
                  actions: assign(({ event }) => {
                    console.log("🎤 ASR recognized:", event);  // Log ASR recognition
                    console.log(`📩 Recognised message: ${event.value}`);
              
                    return {
                      reply: event.value,
                      message: event.value, // To check. this could create conflict
                      interpretation: event.nluValue
                    };
                  }),
                },

                ASR_NOINPUT: {
                  actions: assign({ 
                    message: null, 
                    reply: null 
                  })
                },
                ASR_STOP: {
                  actions: () => console.log("⚠️ ASR STOP received - possibly prematurely."),
                },
              },
            },
            
            NoInput: {
              entry: [
                ({ context }) => {
                  if (context.noInputCount === undefined) {
                    context.noInputCount = 0; // Ensure it's initialized to 0
                  }
                  console.log(`⚠️ NoInput detected: Attempt ${context.noInputCount + 1}`);
                },
             
                {
                  type: "spst.speak",
                  params: ({ context }) => {
                    if (context.noInputCount === 0) {  // First no-input case
                      return { utterance: "Do you want to leave a message for the next time traveler? If yes, say your message otherwise just say goodbye" };
                    } else if (context.noInputCount === 1) {  // Second no-input case
                      return { utterance: "Say your message or say goodbye." };
                    } else {  // Third no-input case
                      return { utterance: "I couldn't understand. Let's stop here." };
                    }
                  }
                },
                assign(({ context }) => ({
                  noInputCount: context.noInputCount + 1  // Increase AFTER speaking
                }))
              ],
              on: {
                SPEAK_COMPLETE: [
                  { target: "Ask",
                    guard: ({ context }) => context.noInputCount < 3  // Only retry if attempts < 3  // VERY IMPORTANT CONDITION. OTHERWISE IT DOESN'T STOP AFTER ATTEMPT 3.
                  },  // Retry listening if not exceeded max attempts
                  
                  {
                    target: "#DM.GoodbyeEnding",  // Exit after 3 no-inputs
                    guard: ({ context }) => context.noInputCount >= 3  
                  },
                  
                ]
              }
            },


          },
        },



        CheckGrammarEnding: {   
          entry: [
            ({ context }) => {
              const spokenMessage = context.message?.[0]?.utterance?.toLowerCase() || null; 
              console.log(`🔍 You just said: ${spokenMessage}`);
              
              // Ensure spokenMessage is NULL when "goodbye" or "no" is spoken
              context.spokenMessage = (spokenMessage === "goodbye" || spokenMessage === "no") 
                ? null 
                : context.message?.[0]?.utterance?.toLowerCase() || "no message"; // Safely assign based on conditions
              
              console.log(`✅ Assigned spokenMessage: ${context.spokenMessage}`);
              
              const inGrammar = isInGrammar(spokenMessage);
              console.log(`✅ Is "${spokenMessage}" in grammar? ${inGrammar ? "Yes" : "No"}`);
              
              
              const spokenReply = context.reply?.[0]?.utterance;
              
            },
        
            {
              type: "spst.speak",
              params: ({ context }) => {

                const spokenMessage = context.message?.[0]?.utterance?.toLowerCase() || null;
                console.log(`📩 Updated message for the next time traveler: ${spokenMessage}`);

                const spokenPerson =
                  typeof context.person === "string"
                    ? context.person.toLowerCase().trim()
                    : context.person?.[0]?.utterance?.toLowerCase().trim() || 
                      context.person?.text || 
                      "unknown";
          
                console.log(`👤 Recognized spoken person: "${spokenPerson}"`);

                const spokenReply = context.reply?.[0]?.utterance;


                
  
                // Extract the intents array from context
                const intents = context.interpretation?.intents;
                // Find the top intent with the highest confidence score
                const topIntent = intents?.reduce((prev, current) => 
                  (prev.confidenceScore > current.confidenceScore ? prev : current), 
                  {}
                );
            
                // Define the valid replies
                const validReply = ["ReplyNo"];
                // Check if topIntent exists and has a confidence score above 0.80 and the category matches one of the valid answers
                const isTopIntent = topIntent && topIntent.confidenceScore > 0.80 && validReply.includes(topIntent.category);
            
                // Log the details
                console.log(`🚀 topIntent: ${topIntent ? topIntent.category : "N/A"} with confidence score: ${isTopIntent ? topIntent.confidenceScore : "N/A"}`);

                // 🚀 If spokenMessage or spokenReply indicate an exit, transition to GoodbyeEnding
                if (
                  !spokenMessage || 
                  spokenMessage === "goodbye" || 
                  spokenMessage === "no" || 
                  spokenReply === "goodbye" || 
                  spokenReply === 0
                ) {
                  return {
                    utterance: `Okay ${spokenPerson}.`,
                    nextState: "#DM.GoodbyeEnding",
                  };
                }

   
          
            
                /// 😊 The user says exactly the reply that is stored in the grammar
                if (isInGrammar(spokenReply) || isInGrammar(spokenMessage)) {
                  const reply = getReply(spokenReply) || getReply(spokenMessage);
                  
                  if (reply === "no") {
                    return {
                      nextState: "#DM.GoodbyeEnding",
                      utterance: `Okay ${spokenPerson}.`,
                    };
                  }
                }

                 /// 🚀 If spokenMessage or spokenReply is null, assume the user wants to exit
                  if (!spokenMessage || !spokenReply || spokenMessage === "goodbye" || spokenMessage === "no" || spokenReply === "goodbye" || spokenReply === "no") {
                    return {
                      utterance: `Okay ${spokenPerson}.`,
                      nextState: "#DM.GoodbyeEnding",
                    };
                  }

      
            
                // 🚀 Logic when topIntent has high confidence
                if (isTopIntent) {
                  context.reply = topIntent.category.toLowerCase();
                  context.message = topIntent.category.toLowerCase();

                  if (topIntent.category === "ReplyNo") {
                    return {
                      nextState: "#DM.GoodbyeEnding",
                      utterance: `${context.reply}. Okay ${spokenPerson}.`,
                    };
                  }
                }

                // 🛑 Stop case! Now also checks context.message
                if (
                  context.reply?.[0]?.utterance?.toLowerCase() === "stop" || 
                  context.message?.[0]?.utterance?.toLowerCase() === "stop"
                ) {
                  return {
                    utterance: "Okay.",
                    nextState: "#DM.GoodbyeEnding"
                  };
                }
            
                // 🔮 Guess case
                if (isTopIntent && topIntent.confidenceScore > 0.70) {
                  if (topIntent.category === "ReplyNo") {
                    return {
                      nextState: "#DM.GoodbyeEnding",
                      utterance: `${context.reply}. Okay ${spokenPerson}.`,
                    };
                  }
                }

                // ✅ If spokenMessage or spokenReply is not null, go to ConfirmationEnding
                if (spokenMessage || spokenReply) {
                  return {
                    nextState: "ConfirmationEnding",
                    utterance: `Understood, ${spokenPerson}. Your message is ${spokenMessage || spokenReply}.`,
                  };
                }
            
                // ❌ Out-of-grammar case
                return {
                  utterance: "I didn't get you.",
                  nextState: "Ending",
                };
              },
            },
            assign({ noInputCount: 0 })  // Reset noInputCount to zero /*FIX_NO_INPUT*/
          ],
        
          on: {
            SPEAK_COMPLETE: [


   
              {
                // If the user says "help", move to "AskForWho"
                guard: ({ context }) => {
                  const spokenReply = context.reply?.[0]?.utterance;
                  return typeof spokenReply === "string" && spokenReply.toLowerCase() === "stop";
                },
                target: "#DM.GoodbyeEnding",
              },
              
              {
                guard: ({ context }) => {
                  return context.spokenMessage === "goodbye" || context.spokenMessage === "no";
                },
                target: "#DM.GoodbyeEnding",
              },

              {
                guard: ({ context }) => {
                  return !!context.spokenMessage && context.spokenMessage !== "goodbye" && context.spokenMessage !== "no";
                },
                target: "ConfirmationEnding",
              },

              // in-grammar approach
              {
                guard: ({ context }) => {
                  const spokenReply = context.reply?.[0]?.utterance;
              
                  // Ensure spokenReply is a valid string and in grammar
                  if (typeof spokenReply === "string" && isInGrammar(spokenReply)) {
                    const reply = getReply(spokenReply);
                    return reply === "no"; // Allow only valid responses
                  }
                  return false; // Block invalid inputs
                },
                target: "#DM.GoodbyeEnding", // Default target (will be overridden in the transition array)
              },
      
              
              // top-intent
              {
                guard: ({ context }) => {
                  const intents = context.interpretation?.intents;
                  if (!intents || intents.length === 0) return false;
              
                  // Find the top intent with the highest confidence score
                  const topIntent = intents.reduce((prev, current) => 
                    (prev.confidenceScore > current.confidenceScore ? prev : current)
                  );
              
                  // Ensure topIntent exists, has high confidence, and is "ReplyNo"
                  return topIntent?.confidenceScore > 0.80 && topIntent.category === "ReplyNo";
                },
                target: "#DM.GoodbyeEnding"
              },

              // ✅ If spokenMessage is not null, go to ConfirmationEnding
              {
                guard: ({ context }) => !!context.spokenMessage,
                target: "ConfirmationEnding", // ✅ Ensure transition happens
              },
              { 
                target: "Ending",
                guard: ({ context }) => !context.spokenMessage, 
              }
            ],
          },
        },


       

        /* CONFIRMATION ENDING */
        ConfirmationEnding: {

          entry: {
            type: "spst.speak",
            params: ({ context }) => ({
            
              
              utterance: `Is that correct?`,


            }),
          },
          on: { SPEAK_COMPLETE: "ConfirmationEndingListen" },
        },
        


        
        ConfirmationEndingListen: {
          initial: "Ask",
          entry: [
            () => console.log("👂 Listening for reply..."),
            { type: "spst.listen"}
          ],

          context: {
            noInputCount: 0  // Re-Initialize no-input counter
          },

          on: {
            LISTEN_COMPLETE: [
              {
                target: "CheckGrammarConfirmationEnding",
                guard: ({ context }) => !!context.reply,
              },
              { target: ".NoInput" },
              {
                target: "#DM.GoodbyeEnding",
                guard: ({ context }) => {
                  const stopIntent = context.interpretation?.intents?.find(
                    intent => intent.category === "Stop"
                  );
                  const isStopIntent = stopIntent && stopIntent.confidenceScore > 0.80;
                  const isStopUtterance = context.reply?.[0]?.utterance?.toLowerCase() === "stop";
              
                  return isStopUtterance || isStopIntent;
                },
              },
            ],
          },

        states: {

            Ask: {
              entry: [
                () => console.log("🔊 Listening for reply..."),
                { type: "spst.listen" },
                ({ context }) => {
                  if (context.noInputCount === undefined) {
                    context.noInputCount = 0; // Ensure it's initialized to 0
                  }
                  console.log(`⚠️ NoInput detected: Attempt ${context.noInputCount + 1}`);
                },
              ],
              on: {
                RECOGNISED: {
                  actions: assign(({ event }) => {
                    console.log("🎤 ASR recognized:", event);  // Log ASR recognition
                    return {
                      reply: event.value,
                      interpretation: event.nluValue
                    };
                  }),
                },

                ASR_NOINPUT: {
                    actions: assign({ reply: null }),
                },
                ASR_STOP: {
                  actions: () => console.log("⚠️ ASR STOP received - possibly prematurely."),
                },
              },
            },
            
            NoInput: {
              entry: [
                ({ context }) => {
                  if (context.noInputCount === undefined) {
                    context.noInputCount = 0; // Ensure it's initialized to 0
                  }
                  console.log(`⚠️ NoInput detected: Attempt ${context.noInputCount + 1}`);
                },
             
                {
                  type: "spst.speak",
                  params: ({ context }) => {
                    if (context.noInputCount === 0) {  // First no-input case
                      return { utterance: "Your message is that correct? Say no if you want to change it otherwise say yes." };
                    } else if (context.noInputCount === 1) {  // Second no-input case
                      return { utterance: "Is that correct? Say yes or no." };
                    } else {  // Third no-input case
                      return { utterance: "I suppose is correct." };
                    }
                  }
                },
                assign(({ context }) => ({
                  noInputCount: context.noInputCount + 1  // Increase AFTER speaking
                }))
              ],
              on: {
                SPEAK_COMPLETE: [
                  { target: "Ask",
                    guard: ({ context }) => context.noInputCount < 3  // Only retry if attempts < 3  // VERY IMPORTANT CONDITION. OTHERWISE IT DOESN'T STOP AFTER ATTEMPT 3.
                  },  // Retry listening if not exceeded max attempts
                  
                  {
                    target: "#DM.GoodbyeEnding",  // Exit after 3 no-inputs
                    guard: ({ context }) => context.noInputCount >= 3  
                  },
                  
                ]
              }
            },


          },
        },

       

        CheckGrammarConfirmationEnding: {
          entry: [
            ({ context }) => {
              const spokenReply = context.reply?.[0]?.utterance?.toLowerCase() || "unknown"; // Safe access & lowercase
              const inGrammar = isInGrammar(spokenReply);
              console.log(`✅ Is "${spokenReply}" in grammar? ${inGrammar ? "Yes" : "No"}`);
              console.log("Current reply:", spokenReply);
            },
            
            {
              type: "spst.speak",
              params: ({ context }) => {
                const spokenReply = context.reply?.[0]?.utterance?.toLowerCase() || "unknown";
                const spokenPerson =
                typeof context.person === "string"
                  ? context.person.toLowerCase().trim()
                  : context.person?.[0]?.utterance?.toLowerCase().trim() || 
                    context.person?.text || 
                    "unknown";
        
                console.log(`👤 Recognized spoken person: "${spokenPerson}"`);


                // Extract the intents array from context
                const intents = context.interpretation?.intents;
                console.log("Detected intents:", intents);
                
                const topIntent = intents?.reduce((prev, current) => 
                  (prev.confidenceScore > current.confidenceScore ? prev : current), 
                  {}
                );
                console.log("Top intent:", topIntent);
        
                const validReply = ["ReplyYes", "ReplyNo", "Stop"];
                const isTopIntent = topIntent && topIntent.confidenceScore > 0.80 && validReply.includes(topIntent.category);
                console.log(`Top Intent Confidence: ${topIntent?.confidenceScore}, Category: ${topIntent?.category}`);
        
                // Process replies if they're in grammar
                if (isInGrammar(spokenReply)) {
                  const reply = getReply(spokenReply);
                  
                  if (reply === "yes") {
                    console.log("Detected 'yes' reply.");
                    return {
                      nextState: "#DM.GoodbyeEnding", 
                      utterance: `Okay. ${spokenPerson}.`,
                    };
                  } else if (reply === "no") {
                    console.log("Detected 'no' reply.");
                    return {
                      nextState: "#DM.Ending",
                      utterance: `Okay. ${spokenPerson}.`,
                    };
                  } else if (reply === "goodbye") {
                    console.log("Detected 'no' reply.");
                    return {
                      nextState: "#DM.GoodbyeEnding",
                      utterance: `Okay. ${spokenPerson}.`,
                    };
                  }
                  
                }
        
                // Top-intent handling
                if (isTopIntent) {
                  context.reply = topIntent.category.toLowerCase();
                  console.log(`Top Intent matched: ${topIntent.category}`);
                  
                  if (topIntent.category === "ReplyYes") {
                    console.log("ReplyYes intent matched.");
                    return {
                      nextState: "#DM.GoodbyeEnding", 
                      utterance: `Okay. ${spokenPerson}.`,
                    };
                  } else if (topIntent.category === "ReplyNo") {
                    console.log("ReplyNo intent matched.");
                    return {
                      nextState: "#DM.Ending",
                      utterance: `Okay. ${spokenPerson}.`,
                    };
                  } else if (topIntent.category === "Stop") {
                    console.log("Stop intent matched.");
                    return {
                      nextState: "#DM.GoodbyeEnding",
                      utterance: `Okay. ${spokenPerson}.`,
                    };
                  }
                }
        
                // Stop case - early exit if "stop" is detected
                if (context.reply?.[0]?.utterance?.toLowerCase() === "stop") {
                  console.log("Stop detected, exiting.");
                  return {
                    utterance: "",
                    nextState: "#DM.GoodbyeEnding",
                  };
                }
        
                // Handle out-of-grammar case as last resort
                console.log("Falling back to out-of-grammar case.");
                return {
                  utterance: "I didn't get you.",
                  nextState: "ConfirmationEnding",
                };
              },
            },
            assign({ noInputCount: 0 }) // Reset noInputCount to zero
          ],
          on: {
            SPEAK_COMPLETE: [
              {
                guard: ({ context }) => {
                  const spokenReply = context.reply?.[0]?.utterance;
                  return typeof spokenReply === "string" && spokenReply.toLowerCase() === "stop";
                },
                target: "#DM.GoodbyeEnding",
              },
        
              {
                guard: ({ context }) => {
                  const spokenReply = context.reply?.[0]?.utterance;
        
                  // Ensure spokenReply is a valid string and in grammar
                  if (typeof spokenReply === "string" && isInGrammar(spokenReply)) {
                    const reply = getReply(spokenReply);
                    return reply === "yes"; // Allow only valid responses
                  }
                  return false; // Block invalid inputs
                },
                target: "#DM.GoodbyeEnding", // Default target
              },

              {
                guard: ({ context }) => {
                  const spokenReply = context.reply?.[0]?.utterance;
        
                  // Ensure spokenReply is a valid string and in grammar
                  if (typeof spokenReply === "string" && isInGrammar(spokenReply)) {
                    const reply = getReply(spokenReply);
                    return reply === "goodbye"; // Allow only valid responses
                  }
                  return false; // Block invalid inputs
                },
                target: "#DM.GoodbyeEnding", // Default target
              },
        
              {
                guard: ({ context }) => {
                  const spokenReply = context.reply?.[0]?.utterance;
                  return typeof spokenReply === "string" && isInGrammar(spokenReply) && getReply(spokenReply) === "no";
                },
                target: "#DM.Ending"
              },
        
              // Top-intent handling
              {
                guard: ({ context }) => {
                  const intents = context.interpretation?.intents;
                  if (!intents || intents.length === 0) return false;
        
                  const topIntent = intents.reduce((prev, current) => 
                    (prev.confidenceScore > current.confidenceScore ? prev : current)
                  );
        
                  return topIntent?.confidenceScore > 0.80 && topIntent.category === "ReplyYes";
                },
                target: "#DM.GoodbyeEnding",
              },

              {
                guard: ({ context }) => {
                  const intents = context.interpretation?.intents;
                  if (!intents || intents.length === 0) return false;
        
                  const topIntent = intents.reduce((prev, current) => 
                    (prev.confidenceScore > current.confidenceScore ? prev : current)
                  );
        
                  return topIntent?.confidenceScore > 0.80 && topIntent.category.toLowerCase() === "stop";
                },
                target: "#DM.GoodbyeEnding",
              },
        
              {
                guard: ({ context }) => {
                  const intents = context.interpretation?.intents;
                  if (!intents || intents.length === 0) return false;
        
                  const topIntent = intents.reduce((prev, current) => 
                    (prev.confidenceScore > current.confidenceScore ? prev : current)
                  );
        
                  return topIntent?.confidenceScore > 0.80 && topIntent.category === "ReplyNo";
                },
                target: "#DM.Ending",
              },
        
              { target: "ConfirmationEnding" }, // Go back if not in GrammarEntry
            ],
          },
        },

        GoodbyeEnding: {
          entry: [
            () => console.log("🟢 Goodbye Ending."),
            {
              type: "spst.speak",
              params: ({ context }) => {
                // Safely retrieve the message and handle undefined/null values
                const spokenMessage = context.message?.[0]?.utterance || "no message"; // Fallback if null or undefined
                console.log("📩 Updated message for the next time traveler:", spokenMessage);
                
                const spokenPerson =
                typeof context.person === "string"
                  ? context.person.toLowerCase().trim()
                  : context.person?.[0]?.utterance?.toLowerCase().trim() || 
                    context.person?.text || 
                    "unknown";
        
              console.log(`👤 Recognized spoken person: "${spokenPerson}"`);
        
                // Ensure the utterance doesn't attempt to use null/undefined
                const utterance = `${getPerson(spokenPerson)}. Now, it’s time to go back to your world. Farewell.`;
                
                console.log("🗣️ Final utterance:", utterance);
                
                return { utterance };
              },
            },
          ],
          on: { SPEAK_COMPLETE: "Done" },
        },

        /* DONE */
        Done: {
          on: {
            CLICK: "Greeting",
          },
        },


  },
});





const dmActor = createActor(dmMachine, {
  inspect: inspector.inspect,
}).start();

dmActor.subscribe((state) => {
  console.group("State update");
  console.log("State value:", state.value);
  console.log("State context:", state.context);
  console.groupEnd();
});

const spstActor = createActor(speechstate, {
  input: settings,
}).start();

spstActor.subscribe((snapshot) => {
  if (snapshot.event.type === "UPDATE_SETTINGS") {
    console.log("🛠 Updated settings:", snapshot.event.settings);
    spstActor.send({
      type: "UPDATE_SETTINGS",
      settings: snapshot.event.settings,
    });
  }
});


export function setupButton(element: HTMLButtonElement) {
  element.addEventListener("click", () => {
    dmActor.send({ type: "CLICK" });
  });

  dmActor.subscribe((snapshot) => {
    // Access the metadata from the snapshot
    const meta: { view?: string } = Object.values(
      snapshot.context.spstRef.getSnapshot().getMeta(),
    )[0] || {}; // Default to an empty object if undefined

    // Log the meta object and the 'view' value
    console.log("Snapshot meta:", meta);

    // Use 'idle' as the fallback value if meta.view is undefined
    const view = meta.view === 'idle' ? "Begin your journey through the time." : meta.view || "Begin your journey through the time.";

    // Log the final view value
    console.log("Button text:", view);

    // Update the button's inner HTML
    element.innerHTML = view;

    
  });




  
}





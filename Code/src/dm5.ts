import { assign, createActor, setup } from "xstate";
import { Settings, speechstate } from "speechstate";
import { createBrowserInspector } from "@statelyai/inspect";
import { KEY } from "./azure";
import { NLU_KEY } from "./azure";
import { DMContext, DMEvents } from "./types";

const inspector = createBrowserInspector();

const azureCredentials = {
  endpoint:
    "https://northeurope.api.cognitive.microsoft.com/sts/v1.0/issuetoken",
  key: KEY,
};

const azureLanguageCredentials = {
  endpoint: "https://timetraveler.cognitiveservices.azure.com/language/:analyze-conversations?api-version=2024-11-15-preview", /** your Azure CLU prediction URL */
  key: NLU_KEY, /** reference to your Azure CLU key - you will find it in azure.ts */
  deploymentName: "appointment", /** your Azure CLU deployment */
  projectName: "the_time_traveler", /** your Azure CLU project name */
};

const settings: Settings = {
  azureLanguageCredentials: azureLanguageCredentials /** global activation of NLU */,
  azureCredentials: azureCredentials,
  azureRegion: "northeurope",
  asrDefaultCompleteTimeout: 0,
  asrDefaultNoInputTimeout: 5000,
  locale: "en-US",
  ttsDefaultVoice: "en-US-AvaMultilingualNeural", //"en-US-DavisNeural"
  //en-US-AvaMultilingualNeural copied from SSML https://speech.microsoft.com/portal/8032a881d1714f93a1097e4d35d8b4a6/audiocontentcreation/folder/602a3e1e-7257-4721-8111-009550c308f6/file/aff29c34-c355-429d-9b7e-3b8bb07db2af
};

interface GrammarEntry {
  person?: string;
  day?: string;
  // confirmation?: string;
  // negation?: string;
  wholeDay?: string;
  time?: string;
  interpretation?: string;
  yes?: string;
  no?: string;
}




const grammar: { [index: string]: GrammarEntry } = {

  // People
  vlad: { person: "Vladislav Maraev" },
  aya: { person: "Nayat Astaiza Soriano" },
  victoria: { person: "Victoria Daniilidou" },
  marco: { person: "Marco Leali"},

  // // Interpretaion
  "harry potter": { person: "He is a famous magician who defeated Lord Voldemort."},
  "harry": { person: "He is a famous magician who defeated Lord Voldemort."},
  "potter": { person: "He is a famous magician who defeated Lord Voldemort."},

  "taylor swift": { person: "She is a famous singer from the United States."},
  "taylor": { person: "She is a famous singer from the United States."},
  "swift": { person: "She is a famous singer from the United States."},

  "spiderman": { person: "He is Peter Parker."},
  "shrek": { person: "He is green ogre whose fearsome appearance belies a kind heart."},
  "albert einstain": { person: "He was a famous scientist."},
  "donald trump": { person: "He is the president of the United States."},
  "elon mask": { person: "He is the inventor of Tesla."},
  "the explorer": { person: "He is Julien."},
  "that mesmerizing guy": { person: "He is Menzi Idol."},
  "billy": { person: "He is the villain of the story."},

  // "hello world": { person: "Marco Leali"}, // Pay attention! You have to write everything in lowercase otherwise the function will not work properly
  
  // Days
  monday: { day: "Monday" },
  "on monday": { day: "Monday" },  // ✅ Synonym
  tuesday: { day: "Tuesday" },
  "on tuesday": { day: "Tuesday" }, // ✅ Synonym
  wednesday: { day: "Wednesday" },
  "on wednesday": { day: "Wednesday" }, // ✅ Synonym
  thursday: { day: "Thursday" },
  "on thursday": { day: "Thursday" }, // ✅ Synonym
  friday: { day: "Friday" },
  "on friday": { day: "Friday" }, // ✅ Synonym
  saturday: { day: "Saturday" },
  "on saturday": { day: "Saturday" }, // ✅ Synonym
  sunday: { day: "Sunday" },
  "on sunday": { day: "Sunday" }, // ✅ Synonym

  // Times 
  "0": { time: "00:00" }, 
  "at 0": { time: "00:00" },
  
  "midnight": { time: "00:00" },
  "at midnight": { time: "00:00" },
  
  "1": { time: "1 AM" }, 
  "at 1": { time: "1 AM" },
  
  "2": { time: "2 AM" },
  "at 2": { time: "2 AM" },
  
  "3": { time: "3 AM" },
  "at 3": { time: "3 AM" },
  
  "4": { time: "4 AM" },
  "at 4": { time: "4 AM" },
  
  "5": { time: "5 AM" },
  "at 5": { time: "5 AM" },
  
  "6": { time: "6 AM" },
  "at 6": { time: "6 AM" },
 
  "7": { time: "7 AM" },
  "at 7": { time: "7 AM" },

  "8": { time: "8 AM" },
  "at 8": { time: "8 AM" },

  "9": { time: "9 AM" },
  "at 9": { time: "9 AM" },

  "10": { time: "10 AM" },
  "at 10": { time: "10 AM" },

  "11": { time: "11 AM" },
  "at 11": { time: "11 AM" },

  "12": { time: "12 PM" },
  "at 12": { time: "12 PM" },

  "noon": { time: "12 PM" },
  "at noon": { time: "12 PM" },

  "13": { time: "1 PM" },
  "at 13": { time: "1 PM" },

  "14": { time: "2 PM" },
  "at 14": { time: "2 PM" },

  "15": { time: "3 PM" },
  "at 15": { time: "3 PM" },

  "16": { time: "4 PM" },
  "at 16": { time: "4 PM" },

  "17": { time: "5 PM" },
  "at 17": { time: "5 PM" },

  "18": { time: "6 PM" },
  "at 18": { time: "6 PM" },

  "19": { time: "7 PM" },
  "at 19": { time: "7 PM" },

  "20": { time: "8 PM" },
  "at 20": { time: "8 PM" },

  "21": { time: "9 PM" },
  "at 21": { time: "9 PM" },

  "22": { time: "10 PM" },
  "at 22": { time: "10 PM" },

  "23": { time: "11 PM" },
  "at 23": { time: "11 PM" },

  "24": { time: "12 AM" },
  "at 24": { time: "12 AM" },

  "midnight": { time: "12 AM" },
  "at midnight": { time: "12 AM" },

  "0:30": { time: "00:30" },
  "at 0:30": { time: "00:30" },

  "1:30": { time: "01:30" },
  "at 1:30": { time: "01:30" },

  "2:30": { time: "02:30" }, 
  "at 2:30": { time: "02:30" },

  "3:30": { time: "03:30" }, 
  "at 3:30": { time: "03:30" },

  "4:30": { time: "04:30" },
  "at 4:30": { time: "04:30" },

  "5:30": { time: "05:30" },
  "at 5:30": { time: "05:30" },

  "6:30": { time: "06:30" },
  "at 6:30": { time: "06:30" },

  "7:30": { time: "07:30" },
  "at 7:30": { time: "07:30" },

  "8:30": { time: "08:30" },
  "at 8:30": { time: "08:30" },

  "9:30": { time: "09:30" },
  "at 9:30": { time: "09:30" },

  "10:30": { time: "10:30" },
  "at 10:30": { time: "10:30" },

  "11:30": { time: "11:30" },
  "at 11:30": { time: "11:30" },

  "12:30": { time: "12:30" },
  "at 12:30": { time: "12:30" },

  "13:30": { time: "13:30" },
  "at 13:30": { time: "13:30" },

  "14:30": { time: "14:30" },
  "at 14:30": { time: "14:30" },

  "15:30": { time: "15:30" },
  "at 15:30": { time: "15:30" },

  "16:30": { time: "16:30" },
  "at 16:30": { time: "16:30" },

  "17:30": { time: "17:30" },
  "at 17:30": { time: "17:30" },

  "18:30": { time: "18:30" },
  "at 18:30": { time: "18:30" },

  "19:30": { time: "19:30" },
  "at 19:30": { time: "19:30" },

  "20:30": { time: "20:30" },
  "at 20:30": { time: "20:30" },

  "21:30": { time: "21:30" },
  "at 21:30": { time: "21:30" },

  "22:30": { time: "22:30" },
  "at 22:30": { time: "22:30" },

  "23:30": { time: "23:30" },
  "at 23:30": { time: "23:30" },

    


  "yes": { yes: "yes" }, 
  "of course": { yes: "yes" }, 
  "for sure": { yes: "yes" },
  
  "no": { no: "no" }, 
  "no way": { no: "no" }, 
  "absolutely not": { no: "no" },

};



function isInGrammar(utterance: string) {
  return utterance.toLowerCase() in grammar;
}

function getPerson(utterance: string) {
  return (grammar[utterance.toLowerCase()] || {}).person; 
}





const dmMachine = setup({

  types: {
    /** you might need to extend these */
    context: {} as DMContext,
    events: {} as DMEvents,
  },

  actions: {
    /** define your actions here */
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

    "spst.listen": ({ context }) => {
      console.log("👂 Listening...");
      context.spstRef.send({ type: "LISTEN" });
    },

    "spst.listen": ({ context }) =>
      context.spstRef.send({
        type: "LISTEN",
        value: { nlu: true }, /** Local activation of NLU */ /*lab4*/
      }),
  },

}).createMachine({
  context: ({ spawn }) => ({
    spstRef: spawn(speechstate, { input: settings }),
    person: null,
    day: null,
    time: null,
    wholeDay: null,
    interpretation: null,
    yes: null,
    no: null,

  }),
  id: "DM",
  initial: "Prepare",
  states: {

       /* STATE */
       Prepare: {
         entry: ({ context }) => context.spstRef.send({ type: "PREPARE" }),
         on: { ASRTTS_READY: "WaitToStart" },
       },

       /* STATE */
       WaitToStart: {
         on: { CLICK: "Greeting" },
       },


        Greeting: {
          entry: [
            () => console.log("🟢 Entered Greeting state"),
            { type: "spst.speak", params: { utterance: `Hi!` } }
          ],
          on: { SPEAK_COMPLETE: "AskForWho" },
        },


        /* PERSON */

        AskForWho: {
          entry: [
            () => console.log("🟢 Asking for meeting or for person..."),
            { type: "spst.speak", params: { utterance: `Tell me.` } }
          ],
          on: { SPEAK_COMPLETE: "AskForWhoListen" },
        },
        
       

         AskForWhoListen: {
          initial: "Ask",
          entry: [
            () => console.log("👂 Listening for meeting or for person..."),
            { type: "spst.listen" }
          ],
          
          context: {
            noInputCount: 0  // Initialize no-input counter
          },
        
          on: {
            LISTEN_COMPLETE: [
              {
                target: "CheckGrammarPerson",
                guard: ({ context }) => !!context.person,
              },
              { target: ".NoInput" },
              {
                target: "AskForWho",
                guard: ({ context }) => context.person?.[0]?.utterance?.toLowerCase() === "help",
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
                      person: event.value,
                      interpretation: event.nluValue
                    };
                  }),
                },
                // ASR_NOINPUT: { 
                //   target: "NoInput"  // THIS IS WRONG. DON'T DO IT!
                // },  // Handle no-input cases

                ASR_NOINPUT: {
                    actions: assign({ person: null }),
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
                      return { utterance: "I still didn't get that. Can you say it again?" };
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
                    guard: ({ context }) => context.noInputCount < 3  // Only retry if attempts < 3  // VERY IMPORTANT CONDITION. OTHERWISE IT DOESN'T STOP AFTER ATTEMP 3.
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
            { type: "spst.speak", params: { utterance: "Goodbye!" } },
            assign({ noInputCount: 0 })  // Reset noInputCount to zero
          ],
          on: {
            CLICK: "Done",
          },
        },


        CheckGrammarPerson: {
          entry: [
            ({ context }) => {

             

              // lab4
              // Extract entities from recognized context if they exist
              const personEntity = context.interpretation?.entities.find(entity => entity.category === "person");
              const dayEntity = context.interpretation?.entities.find(entity => entity.category === "day");
              const timeEntity = context.interpretation?.entities.find(entity => entity.category === "time");
              // const wholeDayEntity = context.interpretation?.entities.find(entity => entity.category === "wholeDay");

              // Extract top intent
              const topIntent = context.interpretation?.topIntent;
              
              console.log(`👤 Person: ${personEntity?.text || "undefined"}`); // Safe logging
              console.log(`📅 Meeting day: ${dayEntity?.text}`);
              console.log(`⏰ Meeting time: ${timeEntity?.text}`);
              // console.log(`👍 Confirmation/Negation: ${wholeDayEntity?.text}`);
              console.log(`😎 topIntent: ${topIntent}`);

              // lab 5
              // Check if the personEntity is in the grammar
              const inGrammar = personEntity?.text && isInGrammar(personEntity.text);
              console.log(`✅ Is "${personEntity?.text}" in grammar? ${inGrammar ? "Yes" : "No"}`);




              const meetingIntent = context.interpretation?.intents?.find(intent => intent.category === "Create a meeting");
              const isMeetingIntent = meetingIntent && meetingIntent.confidenceScore > 0.80;

              console.log(`📝 Is this a meeting request? ${isMeetingIntent ? "Yes," : "No,"} with confidence score: ${meetingIntent?.confidenceScore || "N/A"}`);
        

              const whoIntent = context.interpretation?.intents?.find(intent => intent.category === "Who is X");
              const isWhoIntent = whoIntent && whoIntent.confidenceScore > 0.80;

              console.log(`👤 Is this a who is request? ${isWhoIntent ? "Yes," : "No,"} with confidence score: ${whoIntent?.confidenceScore || "N/A"}`);
        


            },

        
            

            {

             type: "spst.speak",
             params: ({ context }) => {
              const personEntity = context.interpretation?.entities.find(entity => entity.category === "person");
              const dayEntity = context.interpretation?.entities.find(entity => entity.category === "day");
              const timeEntity = context.interpretation?.entities.find(entity => entity.category === "time");
          
              // Extract top intent and confidence scores
              const meetingIntent = context.interpretation?.intents?.find(intent => intent.category === "Create a meeting");
              const isMeetingIntent = meetingIntent && meetingIntent.confidenceScore > 0.80;
          
              const whoIntent = context.interpretation?.intents?.find(intent => intent.category === "Who is X");
              const isWhoIntent = whoIntent && whoIntent.confidenceScore > 0.80;

              context.previousPerson = personEntity ? personEntity.text : "someone unknown"; // Ensure you store only the text

              // Extract top intent
              const topIntent = context.interpretation?.topIntent;
          
              // 🚀 New utterance logic with confidence threshold handling
              if (isMeetingIntent) {
                return {
                  utterance: "We received your request of appointment. Thank you.",
                  nextState: "Done",  // Transition to "Done" state
                };
              } 
              else if (isWhoIntent) {
                
                const personText = getPerson(context.previousPerson) || "I'm sorry, I don't know that person.";
                return {
                  utterance: personText && personText !== "I'm sorry, I don't know that person."
                    ? `I will tell you more about that person! ${personText}`
                    : "I'm sorry, I don't know that person.",
                  nextState: "Done",  // Transition to "Done" state
                };
              } 

              else if (context.person?.[0]?.utterance?.toLowerCase() === "help") {
                return {
                  utterance: "Let's go back!",
                  nextState: "AskForWho"
                };
              }

              else {
                const message = `${
                  personEntity?.text
                    ? topIntent === "Who is X"
                      ? `You asked for who is ${personEntity.text}.`
                      : topIntent === "Create a meeting"
                        ? `You requested a meeting${personEntity.text ? ` with ${personEntity.text}` : ''}${dayEntity?.text ? ` on ${dayEntity.text}` : ''}${timeEntity?.text ? ` at ${timeEntity.text}` : ''}`.trim()
                      : "I didn't quite understand your request."
                    : topIntent === "Who is X"
                      ? "You asked for who is someone."
                      : topIntent === "Create a meeting"
                        ? "You requested a meeting."
                        : "I didn't quite understand your request."
                }`;
              
                console.log(`🗣 Bot will say: "${message}"`);
              
                return {
                  utterance: message,
                  nextState: message === "I didn't quite understand your request." ? "AskForWho" : undefined,
                };
              }

            },

            },

          


          ],
        
                
          // Inside CheckGrammarPerson state
          on: {
            SPEAK_COMPLETE: [

              {
                // If the user says "help", move to "AskForWho"
                guard: ({ context }) => context.person?.[0]?.utterance?.toLowerCase() === "help",
                target: "AskForWho",
              },

              {
                // If the bot just said "I didn't quite understand your request.", go back to AskForWho
                guard: ({ context }) => {
                  const topIntent = context.interpretation?.topIntent;
                  const personEntity = context.interpretation?.entities.find(entity => entity.category === "person");
                  const dayEntity = context.interpretation?.entities.find(entity => entity.category === "day");
                  const timeEntity = context.interpretation?.entities.find(entity => entity.category === "time");
          
                  const message = `${
                    personEntity?.text
                      ? topIntent === "Who is X"
                        ? `You asked for who is ${personEntity.text}.`
                        : topIntent === "Create a meeting"
                          ? `You requested a meeting${personEntity.text ? ` with ${personEntity.text}` : ''}${dayEntity?.text ? ` on ${dayEntity.text}` : ''}${timeEntity?.text ? ` at ${timeEntity.text}` : ''}`.trim()
                        : "I didn't quite understand your request."
                      : topIntent === "Who is X"
                        ? "You asked for who is someone."
                        : topIntent === "Create a meeting"
                          ? "You requested a meeting."
                          : "I didn't quite understand your request."
                  }`;
          
                  console.log(`🛑 Checking if message is unclear: "${message}"`);
                  return message === "I didn't quite understand your request.";
                },
                target: "AskForWho",
              },


              {
                // First, check if the nextState is "Done", if so, transition to Done
                guard: ({ context }) => {
                  // Check if meeting intent or who intent has enough confidence to proceed to "Done"
                  const meetingIntent = context.interpretation?.intents?.find(intent => intent.category === "Create a meeting");
                  const whoIntent = context.interpretation?.intents?.find(intent => intent.category === "Who is X");
          
                  const isMeetingIntent = meetingIntent && meetingIntent.confidenceScore > 0.80;
                  const isWhoIntent = whoIntent && whoIntent.confidenceScore > 0.80;
          
                  return isMeetingIntent || isWhoIntent; // Transition to Done if either intent has sufficient confidence
                },
                target: "Done", // Transition to Done state
              },

              {
                // If topIntent is "Create a meeting" or "Who is X" and confidence < 0.80, go to "AskForCreation"
                guard: ({ context }) => {
                  const personEntity = context.interpretation?.entities.find((entity) => entity.category === "person");
                  const whoIntent = context.interpretation?.intents?.find((intent) => intent.category === "Who is X");
                  const createMeetingIntent = context.interpretation?.intents?.find((intent) => intent.category === "Create a meeting");
              
                  const whoIntentConfidence = whoIntent?.confidenceScore ?? 0;
                  const createMeetingIntentConfidence = createMeetingIntent?.confidenceScore ?? 0;
              
                  const personEntityText = personEntity?.text ?? "";

                  const topIntent = context.interpretation?.topIntent;
              
                  // Check if topIntent is "Create a meeting" or "Who is X" and confidence score is below 0.80
                  const isBelowThreshold =
                    (topIntent === "Create a meeting" && createMeetingIntentConfidence < 0.80) ||
                    (topIntent === "Who is X" && whoIntentConfidence < 0.80);
              
                  // Return true if the conditions for grammar check or low confidence are met
                  return (
                    isBelowThreshold && 
                    (!personEntityText || !isInGrammar(personEntityText))
                  );
                },
                target: "AskForCreation", // Go to "AskForCreation" state if conditions met
              },

              {
                // Only if confidence is low and no grammar issues, proceed to "AskForCreation"
                guard: ({ context }) => {
                  const whoIntent = context.interpretation?.intents?.find((intent) => intent.category === "Who is X");
                  const meetingIntent = context.interpretation?.intents?.find((intent) => intent.category === "Create a meeting");
          
                  const whoIntentConfidence = whoIntent?.confidenceScore ?? 0;
                  const meetingIntentConfidence = meetingIntent?.confidenceScore ?? 0;
          
                  return whoIntentConfidence < 0.80 && meetingIntentConfidence < 0.80;
                },
                target: "AskForCreation", // Proceed to "AskForCreation" if confidence is low
              },


              {
                // If the topIntent is "Create a meeting" and the grammar is correct, move to "AskForCreation"
                guard: ({ context }) => {
                  const topIntent = context.interpretation?.topIntent;
                  return topIntent === "Create a meeting" && isInGrammar(personEntity?.text);
                },
                target: "AskForCreation", // Go to "AskForCreation"
              },
              {
                // If the topIntent is something else (not meeting or who is X), go back to "AskForWho"
                guard: ({ context }) => {
                  const topIntent = context.interpretation?.topIntent;
                  return topIntent !== "Create a meeting" && topIntent !== "Who is X";
                },
                target: "AskForWho", // Go back to "AskForWho"
              },
              {
                // If none of the above conditions are met, go back to "AskForWho"
                target: "AskForWho", // Go back to "AskForWho"
              },
            ],
          },

                      
                

          
        },




        /* CREATION */


        AskForCreation: {

          // entry: {

          entry: [
            // Store the current topIntent as previousTopIntent
            ({ context }) => {
              context.previousTopIntent = context.interpretation?.topIntent;


            // // const personText = context.person?.[0]?.utterance || "someone unknown"; 
            // context.previousPerson = context.interpretation?.entities.find(entity => entity.category === "person") || "someone unknown";
           
           
            // Store only the text of the person entity
            const personEntity = context.interpretation?.entities.find(entity => entity.category === "person");
            context.previousPerson = personEntity ? personEntity.text : "someone unknown"; // Ensure you store only the text

            },
            {
            type: "spst.speak",
            params: ({ context }) => ({

              // lab2
              // utterance: `Do you want me to create an appointment with ${getPerson(context.person?.[0]?.utterance)} on ${getDay(context.day?.[0]?.utterance)} at ${getTime(context.time?.[0]?.utterance)} ?`,

              utterance: `Is that correct?`,
              
            }),
            },
          ],



          on: { SPEAK_COMPLETE: "AskForCreationListen" },
        },
        
    
    
        AskForCreationListen: {
          initial: "Ask",
          entry: [
            () => console.log("👂 Listening for confirmation..."),
            { type: "spst.listen"}
          ],
    
          on: {
    
            LISTEN_COMPLETE: [

              // lab5 help ***
              {
                target: "AskForWho",
                guard: ({ context }) => 
                  context.yes?.[0]?.utterance?.toLowerCase() === "help" || 
                  context.no?.[0]?.utterance?.toLowerCase() === "help",
                  actions: [
                    {
                      type: "spst.speak", 
                      params: {
                        utterance: "Let's go back! Tell me!"  // this should be done after, but okay ***
                      },
                    },
                  ],
              },

              {
                target: "CheckGrammarCreation",
                guard: ({ context }) =>
                  !!context.yes || !!context.no, // You can modify this guard as needed
        
                // If you want to check for both topIntent and previousTopIntent:
                // guard: ({ context }) =>
                //   context.previousTopIntent === "Confirmation" && context.interpretation?.topIntent === "Create a meeting",
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
                      yes: event.value, 
                      no: event.value,
                      interpretation: event.nluValue  // This enables RECOGNISED events to contain NLU results (accessible via event.nluValue). // lab4
                    };
                  }),
                },
                // ASR_NOINPUT: { 
                //   target: "NoInput"  // THIS IS WRONG. DON'T DO IT!
                // },  // Handle no-input cases

                ASR_NOINPUT: {
                  actions: assign({ yes: null, no: null }),
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
                      return { utterance: "Sorry, I didn't hear you. Is that correct?" };
                    } else if (context.noInputCount === 1) {  // Second no-input case
                      return { utterance: "I still didn't get that. Please say yes or no?" };
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
                    guard: ({ context }) => context.noInputCount < 3  // Only retry if attempts < 3  // VERY IMPORTANT CONDITION. OTHERWISE IT DOESN'T STOP AFTER ATTEMP 3.
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
            { type: "spst.speak", params: { utterance: "Goodbye!" } },
            assign({ noInputCount: 0 })  // Reset noInputCount to zero
          ],
          on: {
            CLICK: "Done",
          },
        },
    



        CheckGrammarCreation: {
          entry: [
            ({ context }) => {
              // const spokenwholeDay2 = context.wholeDay?.[0]?.utterance?.toLowerCase() || "unknown"; // ✅ Safe access & lowercase
              // console.log(`🔍 You just said: ${spokenwholeDay2}`);
        
              // const inGrammar = isInGrammar(spokenwholeDay2);
              // console.log(`✅ Is "${spokenwholeDay2}" in grammar? ${inGrammar ? "Yes" : "No"}`);

              const yesEntity = context.interpretation?.entities.find(entity => entity.category === "yes");
              const noEntity = context.interpretation?.entities.find(entity => entity.category === "no");
              const topIntent = context.interpretation?.topIntent;

              console.log(`👍 yes: ${yesEntity?.text}`);
              console.log(`👎 no: ${noEntity?.text}`);
              console.log(`😎 initialtopIntent: ${context.previousTopIntent}`);
              console.log(`😎 topIntent: ${topIntent}`);
              



            },
        
            {
           
              type: "spst.speak",
              params: ({ context }) => {
                // lab5 help *** Check if the user said "help"
                if (
                  context.yes?.[0]?.utterance?.toLowerCase() === "help" || 
                  context.no?.[0]?.utterance?.toLowerCase() === "help"
                ) {
                  return {
                    utterance: "Let's go back!",
                    nextState: "AskForWho"
                  };
                }
                else {
                  // Otherwise, continue with the existing logic
                  const yesEntity = context.interpretation?.entities.find(entity => entity.category === "yes");
                  const noEntity = context.interpretation?.entities.find(entity => entity.category === "no");
                  const topIntent = context.interpretation?.topIntent;
              
                  return {
                    utterance: `${
                      topIntent === "Confirmation"
                       ? `You just said ${yesEntity?.text || "yes"}.`
                        : `${noEntity?.text ? `You just said ${noEntity.text}.` : "You just said no."}`
                    }`,
                  };
                }
                 },

            },
          ],
        
          on: {
            SPEAK_COMPLETE: [

              // lab5 help ***
              {
                // If the user says "help", move to "AskForWho"
                guard: ({ context }) => 
                  context.yes?.[0]?.utterance?.toLowerCase() === "help" || 
                  context.no?.[0]?.utterance?.toLowerCase() === "help",
                target: "AskForWho",
                actions: [
                  {
                    type: "spst.speak", 
                    params: ({ context }) => {  
                      return {
                        utterance: "Let's go back!" 
                      };
                    },
                  },
                ],
              
              },

              {
                target: "Done",
                guard: ({ context }) =>
                  context.interpretation?.topIntent === "Confirmation"  &&
                  context.previousTopIntent === "Create a meeting",

                  actions: [
                    {
                      type: "spst.speak",
                      params: {
                        utterance: "We received your request of appointment. Thank you.",
                      },
                    },
                  ],

              },


              {
                target: "Done",
                guard: ({ context }) =>
                  context.interpretation?.topIntent === "Confirmation" &&
                  context.previousTopIntent === "Who is X",

                  actions: [
                    {
                      type: "spst.speak", 
                      params: ({ context }) => {  // Context is passed to the action function

                        
                        // return {
                        //   utterance: `I will tell you more about that person! ${getPerson(context.previousPerson)}`, // 

                        const personText = getPerson(context.previousPerson) || "I'm sorry, I don't know that person.";
      
                        return {
                          // utterance: context.previousPerson 
                          //   ? `I will tell you more about that person! ${personText}`
                          //   : personText, 
                          utterance: personText && personText !== "I'm sorry, I don't know that person."
                          ? `I will tell you more about that person! ${personText}`
                          : "I'm sorry, I don't know that person.",
                            
                        };
                      },
                    },
                  ],

              },

              {
                target: "AskForWho",
                guard: ({ context }) =>
                  context.interpretation?.topIntent === "Negation",
                  actions: [
                    {
                      type: "spst.speak", 
                      params: ({ context }) => {  
                        return {
                          utterance: "Let's go back. Tell me again." 
                        };
                      },
                    },
                  ],

              },



              // {
              //   target: "AskForCreation", // 🔄 If not in grammar, go back and ask again
              //   guard: ({ context }) => !isInGrammar(context.person?.[0]?.utterance),
              // },


            ],
          },
        },


    

    /* STATE */
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




export function setupButton(element: HTMLButtonElement) {
  element.addEventListener("click", () => {
    dmActor.send({ type: "CLICK" });
  });
  dmActor.subscribe((snapshot) => {
    const meta: { view?: string } = Object.values(
      snapshot.context.spstRef.getSnapshot().getMeta(),
    )[0] || {
      view: undefined,
    };
    element.innerHTML = `${meta.view}`;
  });
}




/* 

# Part 1 (one VG point). Improving your voice interface

✅ Point 1 | Make sure that system handles unexpected input (out-of-grammar situations).
✅ Point 2 |A opportunity to say “help” at any point when system is recognising something. You should provide a help message (anything you like) and return the user to the state where they were before asking for help.
✅ Point 3 | In a stepwise fashion change the formulations for your re-prompts in case of no input event (ASR_NOINPUT) and out-of-grammar situations. See example below. If the user is silent and not reacting to 3 reprompts, go to the Done state.

# Part 2 (one VG point). Confidence threshold

✅ Point 1-2 | Implement confidence threshold for speech recognition of user inputs. Test the system and adjust the threshold.
✅ Point 3 | Can you implement a similar threshold for natural language understanding? How can it be combined with the ASR threshold? Justify your choice (as a comment in your code) and provide a sketch implementation.

It is basically what I have already done in some way throughout the previous Point 1-2. If a certain threshold X is not reached, the bot will ask to the user if the topIntent (without a defined threshold) is the right one. To implement it better, we could introduce another threshold Y and defining some functions, but honestly I found already functional the first approach. To improve it, as said, I think we could do something like this:

	1.	ASR Confidence Check (Speech Recognition Threshold)
	•	If the ASR confidence score for the top hypothesis is above threshold X, accept the recognized utterance and pass it to the NLU model.
	•	If the ASR confidence score is below X, ask the user for confirmation (perceptual grounding: “Did you say ‘create a meeting’?”).
	2.	NLU Confidence Check (Understanding Threshold)
	•	If the NLU confidence score for the top intent is above threshold Y, assume the intent is correct and proceed.
	•	If the NLU confidence is below Y, ask for semantic confirmation (semantic grounding: “You want to create a meeting, is that correct?”).

Justification for Combining ASR and NLU Thresholds

	•	ASR First: If ASR misrecognizes the input, there’s no point in processing it further in NLU. We avoid unnecessary misinterpretations by filtering low-confidence ASR outputs early.
	•	NLU Second: Even if ASR correctly recognizes the words, the meaning (intent classification) might still be ambiguous. If the NLU confidence is low, we should verify the meaning.
	•	Adaptive Threshold Tuning: Adjusting X (ASR threshold) and Y (NLU threshold) based on testing results will balance system accuracy and user interaction smoothness.

  // Sketch implementation (VERY VERY DRAFT, I asked help to ChatGPT, but of course what you see here would not work immediately in this code. Basically, the idea, as said, would be just to play on the thresholds with X and Y using Language Studio Azure AI)

  // const ASR_CONFIDENCE_THRESHOLD = 0.6; // Threshold X
  // const NLU_CONFIDENCE_THRESHOLD = 0.75; // Threshold Y

  // function processUserInput(asrResult, nluResult) {
  //   const asrConfidence = asrResult?.confidence ?? 0;
  //   const recognizedText = asrResult?.utterance ?? "";
  
  //   // Step 1: ASR Confidence Check
  //   if (asrConfidence < ASR_CONFIDENCE_THRESHOLD) {
  //     return askForASRConfirmation(recognizedText); // "Did you say 'create a meeting'?"
  //   }

  //   const topIntent = nluResult?.topIntent ?? "None";
  //   const nluConfidence = nluResult?.intents?.find(i => i.category === topIntent)?.confidenceScore ?? 0;

  //   // Step 2: NLU Confidence Check
  //   if (nluConfidence < NLU_CONFIDENCE_THRESHOLD) {
  //     return askForNLUConfirmation(topIntent); // "You want to create a meeting, is that correct?"
  //   }

  //   // Step 3: Proceed with intent execution
  //   return executeIntent(topIntent, nluResult.entities);
  // }

  // // Function to ask user for ASR confirmation
  // function askForASRConfirmation(text) {
  //   console.log(`Perceptual grounding: Did you say "${text}"?`);
  //   // Implement UI prompt for user confirmation...
  // }

  // // Function to ask user for NLU confirmation
  // function askForNLUConfirmation(intent) {
  //   console.log(`Semantic grounding: You want to ${intent.replace(/_/g, " ")}, is that correct?`);
  //   // Implement UI prompt for user confirmation...
  // }

  // // Function to execute recognized intent
  // function executeIntent(intent, entities) {
  //   console.log(`Executing intent: ${intent} with entities`, entities);
  //   // Implement intent handling logic...
  // }

Testing & Adjustment

•	Test with different thresholds (X, Y) to find the best balance between system confidence and user experience.
•	Increase ASR threshold if there are too many misrecognized words.
•	Increase NLU threshold if intent misclassification happens frequently.
•	Introduce a fallback mechanism if the user repeatedly disagrees with the system’s guesses.

Final Thoughts:
This combined ASR + NLU threshold strategy ensures that we validate both perceptual accuracy (speech recognition) and semantic accuracy (intent recognition). It minimizes errors while keeping the interaction efficient.


-------------------------------------------------------------------------------------------------------------------------------

*/
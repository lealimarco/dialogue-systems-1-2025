import { assign, createActor, setup } from "xstate";
import { Settings, speechstate } from "speechstate";
import { createBrowserInspector } from "@statelyai/inspect";
import { KEY } from "./azure";
import { DMContext, DMEvents } from "./types";

const inspector = createBrowserInspector();

const azureCredentials = {
  endpoint:
    "https://northeurope.api.cognitive.microsoft.com/sts/v1.0/issuetoken",
  key: KEY,
};

const settings: Settings = {
  azureCredentials: azureCredentials,
  azureRegion: "northeurope",
  asrDefaultCompleteTimeout: 0,
  asrDefaultNoInputTimeout: 5000,
  locale: "en-US",
  ttsDefaultVoice: "en-US-DavisNeural",
  speechRecognitionEndpointId: "c9cf0d8b-777e-479e-afdd-9d399383fe53",
};

interface GrammarEntry {
  person?: string;
  day?: string;
  wholeDay?: string;
  time?: string;
  phrase?: string;
}




const grammar: { [index: string]: GrammarEntry } = {

  // "hello world": { person: "Marco Leali"}, // Pay attention! You have to write everything in lowercase otherwise the function will not work properly
  
  // The 12 Jungian Archetypes

  // 1. The Ego Types (Focus: Order & Structure)
  "the photographer": { person: "Zack Grand Hotel"},
  "zack grand hotel": { person: "Zack Grand Hotel"}, //it recognises Zach
  "zack": { person: "Zack Grand Hotel"},

  "the hierophant": { person: "The Hierophant"}, // difficult for pronuciation
  "matte": { person: "The Hierophant"},

  "the emperor": { person: "Billy"},
  "billy": { person: "Billy"},
  "marco": { person: "Billy"},

  "the idol": { person: "Menzi Idol"},
  "menzi": { person: "Menzi Idol"},  // nickname: very difficulty
  "menzi idol": { person: "Menzi Idol"},


  // 2. The Soul Types (Focus: Freedom & Identity)
  "the explorer": { person: "Julien Explorer"},
  "the devil": { person: "The Devil"},
  "the lover": { person: "Master"},
  "the creator": { person: "The New Da Vinci"},

  // 3. The Self Types (Focus: Mastery & Power)
  "the french": { person: "The French"},
  "the empress": { person: "The Empress"},

  "the kid": { person: "Kodi Grand Hotel"},
  "kodi grand hotel": { person: "Kodi Grand Hotel"},
  "kodi": { person: "Kodi Grand Hotel"},
  "the magician": { person: "Kodi Grand Hotel"},

  "the player": { person: "The Gamer"},



  // Phrases
  // N.B. in the code you are testing with getPerson function (so it refers to person not to phrase)


  "have you ever heard about the italian dance?": { person: "Billy" },
  "i will not forget": { person: "Billy" },
  "menzi idol. ah ah ah": { person: "Billy" }, //very difficult. i needede to change to manzi idol ah ah ah
  "i am the villain of the story": { person: "Billy" },


  "look here, there is nothing. the empire of nothing": { person: "The Hierophant" },
  "me? am i asked to be the hierophant?": { person: "The Hierophant" }, // very difficult
  "it was a long time ago, my friend": { person: "The Hierophant" },
  "i have only one opportunity to get back in the game": { person: "The Hierophant" },


  "so for the return, you go back to savona too like your brother zack grand hotel, isn't it?": { person: "Menzi Idol" }, //very difficult
  "what if it happened?": { person: "Menzi Idol" },
  "you know, billy, i think i should change my life": { person: "Menzi Idol" },
  "to save yourself, you must die": { person: "Menzi Idol" }, //fixed adding a comma
  "but so, you are a bastard": { person: "Menzi Idol" }, // it doesn't work because it is censored *******


  "billy, i want to change the world": { person: "Kodi Grand Hotel" },
  "so for the dessert we have tiramisu": { person: "Kodi Grand Hotel" }, // dessert close to research , tiramisù should be tiramisu
  "sometimes it is just a matter of time": { person: "Kodi Grand Hotel" },
  "no, i am sorry menzi. i go to turin": { person: "Kodi Grand Hotel" }, // very diffciult for menzi


  "say cheese": { person: "Zack Grand Hotel" }, //removed the exclamation mark
  "and you? have you ever heard about the asl goodbye?": { person: "Zack Grand Hotel" }, // very difficult after ASL put the question mark
  "i want to live": { person: "Zack Grand Hotel" }, // i needed to say the wrong pronunciation

  "i promise": { person: "Julien Explorer" },
  "i have everything i have always needed right now": { person: "Julien Explorer" },
  "how are you, johnny?": { person: "Julien Explorer" }, // i added a comma
  "we are going to hitchhike": { person: "Julien Explorer" },

  "dreamons": { person: "dreamons" }, // it is an invented word. it finds out something different


    // Whole day
  yes: { wholeDay: "yes" }, 
  "of course": { wholeDay: "yes" }, 
  "for sure": { wholeDay: "yes" },

  no: { wholeDay: "no" }, 
  "no way": { wholeDay: "no" }, 
  "absolutely not": { wholeDay: "no" },


};


function isInGrammar(utterance: string) {
  return utterance.toLowerCase() in grammar;
}

function getPerson(utterance: string) {
  return (grammar[utterance.toLowerCase()] || {}).person; 
}

function getWholeDay(utterance: string) {
  return (grammar[utterance.toLowerCase()] || {}).wholeDay;
}

function getTime(utterance: string) {
  return (grammar[utterance.toLowerCase()] || {}).time;
}

function getDay(utterance: string) {
  return (grammar[utterance.toLowerCase()] || {}).day;
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
      }),
  },

}).createMachine({
  context: ({ spawn }) => ({
    spstRef: spawn(speechstate, { input: settings }),
    person: null,
    day: null,
    time: null,
    wholeDay: null,

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
            { type: 
                  "spst.speak", params: { utterance: `Hi! Let's create an appointment` } 
            }
          ],
          on: { SPEAK_COMPLETE: "AskForWho" },
        },


        /* PERSON */

        AskForWho: {
          entry: [
            () => console.log("🟢 Asking for meeting person..."),
            { type: "spst.speak", params: { utterance: `Who are you meeting with?` } }
          ],
          on: { SPEAK_COMPLETE: "AskForWhoListen" },
        },
        
        AskForWhoListen: {
          initial: "Ask",
          entry: [
            () => console.log("👂 Listening for a name..."),
            { type: "spst.listen"}
          ],

          on: {

            LISTEN_COMPLETE: [
              {
                target: "CheckGrammarPerson",
                guard: ({ context }) => !!context.person,
              },
              { target: ".NoInput" },
            ],
          },
          states: {
            NoInput: {
              entry: {
                type: "spst.speak",
                params: { utterance: `I can't hear you! Who are you meeting with?` },
              },
              on: { SPEAK_COMPLETE: "Ask" },
            },
            Ask: {
              entry: { type: "spst.listen" },
              on: {
                RECOGNISED: {
                  actions: assign(({ event }) => {
                    return { person: event.value };
                  }),
                },
                ASR_NOINPUT: {
                  actions: assign({ person: null }),
                },
              },
            },
          },
        },

        CheckGrammarPerson: {
          entry: [
            ({ context }) => {
              const spokenPerson = context.person?.[0]?.utterance || "unknown"; // ✅ Safe access
              // console.log(`🔍 You just said: ${spokenPerson}`);
        
              const inGrammar = isInGrammar(spokenPerson);
              //console.log(`✅ Is "${spokenPerson}" in grammar? ${inGrammar ? "Yes" : "No"}`);
            },
        
            {
              type: "spst.speak",
              params: ({ context }) => {
                const spokenPerson = context.person?.[0]?.utterance || "unknown";
                const fullName = grammar[spokenPerson]?.person || spokenPerson; // Look up full name in grammar

                console.log(`🔍 You just said: ${spokenPerson}`);
                console.log(`👤 Full name: ${fullName}`);


                return {
                  utterance: `You just said: ${spokenPerson}. ${
                    isInGrammar(spokenPerson) ? `It corresponds to ${getPerson(spokenPerson)}.` : "It is not in the grammar."
                  }`,

                };
              },
            },
          ],
        
          on: {
            SPEAK_COMPLETE: [
              {
                target: "AskForWho",  // the right one was AskForDay, but now I want to test
                guard: ({ context }) => isInGrammar(context.person?.[0]?.utterance),
              },
              { target: "AskForWho" }, // 🔄 Go back if not in grammar
            ],
          },
        },



        /* DAY */
        AskForDay: {
          entry: [
            () => console.log("🟢 Asking for meeting day..."),
            { type: "spst.speak", params: { utterance: `On which day is your meeting?` } }
          ],
          on: { SPEAK_COMPLETE: "AskForDayListen" },
        },
        
        AskForDayListen: {
          initial: "Ask",
          entry: [
            () => console.log("👂 Listening for a day..."),
            { type: "spst.listen"}
          ],

          on: {

            LISTEN_COMPLETE: [
              {
                target: "CheckGrammarDay",
                guard: ({ context }) => !!context.day,
              },
              { target: ".NoInput" },
            ],
          },
          states: {
            NoInput: {
              entry: {
                type: "spst.speak",
                params: { utterance: `I can't hear you! On which day is your meeting?` },
              },
              on: { SPEAK_COMPLETE: "Ask" },
            },
            Ask: {
              entry: { type: "spst.listen" },
              on: {
                RECOGNISED: {
                  actions: assign(({ event }) => {
                    return { day: event.value };
                  }),
                },
                ASR_NOINPUT: {
                  actions: assign({ day: null }),
                },
              },
            },
          },
        },

        CheckGrammarDay: {
          entry: [
            ({ context }) => {
              const spokenDay = context.day?.[0]?.utterance || "unknown"; // ✅ Safe access
              const inGrammar = isInGrammar(spokenDay);
            },
        
            {
              type: "spst.speak",
              params: ({ context }) => {
                const spokenDay = context.day?.[0]?.utterance || "unknown";
                const fullDay = grammar[spokenDay]?.day || spokenDay; // Look up full day in grammar

                console.log(`🔍 You just said: ${spokenDay}`);
                console.log(`👤 Full day: ${fullDay}`);


                return {
                  utterance: `You just said: ${spokenDay}. ${
                    isInGrammar(spokenDay) ? `It corresponds to ${getDay(spokenDay)}.` : "It is not in the grammar."
                  }`,

                };
              },
            },
          ],
        
          on: {
            SPEAK_COMPLETE: [
              {
                target: "AskForWholeDay",
                guard: ({ context }) => isInGrammar(context.day?.[0]?.utterance),
              },
              { target: "AskForDay" }, // 🔄 Go back if not in grammar
            ],
          },
        },


    /* WHOLE DAY */

    AskForWholeDay: {
      entry: [
        () => console.log("🟢 Asking for whole day..."),
        { type: "spst.speak", params: { utterance: `Will it take the whole day?` } }
      ],
      on: { SPEAK_COMPLETE: "AskForWholeDayListen" },
    },
    


    AskForWholeDayListen: {
      initial: "Ask",
      entry: [
        () => console.log("👂 Listening for whole day..."),
        { type: "spst.listen"}
      ],

      on: {

        LISTEN_COMPLETE: [
          {
            target: "CheckGrammarWholeDay",
            guard: ({ context }) => !!context.wholeDay,
          },
          { target: ".NoInput" },
        ],
      },
      states: {


        NoInput: {
          entry: {
            type: "spst.speak",
            params: { utterance: `I can't hear you! Will it take the whole day?` },
          },
          on: { SPEAK_COMPLETE: "Ask" },
        },
        Ask: {
          entry: { type: "spst.listen" },
          on: {
            RECOGNISED: {
              actions: assign(({ event }) => {
                return { wholeDay: event.value };
              }),
            },
            ASR_NOINPUT: {
              actions: assign({ wholeDay: null }),
            },
          },
        },


      },
    },



    CheckGrammarWholeDay: {
      entry: [
        ({ context }) => {
          const spokenWholeDay = context.wholeDay?.[0]?.utterance || "unknown"; // ✅ Safe access
          const inGrammar = isInGrammar(spokenWholeDay);
        },
    
        {
          type: "spst.speak",
          params: ({ context }) => {
            const spokenWholeDay = context.wholeDay?.[0]?.utterance || "unknown"; // ✅ Safe access
            const fullWholeDay = grammar[spokenWholeDay]?.wholeDay || spokenWholeDay; // Look up full whole day in grammar

          


            console.log(`🔍 You just said: ${spokenWholeDay}`);
            console.log(`👤 Full whole day: ${fullWholeDay}`);


            return {
              utterance: `You just said: ${spokenWholeDay}. ${
                isInGrammar(spokenWholeDay) ? `It corresponds to ${getWholeDay(spokenWholeDay)}.` : "It is not in the grammar."
              }`,

            };
          },
        },
      ],
    
      on: {
        SPEAK_COMPLETE: [
          {
            target: "AskForCreationWholeDay",
            guard: ({ context }) => 
              isInGrammar(context.wholeDay?.[0]?.utterance) &&
              getWholeDay(context.wholeDay?.[0]?.utterance) === "yes",

          },

          {
            target: "AskForTime",
            guard: ({ context }) =>
              isInGrammar(context.wholeDay?.[0]?.utterance) &&
              getWholeDay(context.wholeDay?.[0]?.utterance?.toLowerCase()) === "no",
          },

          { target: "AskForWholeDay" }, // 🔄 Go back if not in grammar
        ],
      },
    },


 

        /* TIME */

        AskForTime: {
          entry: [
            () => console.log("🟢 Asking for time..."),
            { type: "spst.speak", params: { utterance: `What time is your meeting?` } }
          ],
          on: { SPEAK_COMPLETE: "AskForTimeListen" },
        },
        
    
    
        AskForTimeListen: {
          initial: "Ask",
          entry: [
            () => console.log("👂 Listening for time..."),
            { type: "spst.listen"}
          ],
    
          on: {
    
            LISTEN_COMPLETE: [
              {
                target: "CheckGrammarTime",
                guard: ({ context }) => !!context.time,
              },
              { target: ".NoInput" },
            ],
          },
          states: {
    
    
            NoInput: {
              entry: {
                type: "spst.speak",
                params: { utterance: `I can't hear you! What time is your meeting?` },
              },
              on: { SPEAK_COMPLETE: "Ask" },
            },
            Ask: {
              entry: { type: "spst.listen" },
              on: {
                RECOGNISED: {
                  actions: assign(({ event }) => {
                    return { time: event.value };
                  }),
                },
                ASR_NOINPUT: {
                  actions: assign({ time: null }),
                },
              },
            },
    
    
          },
        },
    


        CheckGrammarTime: {
          entry: [
            ({ context }) => {
              const spokenTime = context.time?.[0]?.utterance || "unknown"; // ✅ Safe access
              const inGrammar = isInGrammar(spokenTime);
            },
        
            {
              type: "spst.speak",
              params: ({ context }) => {
                const spokenTime = context.time?.[0]?.utterance || "unknown";
                const fullTime= grammar[spokenTime]?.time || spokenTime; // Look up full time in grammar
                

                console.log(`🔍 You just said: ${spokenTime}`);
                console.log(`👤 Full time: ${fullTime}`);


                return {
                  utterance: `You just said: ${spokenTime}. ${
                    isInGrammar(spokenTime) ? `It corresponds to ${getTime(spokenTime)}.` : "It is not in the grammar."
                  }`,

                };
              },
            },
          ],
        
          on: {
            SPEAK_COMPLETE: [
              {
                target: "AskForCreation",
                guard: ({ context }) => isInGrammar(context.time?.[0]?.utterance),
              },
              { target: "AskForTime" }, // 🔄 Go back if not in grammar
            ],
          },
        },


        /* CREATION */


        AskForCreation: {

          entry: {
            type: "spst.speak",
            params: ({ context }) => ({

              utterance: `Do you want me to create an appointment with ${getPerson(context.person?.[0]?.utterance)} on ${getDay(context.day?.[0]?.utterance)} at ${getTime(context.time?.[0]?.utterance)} ?`,
              
            }),
          },



          on: { SPEAK_COMPLETE: "AskForCreationListen" },
        },
        
    
    
        AskForCreationListen: {
          initial: "Ask",
          entry: [
            () => console.log("👂 Listening for creation..."),
            { type: "spst.listen"}
          ],
    
          on: {
    
            LISTEN_COMPLETE: [
              {
                target: "CheckGrammarCreation",
                guard: ({ context }) => !!context.wholeDay,
              },
              { target: ".NoInput" },
            ],
          },
          states: {
    
    
            NoInput: {
              entry: {
                type: "spst.speak",
                params: ({ context }) => ({
                  utterance: `I can't hear you! Do you want me to create an appointment with ${getPerson(context.person?.[0]?.utterance)} on ${getDay(context.day?.[0]?.utterance)} at ${getTime(context.time?.[0]?.utterance)} ?`,
                }),
              },


              on: { SPEAK_COMPLETE: "Ask" },
            },
            Ask: {
              entry: { type: "spst.listen" },
              on: {
                RECOGNISED: {
                  actions: assign(({ event }) => {
                    return { wholeDay: event.value };
                  }),
                },
                ASR_NOINPUT: {
                  actions: assign({ wholeDay: null }),
                },
              },
            },
    
    
          },
        },
    



        CheckGrammarCreation: {
          entry: [
            ({ context }) => {
              const spokenwholeDay2 = context.wholeDay?.[0]?.utterance?.toLowerCase() || "unknown"; // ✅ Safe access & lowercase
              console.log(`🔍 You just said: ${spokenwholeDay2}`);
        
              const inGrammar = isInGrammar(spokenwholeDay2);
              console.log(`✅ Is "${spokenwholeDay2}" in grammar? ${inGrammar ? "Yes" : "No"}`);



            },
        
            {
              type: "spst.speak",
              params: ({ context }) => {
                const spokenwholeDay2 = context.wholeDay?.[0]?.utterance?.toLowerCase() || "unknown";
                
                return {
                  utterance: `You just said: ${spokenwholeDay2}. And it ${
                    isInGrammar(spokenwholeDay2) ? `It corresponds to ${getWholeDay(spokenwholeDay2)}.` : "is not"
                  } in the grammar.`,


                };
              },
            },
          ],
        
          on: {
            SPEAK_COMPLETE: [
              {
                target: "Ending",
                guard: ({ context }) =>
                  isInGrammar(context.wholeDay?.[0]?.utterance) &&
                  grammar[context.wholeDay?.[0]?.utterance?.toLowerCase()]?.wholeDay === "yes",
              },
              {
                target: "AskForWho",
                guard: ({ context }) =>
                  isInGrammar(context.wholeDay?.[0]?.utterance) &&
                  grammar[context.wholeDay?.[0]?.utterance?.toLowerCase()]?.wholeDay === "no",
              },
              {
                target: "AskForCreation", // 🔄 If not in grammar, go back and ask again
                guard: ({ context }) => !isInGrammar(context.wholeDay?.[0]?.utterance),
              },
            ],
          },
        },


        /* CREATION WHOLE DAY */


        AskForCreationWholeDay: {

          entry: {
            type: "spst.speak",
            params: ({ context }) => ({
            
              
              utterance: `Do you want me to create an appointment with ${getPerson(context.person?.[0]?.utterance)} on ${getDay(context.day?.[0]?.utterance)} for the whole day ?`,


            }),
          },


          on: { SPEAK_COMPLETE: "AskForCreationWholeDayListen" },
        },
        
    
    
        AskForCreationWholeDayListen: {
          initial: "Ask",
          entry: [
            () => console.log("👂 Listening for whole day creation..."),
            { type: "spst.listen"}
          ],
    
          on: {
    
            LISTEN_COMPLETE: [
              {
                target: "CheckGrammarWholeDayCreation",
                guard: ({ context }) => !!context.wholeDay,
              },
              { target: ".NoInput" },
            ],
          },
          states: {
    
    
            NoInput: {
              entry: {
                type: "spst.speak",
                params: ({ context }) => ({
                  utterance: `I can't hear you! Do you want me to create an appointment with ${getPerson(context.person?.[0]?.utterance)} on ${getDay(context.day?.[0]?.utterance)} for the whole day ?`,
                }),
              },


              on: { SPEAK_COMPLETE: "Ask" },
            },
            Ask: {
              entry: { type: "spst.listen" },
              on: {
                RECOGNISED: {
                  actions: assign(({ event }) => {
                    return { wholeDay: event.value };
                  }),
                },
                ASR_NOINPUT: {
                  actions: assign({ wholeDay: null }),
                },
              },
            },
    
    
          },
        },


        CheckGrammarWholeDayCreation: {
          entry: [
            ({ context }) => {
              const spokenwholeDay3 = context.wholeDay?.[0]?.utterance?.toLowerCase() || "unknown"; // ✅ Safe access & lowercase
              console.log(`🔍 You just said: ${spokenwholeDay3}`);
        
              const inGrammar = isInGrammar(spokenwholeDay3);
              console.log(`✅ Is "${spokenwholeDay3}" in grammar? ${inGrammar ? "Yes" : "No"}`);



            },
        
            {
              type: "spst.speak",
              params: ({ context }) => {
                const spokenwholeDay3 = context.wholeDay?.[0]?.utterance?.toLowerCase() || "unknown";
                
                return {
                  utterance: `You just said: ${spokenwholeDay3}. And it ${
                    isInGrammar(spokenwholeDay3) ? `It corresponds to ${getWholeDay(spokenwholeDay3)}.` : "is not"
                  } in the grammar.`,


                };
              },
            },
          ],
        
          on: {
            SPEAK_COMPLETE: [
              {
                target: "Ending",
                guard: ({ context }) =>
                  isInGrammar(context.wholeDay?.[0]?.utterance) &&
                  grammar[context.wholeDay?.[0]?.utterance?.toLowerCase()]?.wholeDay === "yes",
              },
              {
                target: "AskForWho",
                guard: ({ context }) =>
                  isInGrammar(context.wholeDay?.[0]?.utterance) &&
                  grammar[context.wholeDay?.[0]?.utterance?.toLowerCase()]?.wholeDay === "no",
              },
              {
                target: "AskForCreationWholeDay", // 🔄 If not in grammar, go back and ask again
                guard: ({ context }) => !isInGrammar(context.wholeDay?.[0]?.utterance),
              },
            ],
          },
        },





         /* ENDING */

        Ending: {
         entry: [
           () => console.log("🟢 Ending ..."),
           { type: "spst.speak", params: { utterance: `Your appointment has been created!` } }
         ],
         on: { SPEAK_COMPLETE: "Done" },
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


// dmActor.subscribe((snapshot) => {
//   console.log("📌 State update:", snapshot.value);
//   console.log("🔹 Context:", snapshot.context);

//   if (snapshot.context.spstRef) {
//     const spstState = snapshot.context.spstRef.getSnapshot();
//     console.log("🗣️ SpeechState snapshot:", spstState.value);
//   }
// });

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

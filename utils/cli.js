import gradient from "gradient-string";

const title = `
 ,-----.                         ,--.               
'  .-.  '   ,---. ,--.,--.,--.--.\`--' ,---. ,--.--. 
|  | |  |  | .-. ||  ||  ||  .--',--.| .-. :|  .--' 
'  '-'  '-.' '-' ''  ''  '|  |   |  |\\   --.|  |    
 \`-----'--' \`---'  \`----' \`--'   \`--' \`----'\`--' 
`;

const sub = `   +-+-+-+-+    ---------------    +-+-+-+-+
   |W|E|B|2| <>  Q O U R I E R  <> |W|E|B|3|
   +-+-+-+-+    ---------------    +-+-+-+-+
`;

const logo = [
  gradient.mind.multiline(title),
  gradient.passion.multiline(sub),
].join("\n");

const commands = {
  script: [
    {
      type: "select",
      name: "network",
      message: "Select Network",
      choices: [
        {
          title: "Localhost",
          description: "127.0.0.1:8545",
          value: "localhost",
        },
        {
          title: "Filecoin",
          description: "Hyperspace testnet",
          value: "filecoin",
        },
      ],
      initial: 0,
    },
    {
      type: "select",
      name: "script",
      message: "Select Script",
      choices: [
        {
          title: "Deploy",
          description: "Deploy New Hub",
          value: "deploy",
        },
        {
          title: "Start",
          description: "Start Qourier Node",
          value: "start",
        },
      ],
      initial: 0,
    },
    {
      type: "text",
      name: "key",
      message: "Enter Private Key",
      initial: "",
    },
  ],
  deploy: [
    {
      type: "number",
      name: "price",
      message: "Enter Price",
      float: true,
      validate: (v) => (!v ? "Price For Each Task" : true),
    },
    {
      type: "list",
      name: "module",
      message: "Enter Modules",
      initial: "",
      separator: ",",
      validate: (v) => (!v ? "Modules Separated By Commas" : true),
    },
    {
      type: "confirm",
      name: "personal",
      message: "This Is Personal Hub?",
      initial: false,
    },
    {
      type: "confirm",
      name: "start",
      message: "Start After Deploy?",
      initial: false,
    },
  ],
  start: [
    {
      type: "text",
      name: "address",
      message: "Enter Contract Address",
      initial: "",
      validate: (v) => (!v ? "The Hub Contract Address" : true),
    },
  ],
};

const string = [
  "network",
  "key",
  "script",
  "module",
  "address",
  "personal",
  "start",
];

const parseArgv = (argv) => {
  argv.start = argv.start ? argv.start === "true" : undefined;
  argv.personal = argv.personal ? argv.personal === "true" : undefined;
  if (process.env.PRIVATE_KEY) {
    argv.key = argv.key ? argv.key : process.env.PRIVATE_KEY;
  }
  return argv;
};

const deployTab = (a = {}) => {
  return (
    typeof a.network === "undefined" ||
    typeof a.key === "undefined" ||
    typeof a.script === "undefined" ||
    typeof a.price === "undefined" ||
    typeof a.module === "undefined" ||
    typeof a.personal === "undefined" ||
    typeof a.start === "undefined"
  );
};

const startTab = (a = {}) => {
  return (
    typeof a.network === "undefined" ||
    typeof a.key === "undefined" ||
    typeof a.script === "undefined" ||
    typeof a.address === "undefined"
  );
};

export { commands, string, logo, parseArgv, deployTab, startTab };

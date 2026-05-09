// ===== ADVANCED FUNNY AI REPLY BOT =====
// main.js

const readline = require("readline");

// ===== CUSTOM SETTINGS =====
let botName = "MemeBot 😎";
let ownerId = "second_id"; // control account name

// Custom replies you can edit anytime
let customReplies = {
  hi: [
    "Hey 😏 Ki obostha?",
    "Oho abar tumi 😂",
    "Hello boss 🔥"
  ],

  love: [
    "Love detected 💖",
    "Ami emotional hoye gelam 😭",
    "Screenshot niye rakhlam 😎"
  ],

  food: [
    "Biryani chara life meaningless 🍗",
    "Khabar er naam shunei happy 😋"
  ],

  angry: [
    "Rag komao 😭",
    "Amake maro na pls 💀"
  ]
};

// ===== RANDOM REPLY =====
const randomReplies = [
  "Tomar vibe premium ✨",
  "System confused 😵",
  "Ami AI but emotional 😭",
  "Eta ki flirting? 👀",
  "Tumi dangerous 😂"
];

// ===== AI REPLY SYSTEM =====
function generateReply(message, sender) {

  message = message.toLowerCase();

  // OWNER CONTROL SYSTEM
  if (sender === ownerId) {

    // Add custom reply
    if (message.startsWith("/add")) {

      // Example:
      // /add hi Hello bro

      const parts = message.split(" ");

      const keyword = parts[1];
      const reply = parts.slice(2).join(" ");

      if (!customReplies[keyword]) {
        customReplies[keyword] = [];
      }

      customReplies[keyword].push(reply);

      return `✅ Reply added for "${keyword}"`;
    }

    // Show all commands
    if (message === "/help") {
      return `
COMMANDS:
/add keyword reply
Example:
/add hi Hey bro 😎
      `;
    }
  }

  // NORMAL AUTO REPLY
  for (let keyword in customReplies) {

    if (message.includes(keyword)) {

      let replies = customReplies[keyword];

      return replies[
        Math.floor(Math.random() * replies.length)
      ];
    }
  }

  // Random fallback reply
  return randomReplies[
    Math.floor(Math.random() * randomReplies.length)
  ];
}

// ===== CHAT TEST SYSTEM =====
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`🤖 ${botName} Started...`);
console.log(`Type: username: message`);
console.log(`Example: user1: hi`);
console.log(`Owner Example: second_id: /add hi Wassup 😎`);

function askMessage() {

  rl.question("> ", (input) => {

    if (input === "exit") {
      rl.close();
      return;
    }

    const split = input.split(":");

    const sender = split[0]?.trim();
    const message = split.slice(1).join(":").trim();

    const reply = generateReply(message, sender);

    console.log(`${botName}: ${reply}`);

    askMessage();
  });
}

askMessage();

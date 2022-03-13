const {
  readFile,
  readFileSync,
  writeFileSync,
  readdirSync,
  rmSync,
  existsSync,
  mkdirSync,
} = require("fs");
const sharp = require("sharp");
const { scale } = require("scale-that-svg");

const template = `
    <svg width="1000" height="1500" viewBox="0 0 1000 1500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- bg -->
        <!-- frame -->
        <!-- head -->
        <!-- face -->
        <!-- data -->
        <!-- data1 -->
    </svg>
`;

const takenNames = {};
const takenFaces = {};
let idx = 10;

function randInt(max) {
  return Math.floor(Math.random() * (max + 1));
}

function randElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomColor() {
  const colors = "#7D72B4 #B0D033 #0C7FC3 #EC2E83 #FFC90D #870559".split(" ");
  return randElement(colors);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function getRandomName() {
  const adjectives =
    "fired trashy tubular nasty jacked swol buff ferocious firey flamin agnostic artificial bloody crazy cringey crusty dirty eccentric glutinous harry juicy simple stylish awesome creepy corny freaky shady sketchy lame sloppy hot intrepid juxtaposed killer ludicrous mangy pastey ragin rusty rockin sinful shameful stupid sterile ugly vascular wild young old zealous flamboyant super sly shifty trippy fried injured depressed anxious clinical".split(
      " "
    );
  const names =
    "aaron bart chad dale earl fred grady harry ivan jeff joe kyle lester steve tanner lucifer todd mitch hunter mike arnold norbert olaf plop quinten randy saul balzac tevin jack ulysses vince will xavier yusuf zack roger raheem rex dustin seth bronson dennis".split(
      " "
    );

  const randAdj = randElement(adjectives);
  const randName = randElement(names);
  const name = `${randAdj}-${randName}`;

  if (takenNames[name] || !name) {
    return getRandomName();
  } else {
    takenNames[name] = name;
    return name;
  }
}

async function getLayer(name, skip = 0.0) {
  //   const svg = readFileSync(`./layers/${name}.svg`, "utf-8");
  let svg = await scaleSVG(`./layers/${name}.svg`);
  if (name.includes("bg")) {
    svg = readFileSync(`./layers/${name}.svg`, "utf-8");
  }
  const re = /(?<=\<svg\s*[^>]*>)([\s\S]*?)(?=\<\/svg\>)/g;
  const layer = svg.match(re)[0];
  return Math.random() > skip ? layer : "";
}

function getHealth(rarity) {
  if (rarity == 0) {
    return getRandomInt(50, 100);
  }
  if (rarity == 0.5) {
    return getRandomInt(150, 200);
  }
  if (rarity == 1) {
    return getRandomInt(300, 350);
  }
}
function getDamage(rarity) {
  if (rarity == 0) {
    return getRandomInt(20, 30);
  }
  if (rarity == 0.5) {
    return getRandomInt(40, 50);
  }
  if (rarity == 1) {
    return getRandomInt(70, 90);
  }
}

async function scaleSVG(src) {
  return await scale(readFileSync(src), { scale: 4 });
}

async function svgToPng(name) {
  const src = `./out/${name}.svg`;
  const dest = `./out/${name}.png`;

  const img = await sharp(src);
  const resized = await img.resize(1000, 1500);
  await resized.toFile(dest);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function createImage(idx) {
  x = await scale(readFileSync("./layers/bg0.svg"), { scale: 4 });
  writeFileSync("x.svg", x);
  const bg = randInt(9);
  const frame = randInt(2);
  const head = randInt(5);
  const face_ = randInt(5);

  let rarity = 0;
  if (frame == 0) {
    rarity = 0;
  } else if (frame == 1) {
    rarity = 0.5;
  } else {
    rarity = 1;
  }

  const face = [frame, head, face_].join("");

  if (face[takenFaces]) {
    createImage();
  } else {
    const fullName = getRandomName();
    const adj = fullName.split("-")[0];
    const name = fullName.split("-")[1];

    face[takenFaces] = face;

    const headData = await getLayer(`head${head}`);
    let data = await getLayer("data1");
    data = data.replace("Moshi", capitalizeFirstLetter(adj));
    data = data.replace("Moshu", capitalizeFirstLetter(name));
    const health = getHealth(rarity);
    const damage = getDamage(rarity);
    data = data.replace("75", health);
    data = data.replace("100", damage);

    const final = template
      .replace("<!-- bg -->", await getLayer(`bg${bg}`))
      .replace("<!-- frame -->", await getLayer(`frame${frame}`))
      .replace("<!-- head -->", headData.replace("#7D72B4", getRandomColor()))
      .replace("<!-- face -->", await getLayer(`face${face_}`))
      .replace("<!-- data -->", await getLayer("data0"))
      .replace("<!-- data1 -->", data);

    const meta = {
      name: adj + "-" + name,
      image: `${idx}.png`,
      attributes: {
        rarity: rarity,
        health: health,
        damage: damage,
      },
    };
    writeFileSync(`./out/${idx}.json`, JSON.stringify(meta));
    writeFileSync(`./out/${idx}.svg`, final);
    svgToPng(idx);
    console.log(takenFaces);
  }
}

// Create dir if not exists
if (!existsSync("./out")) {
  mkdirSync("./out");
}

// Cleanup dir before each run
readdirSync("./out").forEach((f) => rmSync(`./out/${f}`));

do {
  createImage(idx);
  idx--;
} while (idx >= 0);

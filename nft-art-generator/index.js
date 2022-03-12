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
let idx = 1;

function randInt(max) {
  return Math.floor(Math.random() * (max + 1));
}

function randElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
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
  //   let svg = readFileSync(`./layers/${name}.svg`, "utf-8");
  const svg = await scaleSVG(`./layers/${name}.svg`);
  const re = /(?<=\<svg\s*[^>]*>)([\s\S]*?)(?=\<\/svg\>)/g;
  const layer = svg.match(re)[0];
  return Math.random() > skip ? layer : "";
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
  const bg = randInt(9);
  const frame = randInt(2);
  const head = randInt(5);
  const face_ = randInt(5);
  //   const nose = randInt(4);
  //   const mouth = randInt(5);
  //   const exp = randInt(1);
  //   const head = randInt(2);
  //    18,900 combinations
  //   const face = [hair, eyes, mouth, nose, beard, head].join("");
  const face = [frame, head, face_].join("");

  if (face[takenFaces]) {
    createImage();
  } else {
    const fullName = getRandomName();
    const adj = fullName.split("-")[0];
    const name = fullName.split("-")[1];

    face[takenFaces] = face;
    replaceName(adj, name);

    function replaceName(adj, name) {
      let data = readFileSync("./layers/data1.svg", "utf-8");
      data = data.replace("Moshi", capitalizeFirstLetter(adj));
      data = data.replace("Moshu", capitalizeFirstLetter(name));
      writeFileSync("./layers/data2.svg", data);
    }

    const final = template
      .replace("<!-- bg -->", await getLayer(`bg${bg}`))
      .replace("<!-- frame -->", await getLayer(`frame${frame}`))
      .replace("<!-- head -->", await getLayer(`head${head}`))
      .replace("<!-- face -->", await getLayer(`face${face_}`))
      .replace("<!-- data -->", await getLayer("data0"))
      .replace("<!-- data1 -->", await getLayer("data2"));
    //   .replace("<!-- nose -->", getLayer(`nose${nose}`))
    //   .replace("<!-- mouth -->", getLayer(`mouth${mouth}`))
    //   .replace("<!-- beard -->", getLayer(`beard${beard}`, 0.5));

    const meta = {
      name,
      description: `A drawing of ${name.split("-").join(" ")}`,
      image: `${idx}.png`,
      attributes: [
        {
          beard: "",
          rarity: 0.5,
        },
      ],
    };
    writeFileSync(`./out/${idx}.json`, JSON.stringify(meta));
    writeFileSync(`./out/${idx}.svg`, final);
    svgToPng(idx);
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

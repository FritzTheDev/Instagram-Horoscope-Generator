import { join } from 'path';
import { cwd } from 'process';
import Express from 'express';
import { Canvas, loadImage, registerFont } from 'canvas';
import { config as loadEnv } from 'dotenv';
import { readdirSync, readFileSync } from 'fs';

type Horoscope = {
  message: string;
  birthdates?: string;
  date?: string;
  sign?: string;
  match?: string;
  number?: string;
  color?: string;
  time?: string;
};

const signs = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];

const colors = [
  'AliceBlue',
  'Aqua',
  'Aquamarine',
  'Azure',
  'Beige',
  'Bisque',
  'Blue',
  'BlueViolet',
  'BurlyWood',
  'CadetBlue',
  'Chartreuse',
  'Chocolate',
  'Coral',
  'Cornsilk',
  'Crimson',
  'Cyan',
  'DeepPink',
  'DimGray',
  'DimGrey',
  'DodgerBlue',
  'FireBrick',
  'FloralWhite',
  'ForestGreen',
  'Fuchsia',
  'GhostWhite',
  'Gold',
  'GoldenRod',
  'Gray',
  'Grey',
  'Green',
  'GreenYellow',
  'HoneyDew',
  'HotPink',
  'IndianRed',
  'Indigo',
  'Ivory',
  'Khaki',
  'Lavender',
  'LawnGreen',
  'Lime',
  'LimeGreen',
  'Linen',
  'Magenta',
  'Maroon',
  'MintCream',
  'MistyRose',
  'Moccasin',
  'NavajoWhite',
  'Navy',
  'OldLace',
  'Olive',
  'OliveDrab',
  'Orange',
  'OrangeRed',
  'Orchid',
  'PapayaWhip',
  'PeachPuff',
  'Peru',
  'Pink',
  'Plum',
  'PowderBlue',
  'Purple',
  'Red',
  'RosyBrown',
  'RoyalBlue',
  'Salmon',
  'SandyBrown',
  'SeaGreen',
  'SeaShell',
  'Silver',
  'SkyBlue',
  'SlateBlue',
  'SlateGray',
  'SlateGrey',
  'Snow',
  'SteelBlue',
  'Tan',
  'Teal',
  'Thistle',
  'Tomato',
  'Turquoise',
  'Violet',
  'Wheat',
  'White',
  'WhiteSmoke',
  'Yellow',
];

loadEnv();
registerFont(join(cwd(), 'resources/fonts/Cinzel.ttf'), { family: 'Cinzel' });
registerFont(join(cwd(), 'resources/fonts/Gideon.ttf'), { family: 'Gideon' });

const app = Express();
const horoscopes: Horoscope[] = JSON.parse(readFileSync(join(cwd(), 'resources/horoscopes.json'), 'utf-8'));
const imageNames = readdirSync(join(process.cwd(), 'resources/backgrounds'));

const getRandomBackgroundName = () => imageNames[Math.floor(Math.random() * imageNames.length)];
const getRandomBackground = () => readFileSync(join(cwd(), 'resources/backgrounds/', getRandomBackgroundName()));
const scorpio = readFileSync(join(cwd(), 'resources/signs/scorpio.png'));

const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  return ctx;
};

const randomTime = () => {
  const randomHour = Math.floor(Math.random() * 11 + 1);
  const randomMinute = `${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}`;
  const randomAmPm = ['AM', 'PM'][Math.floor(Math.random() * 2)];
  return `${randomHour}:${randomMinute} ${randomAmPm}`;
};

const getLines = (ctx: CanvasRenderingContext2D, text: string) => {
  var words = text.split(' ');
  var lines = [];
  var currentLine = words[0];

  for (var i = 1; i < words.length; i++) {
    var word = words[i];
    var width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < 900) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
};

const generateFinalImage = async (horoscope: Horoscope, sign: Buffer) => {
  const canvas = new Canvas(1200, 1200, 'image');

  const context = canvas.getContext('2d');
  const background = await loadImage(getRandomBackground());
  const signImage = await loadImage(sign);

  // BG & Foreground
  context.drawImage(background, 0, 0, 1200, 1200);
  context.fillStyle = '#f0f0f0';
  roundRect(context, 100, 100, 1000, 1000, 100);
  context.fill();

  // Sign Logo
  context.drawImage(signImage, 150, 150, 400, 450);

  // Sign Name
  context.textAlign = 'center';
  context.font = '70pt Cinzel';
  context.fillStyle = '#CC2C18';
  context.fillText(horoscope.sign, 825, 225);

  // Birthdates
  context.font = '18pt Cinzel';
  context.fillStyle = '#555';
  context.fillText(horoscope.birthdates, 825, 263);

  // Today's Date
  context.font = '38pt Cinzel';
  context.fillStyle = '#000';
  context.fillText(horoscope.date, 825, 315);

  // Extras Box
  context.fillStyle = 'slategray';
  roundRect(context, 600, 350, 450, 240, 10);
  context.fill();

  // Today's Match
  context.font = '20pt Cinzel';
  context.fillStyle = 'white';
  context.fillText(horoscope.match, 825, 400);

  // Today's Lucky Number
  context.font = '20pt Cinzel';
  context.fillStyle = 'white';
  context.fillText(horoscope.number, 825, 450);

  // Today's Color
  context.font = '20pt Cinzel';
  context.fillStyle = 'white';
  context.fillText(`Today's Color: ${horoscope.color}`, 825, 500);

  // Today's Time
  context.font = '20pt Cinzel';
  context.fillStyle = 'white';
  context.fillText(`Lucky Time: ${horoscope.time}`, 825, 550);

  // Message
  context.font = '50px Gideon';
  context.fillStyle = 'black';
  const lines = getLines(context, horoscope.message);
  
  context.textAlign = "left"
  context.fillText(lines[0], 150, 700, 1000);
  if (lines[1]) context.fillText(lines[1], 150, 750, 1000);
  if (lines[2]) context.fillText(lines[2], 150, 800, 1000);
  if (lines[3]) context.fillText(lines[3], 150, 850, 1000);
  if (lines[4]) context.fillText(lines[4], 150, 900, 1000);
  if (lines[5]) context.fillText(lines[5], 150, 950, 1000);
  if (lines[6]) context.fillText(lines[6], 150, 1000, 1000);
  if (lines[7]) context.fillText(lines[7], 150, 1050, 1000);

  return canvas.toBuffer('image/png');
};

app.get('/scorpio', async (_req, res, _next) => {
  // get horoscope message
  const horoscope = horoscopes[Math.floor(Math.random() * horoscopes.length)];
  // Set horoscope name
  horoscope.sign = 'Scorpio';
  // Horoscope birthdate range
  horoscope.birthdates = 'Born October 23 - November 21';
  // Today's Date
  const date = new Date();
  date.setDate(23);
  date.setMonth(4);
  horoscope.date = date.toDateString();
  // Get Horoscope Match
  horoscope.match = `Sign Match: ${signs[Math.floor(Math.random() * signs.length)]}`;
  horoscope.number = `Lucky Number: ${Math.floor(Math.random() * 100)}`;
  horoscope.color = `${colors[Math.floor(Math.random() * colors.length)]}`;
  horoscope.time = randomTime();

  const image = await generateFinalImage(horoscope, scorpio);

  return res.status(200).contentType('image/png').send(image);
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.PORT}`);
});

const fs = require('fs');
const cheerio = require('cheerio');
const fetch = require('node-fetch')

async function generateEmojiJSON() {
  try {
    const response = await fetch('https://unicode.org/emoji/charts/full-emoji-list.html');
    let body = await response.text()
    const $ = cheerio.load(body);

    const emojis = [];

    $('tr').each((i, row) => {
      if (i === 0) {
        // Skip header row
        return;
      }

      const $cells = $(row).children('td');
      
      if ($($cells[1]).text().trim() === "") {
      } else {
        const code = $($cells[1]).text().trim().replaceAll("U+","0x")
        const name = $($cells[14]).text().trim();
        emojis.push({
            code,
            name,
          });
      }
      
    });
    console.log(emojis)
    fs.writeFileSync('emojis.json', JSON.stringify(emojis, null, 2));
    console.log('Emojis JSON file generated!');
  } catch (error) {
    console.error(error);
  }
}

generateEmojiJSON();

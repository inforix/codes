var cookies = document.cookie;
var sessionId = cookies.match(/NTESSTUDYSI=(\w+)/)[1];
var tid = location.href.match(/tid=(\d+)/)[1];


async function getSignature(unit) {
  let url = 'https://www.icourse163.org/web/j/resourceRpcBean.getResourceToken.rpc?csrfKey=' + sessionId;
  let formData = 'bizId=' + unit.id + '&bizType=1&contentType=1';
  const config = {
    method: 'POST',
    headers: {
      'accept': '*/*',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData
  };
  const response = await fetch(url, config);
  const json = response.json()

  return json;
}

// json.result.videoSignDto
async function getVideoInfo(video) {
  let url = 'https://vod.study.163.com/eds/api/v1/vod/video?videoId=' + video.videoId + '&signature=' + video.signature + '&clientType=1';
  const response = await fetch(url);
  const json = response.json()
  return json;
}

const URL = 'https://www.icourse163.org/web/j/courseBean.getLastLearnedMocTermDto.rpc?csrfKey=' + sessionId;
const config = {
  method: "POST",
  body: 'termId=' + tid,
  headers: {
    'Accept': '*/*',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

const response = await fetch(URL, config);
const json = await response.json();
let chapters = json.result.mocTermDto.chapters;

let units = [];
chapters.forEach(c => {
  let chaptername = c.name;
  c.lessons = c.lessons || [];
  c.lessons.forEach(l => {
    let lessonname = l.name;
    units = units.concat(l.units);
  });
});

console.log(units);

let vunits = units.filter(u => u.contentType == 1);
let tarray = [];

for (i = 0; i < vunits.length; i++) {
  let sig = await getSignature(vunits[i]);
  let vi = await getVideoInfo(sig.result.videoSignDto);
  if (vi.result.videos.length < 1) continue;
  let videoUrl = vi.result.videos[vi.result.videos.length - 1].videoUrl;
  let videoName = vi.result.name;
  tarray.push('ffmpeg -i "' + videoUrl + '" -c copy ' + videoName);
}

let text = tarray.join('\n');
console.log(text);

// 附件下载地址
funits = units.filter(u=>u.contentType==4);
fu = funits.map(o=>JSON.parse(o.jsonContent))
urls = fu.map(o=>return 'https://www.icourse163.org/course/attachment.htm?fileName=' + encodeURIComponent(o.fileName) + '&nosKey=' + o.nosKey)
allurls = urls.join('\r\n');
console.log(allurls);






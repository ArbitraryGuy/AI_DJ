console.log('wok');

let elem = document.createElement('a')
console.log(elem);


const data = await (await fetch('songs.json')).json()
let rand = Math.floor(Math.random()*19)+1

let AI = data.songs[`${rand}`];
elem.textContent = "Click"
elem.href = `/download?val=${AI.url}`
document.body.append(elem)
console.log('hello');


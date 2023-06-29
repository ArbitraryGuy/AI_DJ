console.log('wok');
async function getDuration() {
    let data = await fetch('duration')
    const newData = await data.json()
    return newData.duration
}

async function wait() {
    let duration = await getDuration()
    console.log(duration);

    setTimeout(()=>{
    window.location.assign('/download')
    }, duration+6000)
}
wait()



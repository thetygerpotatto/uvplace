const socket = io()
var modify = true;
var timeleft = 0;

let map = null;
getMap()

const cellNumber = 100
const canvas = document.getElementById("canvas")
const cellSizeX = canvas.width / cellNumber;
const cellSizeY = canvas.height / cellNumber;
const ctx = canvas.getContext("2d");

const timer = document.getElementById('timer');
const timer1 = document.getElementById('timer1');
const clockgif = document.getElementById('clock-gif');
const randomizer = document.getElementById('random');
const error = document.getElementById('errorReport')
const download_canvas = document.getElementById("download")

error.addEventListener("click", report)
function report() {
    console.log("error")
}

download_canvas.addEventListener("click", () => {
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'canvas-image.png'; 
    link.click(); 
})

function randmodify(){
    console.log("rand")
}
randomizer.addEventListener('click', randmodify());


function gettime(){
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    function updatetimer(){
        setTimeout(() => gettime(), 1000);
        timer1.textContent = (`${hours}:${minutes}:${seconds}`);
    };
    updatetimer();
}
    
gettime();

var text = "00:";
function updatetimer(m){
    if(m >=10){
        timer.textContent = "00:" + m;
    } else {
        timer.textContent = "00:0" + m;
    }
};

function countDown(m){
    updatetimer(m);
    m--;

    if (m >= 0) {
        timer.style.color = '#ff0000';
        clockgif.style.backgroundColor = '#ff0000'; 
        setTimeout(() => countDown(m), 1000);

    } 
    else {
        timer.textContent = "00:00"
        modify = true;
        timer.style.color = '#00ff00';
        warning.textContent = 'Pinte ☺';
        clockgif.style.backgroundColor = '#000000'; 
    };
    
};

const backgroundpicker = document.getElementById('backgroundpicker');

backgroundpicker.addEventListener('click', () => {
    document.body.style.backgroundColor = backgroundpicker.value;
});

const colorPicker = document.getElementById('color-picker');

const palette = document.getElementById('palette');
palette.addEventListener('click', () => {
    colorPicker.value = palette.value;
});

const palette2 = document.getElementById('palette2');
palette2.addEventListener('click', () => {
    colorPicker.value = palette2.value;
});

const palette3 = document.getElementById('palette3');
palette3.addEventListener('click', () => {
    colorPicker.value = palette3.value;
});

const palette4 = document.getElementById('palette4');
palette4.addEventListener('click', () => {
    colorPicker.value = palette4.value;
});

const palette5 = document.getElementById('palette5');
palette5.addEventListener('click', () => {
    colorPicker.value = palette5.value;
});

const palette6 = document.getElementById('palette6');
palette6.addEventListener('click', () => {
    colorPicker.value = palette6.value;
});

const palette7 = document.getElementById('palette7');
palette7.addEventListener('click', () => {
    colorPicker.value = palette7.value;
});

const palette8 = document.getElementById('palette8');
palette8.addEventListener('click', () => {
    colorPicker.value = palette8.value;
});

const palette9 = document.getElementById('palette9');
palette9.addEventListener('click', () => {
    colorPicker.value = palette9.value;
});

const palette10 = document.getElementById('palette10');
palette10.addEventListener('click', () => {
    colorPicker.value = palette10.value;
});

const warning = document.getElementById('warning');

// Rendering functions
async function renderCanvas(ctx) {
    for (let i = 0; i < cellNumber; i++) {
        for (let j = 0; j < cellNumber; j++) {
            ctx.fillStyle = map["map"][i][j];
            ctx.fillRect(i*cellSizeX, j*cellSizeY, cellSizeX, cellSizeY)
        }
    }
}

canvas.addEventListener('click', changeCellColor);

//uncomment the following for debbug
function changeCellColor(e) {
    if (modify === true) {
        modify = false
    } 
    else if (modify === false) {
        return;
    }

    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - (10 + rect.left);
    const y = e.clientY - (10 + rect.top);
    const xIndex = Math.floor(x/cellSizeX)
    const yIndex = Math.floor(y/cellSizeY)
    map["map"][xIndex][yIndex] = colorPicker.value
    updateMap(xIndex, yIndex, colorPicker.value)
    renderCanvas(ctx)
    countDown(1)
}

async function updateMap(x, y, color) {
    fetch("/update",
        {   method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"x": x, "y": y, "color": color})
            })
}

socket.on('map-update', (data) => {
    const update = JSON.parse(data)
    map["map"][update["x"]][update["y"]] = update["color"]
    renderCanvas(ctx)
})

async function getMap() {
    let response = await fetch("/map");
    let data = await response.json();
    map = data;
    renderCanvas(ctx)
}


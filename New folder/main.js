const clickArea = document.getElementById('clickArea');
const clickList = document.getElementById('clickList');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const clearBtn = document.getElementById('clearBtn');
const exportBtn = document.getElementById('exportJson');

let isRecording = false;
let clickCount = 0;
const clicks = [];

// Block copy, cut, paste handlers
function blockCopyPaste(e) {
    e.preventDefault();
}

function enableBlockCopyPaste() {
    document.addEventListener('copy', blockCopyPaste, true);
    document.addEventListener('cut', blockCopyPaste, true);
    document.addEventListener('paste', blockCopyPaste, true);
}

function disableBlockCopyPaste() {
    document.removeEventListener('copy', blockCopyPaste, true);
    document.removeEventListener('cut', blockCopyPaste, true);
    document.removeEventListener('paste', blockCopyPaste, true);
}

function formatTime(date) {
    return date.toLocaleTimeString();
}

function addClickRecord(x, y) {
    const record = {
        id: ++clickCount,
        x: x,
        y: y,
        time: formatTime(new Date())
    };
    clicks.push(record);

    const clickItem = document.createElement('div');
    clickItem.className = 'click-item';
    clickItem.textContent = `Click #${record.id} - X: ${record.x}, Y: ${record.y} - Time: ${record.time}`;
    clickList.insertBefore(clickItem, clickList.firstChild);

    // Add animation to click area
    clickArea.classList.remove('clicked'); // reset if already animating
    void clickArea.offsetWidth; // force reflow
    clickArea.classList.add('clicked');
}

function handleClick(e) {
    if (!isRecording) return;

    const rect = clickArea.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    addClickRecord(Math.round(x), Math.round(y));
}

// Block left mouse click handler
function blockLeftClick(e) {
    if (isRecording && e.button === 0) { // 0 = left mouse button
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
}

// Enable/disable left click globally
function enableBlockLeftClick() {
    document.addEventListener('mousedown', blockLeftClick, true);
}
function disableBlockLeftClick() {
    document.removeEventListener('mousedown', blockLeftClick, true);
}

startBtn.addEventListener('click', () => {
    isRecording = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;
    clickArea.style.borderColor = '#ff3333';
    enableBlockCopyPaste();
    enableBlockLeftClick();
});

stopBtn.addEventListener('click', () => {
    isRecording = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    clickArea.style.borderColor = '#ff3333';
    disableBlockCopyPaste();
    disableBlockLeftClick();
});

clearBtn.addEventListener('click', () => {
    clickList.innerHTML = '';
    clickCount = 0;
    clicks.length = 0; // Clear the array
});

exportBtn.addEventListener('click', () => {
    const json = JSON.stringify(clicks, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clicks.json';
    a.click();
    URL.revokeObjectURL(url);
});

clickArea.addEventListener('click', handleClick); 
import ScratchVM from 'scratch-vm';
import ScratchRender from 'scratch-render';
import ScratchStorage from 'scratch-storage';
import ScratchAudio from 'scratch-audio';
import { BitmapAdapter } from 'scratch-svg-renderer';

function getEventXY(e) {
    return { x: e.clientX, y: e.clientY };
}

function inputHandler(canvas, vm, e, ekind) {
    const rect = canvas.getBoundingClientRect();
    const { x, y } = getEventXY(e);
    const mousePosition = [x - rect.left, y - rect.top];

    const data = {
        x: mousePosition[0],
        y: mousePosition[1],
        canvasWidth: rect.width,
        canvasHeight: rect.height
    };

    if (ekind === 'mouseDown') {
        data['isDown'] = true;
    } else if (ekind === 'mouseUp') {
        data['isDown'] = false;
    } else if (ekind === 'mouseMove') {
    }

    vm.postIOData('mouse', data);
}

function inputHandlerWheel(vm, e) {
    const data = {
        deltaX: e.deltaX,
        deltaY: e.deltaY
    };
    vm.postIOData('mouseWheel', data);
}

function inputHandlerKeyboard(vm, e, isDown) {
    const key = (!e.key || e.key === 'Dead') ? e.keyCode : e.key;

    vm.postIOData('keyboard', {
        key: key,
        isDown
    });

    // Prevent space/arrow key from scrolling the page.
    if (e.keyCode === 32 || // 32=space
        (e.keyCode >= 37 && e.keyCode <= 40)) { // 37, 38, 39, 40 are arrows
        e.preventDefault();
    }
}

export function loadScratchProject(projectUrl, containerId) {
    const vm = new ScratchVM();

    const canvas = document.createElement('canvas');
    document.getElementById(containerId).appendChild(canvas);
    const renderer = new ScratchRender(canvas);

    const storage = new ScratchStorage();
    storage.addWebStore([ScratchStorage.AssetType.Project], () => '');

    const audioEngine = new ScratchAudio();

    vm.attachRenderer(renderer);
    vm.attachStorage(storage);
    vm.attachAudioEngine(audioEngine);
    vm.attachV2BitmapAdapter(new BitmapAdapter());

    async function loadSB3File(fileBlob) {
        const fileArrayBuffer = await fileBlob.arrayBuffer();
        await vm.loadProject(fileArrayBuffer);
        vm.start();
        vm.greenFlag();
    }

    // Event handling shinaningans (dispatch mouse events to vm)
    canvas.addEventListener('mousedown', e => inputHandler(canvas, vm, e, 'mouseDown'));
    canvas.addEventListener('mouseup', e => inputHandler(canvas, vm, e, 'mouseUp'));
    canvas.addEventListener('mousemove', e => inputHandler(canvas, vm, e, 'mouseMove'));
    canvas.addEventListener('onWheel', e => inputHandlerWheel(vm, e));
    window.addEventListener('keydown', e => inputHandlerKeyboard(vm, e, true));
    window.addEventListener('keyup', e => inputHandlerKeyboard(vm, e, false));

    fetch(projectUrl)
        .then(response => response.blob())
        .then(blob => loadSB3File(blob));

    // Size
    setTimeout(() => {
        const rect = canvas.getBoundingClientRect();
        renderer.resize(rect.width, rect.height);
    }, 200);

    return () => {
        vm.stopAll();
        canvas.remove();
    };
}

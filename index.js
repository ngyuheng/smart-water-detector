function dismissAlert() {
    const alertElement = document.querySelector('.alert-card-container');
    if (alertElement) {
        alertElement.style.display = 'none';
    }
    console.log('Alert dismissed');
}

let port, reader;

async function connectDevice() {

    const filters = [
        { usbVendorId: 0x2341, usbProductId: 0x0043 },
        { usbVendorId: 0x2341, usbProductId: 0x0001 },
        { usbVendorId: 0x1A86, usbProductId: 0x7523 }
    ];
    port = await navigator.serial.requestPort({filters});
    await port.open({ baudRate: 9600 });
    console.log('Connected to device:', port.getInfo());

    document.querySelector('.status-text').textContent = 'Connected';
    document.querySelector('.connect-button').textContent = 'Disconnect';
    document.querySelector('.connect-button').setAttribute('onclick', 'disconnectDevice()');
    document.querySelector('.status-dot').classList.remove('disconnected');
    document.querySelector('.status-dot').classList.add('connected');
    dataReader();
}

async function disconnectDevice() {
    if (port && port.readable) {
        reader.releaseLock();
        await port.close();
        console.log('Disconnected from device');
    }

    document.querySelector('.status-text').textContent = 'Disconnected';
    document.querySelector('.connect-button').textContent = 'Connect';
    document.querySelector('.connect-button').setAttribute('onclick', 'connectDevice()');
    document.querySelector('.status-dot').classList.remove('connected');
    document.querySelector('.status-dot').classList.add('disconnected');
}

async function dataReader() {
    reader = port.readable.getReader();
    let buffer = '';
    const decoder = new TextDecoder('utf-8');

    // Loop to listen to data coming from the serial device.
    while (true) {
        const { value, done } = await reader.read();
        buffer += decoder.decode(value);

        let index;
        while ((index = buffer.indexOf('\r\n')) !== -1) {
            const line = buffer.slice(0, index);
            buffer = buffer.slice(index + 2); // skip '\r\n'

            // Note: I'm assuming the data will be sent to serial in an array format.
            // i.e. [Tap on time, Tap Status, Water Flow Rate, Total Usage]
            const dataArray = line.split(',');
            console.log('Raw data:', "Tap on time, Tap Status, Water Flow Rate, Total Usage");
            console.log('Parsed data:', dataArray);

            updateStatus({
                tapTime: dataArray[0],
                tapStatus: dataArray[1],
                waterFlowRate: dataArray[2],
                totalUsage: dataArray[3]
            });
        }
    }
}

function updateStatus(status) {
    document.querySelector('.tap-status').textContent = status.tapStatus;
    document.querySelector('.tap-time').textContent = status.tapTime + " sec";
    document.querySelector('.est-cost').textContent = "$" + (parseInt(status.waterFlowRate) * parseInt(status.tapTime) * 0.01).toFixed(2); // change cost per litre!
    document.querySelector('.water-flow').textContent = status.waterFlowRate;
    document.querySelector('.water-usage').textContent = status.totalUsage;
}


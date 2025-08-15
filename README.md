Instructions:

Output data from the Arduino UNO in the form of the following example:
Serial.println(String(onTime) + "," + status + "," + flowRate + "," + totUsage);
onTime++;\n
delay(1000);\n

if connecting does not work, comment out lines 14-16 in index.js (the { usbVendorId: 0x2341, usbProductId: 0x0043 },{ usbVendorId: 0x1A86, usbProductId: 0x7523 },{ usbVendorId: 0x2341, usbProductId: 0x0001 } lines)

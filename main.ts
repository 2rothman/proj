function sens () {
    recul = !(recul)
    VitesseM1 = 0
    rotation = false
    VitesseM2 = 0
    angle = 90
    if (recul && Start) {
        pins.digitalWritePin(DigitalPin.P2, 0)
        pins.digitalWritePin(DigitalPin.P8, 1)
    } else if (Start && !(recul)) {
        pins.digitalWritePin(DigitalPin.P2, 1)
        pins.digitalWritePin(DigitalPin.P8, 0)
    }
}
function Marche () {
    if (!(recul)) {
        pins.digitalWritePin(DigitalPin.P13, 1)
        pins.digitalWritePin(DigitalPin.P14, 0)
        pins.digitalWritePin(DigitalPin.P15, 1)
        pins.digitalWritePin(DigitalPin.P16, 0)
    } else {
        pins.digitalWritePin(DigitalPin.P13, 0)
        pins.digitalWritePin(DigitalPin.P14, 1)
        pins.digitalWritePin(DigitalPin.P15, 0)
        pins.digitalWritePin(DigitalPin.P16, 1)
    }
    Start = true
    rotation = false
    VitesseM1 = 0
    VitesseM2 = 0
    angle = 90
    serial.writeLine("*SV50*")
}
function Arret () {
    pins.digitalWritePin(DigitalPin.P13, 0)
    pins.digitalWritePin(DigitalPin.P14, 0)
    pins.digitalWritePin(DigitalPin.P15, 0)
    pins.digitalWritePin(DigitalPin.P16, 0)
    VitesseM1 = 0
    rotation = false
    VitesseM2 = 0
    Start = false
    angle = 90
    serial.writeLine("*vV50*")
    servos.P2.setAngle(angle)
}
function gauche () {
    if (!(recul) && Start) {
        if (!(rotation)) {
            rotation = true
            pins.digitalWritePin(DigitalPin.P2, 1)
            pins.digitalWritePin(DigitalPin.P8, 0)
            VitesseM2 = 100
            VitesseM1 = 0
        } else if (rotation && VitesseM2 < 1000) {
            VitesseM2 += 100
        } else if (rotation && VitesseM1 > 0) {
            VitesseM1 += -100
        } else if (rotation && (VitesseM2 == 0 && VitesseM1 == 0)) {
            rotation = false
        }
    }
}
function droite () {
    if (!(recul) && Start) {
        if (!(rotation)) {
            rotation = true
            pins.digitalWritePin(DigitalPin.P2, 1)
            pins.digitalWritePin(DigitalPin.P8, 0)
            VitesseM1 = 100
            VitesseM2 = 0
        } else if (rotation && VitesseM1 < 1000) {
            VitesseM1 += 100
        } else if (rotation && VitesseM2 > 0) {
            VitesseM2 += -100
        } else if (rotation && (VitesseM2 == 0 && VitesseM1 == 0)) {
            rotation = false
        }
    }
}
serial.onDataReceived(serial.delimiters(Delimiters.Comma), function () {
    message = serial.readUntil(serial.delimiters(Delimiters.Comma))
    conversion = parseFloat(message)
    if (conversion == 9) {
        basic.showLeds(`
            # . . . #
            . # . # .
            . . # . .
            . # . # .
            # . . . #
            `)
        Arret()
        serial.writeLine("*vV50*")
    } else if (conversion == 8) {
        Marche()
        serial.writeLine("*vV50*")
        basic.showIcon(IconNames.Ghost)
    } else if (Start && (conversion == 4 && angle <= 165)) {
        angle += 5
    } else if (Start && (conversion == 5 && angle >= 5)) {
        angle += -5
    }
    pins.analogWritePin(AnalogPin.P1, VitesseM1)
    pins.analogWritePin(AnalogPin.P0, VitesseM2)
    servos.P2.setAngle(angle)
    serial.writeString("*P" + angle + "*")
    serial.writeString("*G" + VitesseM1 + "*")
    serial.writeString("*D" + VitesseM2 + "*")
})
let conversion = 0
let message = ""
let Start = false
let angle = 0
let rotation = false
let recul = false
let VitesseM1 = 0
let VitesseM2 = 0
basic.pause(500)
serial.redirect(
SerialPin.P12,
SerialPin.P8,
BaudRate.BaudRate9600
)
basic.clearScreen()
Arret()
pins.analogWritePin(AnalogPin.P0, VitesseM2)
pins.analogWritePin(AnalogPin.P1, VitesseM1)
basic.forever(function () {
	
})

//  MakeCode Python üçün Tam Labirint Robotu Kodu
//  Alqoritm: Sağ Əl Qaydası (Right Hand Rule)
//  Dəyişənlər
let sürət = 35
let dönmə_müddəti = 450
//  90 dərəcə üçün bu rəqəmi test edib dəyişə bilərsən
let yarış_başladı = false
function mühərrik_idarə(sol: number, sağ: number) {
    //  Bu hissə robotun modelinə görə dəyişir.
    //  Əgər Tinybit istifadə edirsənsə:
    //  tinybit.car_ctrl_speed(tinybit.CarState.CAR_RUN, sol, sağ)
    //  Əgər standart Micro:bit pinləridirsə (P1 və P2):
    pins.analogWritePin(AnalogPin.P1, sol * 10)
    pins.analogWritePin(AnalogPin.P2, sağ * 10)
}

function dayan() {
    pins.analogWritePin(AnalogPin.P1, 0)
    pins.analogWritePin(AnalogPin.P2, 0)
}

function sağa_dön() {
    pins.analogWritePin(AnalogPin.P1, 400)
    pins.analogWritePin(AnalogPin.P2, 0)
    basic.pause(dönmə_müddəti)
    dayan()
}

function sola_dön() {
    pins.analogWritePin(AnalogPin.P1, 0)
    pins.analogWritePin(AnalogPin.P2, 400)
    basic.pause(dönmə_müddəti)
    dayan()
}

function məsafə_ölç(): number {
    //  P0 və P1 pinlərindən istifadə edən ultrasonik sensor üçün:
    return sonar.ping(DigitalPin.P0, DigitalPin.P1, PingUnit.Centimeters)
}

//  A düyməsinə basanda yarış başlayır (Qayda 3.2-yə uyğun)
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
    basic.showIcon(IconNames.Target)
    basic.pause(1000)
    yarış_başladı = true
})
basic.forever(function on_forever() {
    let d: number;
    
    if (yarış_başladı) {
        d = məsafə_ölç()
        //  1. Yol açıqdırsa (15 sm-dən çoxdursa) düz get
        if (d > 15 || d == 0) {
            //  0 bəzən sensorun xətası ola bilər, yolun boş olduğunu göstərir
            mühərrik_idarə(sürət, sürət)
        } else {
            //  2. Maneə gördükdə sağ əl qaydasını tətbiq et
            dayan()
            basic.pause(200)
            //  Öncə sağa dönməyə çalış
            sağa_dön()
            basic.pause(200)
            //  Sağa döndükdən sonra yol hələ də bağlıdırsa, sola (əslində sola 180 dərəcə) dön
            if (məsafə_ölç() < 15) {
                sola_dön()
                sola_dön()
            }
            
        }
        
    }
    
    basic.pause(20)
})

# MakeCode Python üçün Tam Labirint Robotu Kodu
# Alqoritm: Sağ Əl Qaydası (Right Hand Rule)

# Dəyişənlər
sürət = 35
dönmə_müddəti = 450  # 90 dərəcə üçün bu rəqəmi test edib dəyişə bilərsən
yarış_başladı = False

def mühərrik_idarə(sol, sağ):
    # Bu hissə robotun modelinə görə dəyişir.
    # Əgər Tinybit istifadə edirsənsə:
    # tinybit.car_ctrl_speed(tinybit.CarState.CAR_RUN, sol, sağ)
    # Əgər standart Micro:bit pinləridirsə (P1 və P2):
    pins.analog_write_pin(AnalogPin.P1, sol * 10)
    pins.analog_write_pin(AnalogPin.P2, sağ * 10)
def dayan():
    pins.analog_write_pin(AnalogPin.P1, 0)
    pins.analog_write_pin(AnalogPin.P2, 0)

def sağa_dön():
    pins.analog_write_pin(AnalogPin.P1, 400)
    pins.analog_write_pin(AnalogPin.P2, 0)
    basic.pause(dönmə_müddəti)
    dayan()

def sola_dön():
    pins.analog_write_pin(AnalogPin.P1, 0)
    pins.analog_write_pin(AnalogPin.P2, 400)
    basic.pause(dönmə_müddəti)
    dayan()

def məsafə_ölç():
    # P0 və P1 pinlərindən istifadə edən ultrasonik sensor üçün:
    return sonar.ping(DigitalPin.P0, DigitalPin.P1, PingUnit.CENTIMETERS)

# A düyməsinə basanda yarış başlayır (Qayda 3.2-yə uyğun)
def on_button_pressed_a():
    global yarış_başladı
    basic.show_icon(IconNames.TARGET)
    basic.pause(1000)
    yarış_başladı = True
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_forever():
    global yarış_başladı
    if yarış_başladı:
        d = məsafə_ölç()
        
        # 1. Yol açıqdırsa (15 sm-dən çoxdursa) düz get
        if d > 15 or d == 0: # 0 bəzən sensorun xətası ola bilər, yolun boş olduğunu göstərir
            mühərrik_idarə(sürət, sürət)
        
        # 2. Maneə gördükdə sağ əl qaydasını tətbiq et
        else:
            dayan()
            basic.pause(200)
            
            # Öncə sağa dönməyə çalış
            sağa_dön()
            basic.pause(200)
            
            # Sağa döndükdən sonra yol hələ də bağlıdırsa, sola (əslində sola 180 dərəcə) dön
            if məsafə_ölç() < 15:
                sola_dön()
                sola_dön()
            
    basic.pause(20)

basic.forever(on_forever)
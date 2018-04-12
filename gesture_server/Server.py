import socket
import pyautogui

s = socket.socket()
host = '192.168.7.11' #ip of raspberry pi
port = 6000
s.bind((host, port))

s.listen(5)
while True:
  c, addr = s.accept()
  print ('Got connection from',addr)
  while True :
    try :
        curr = float(c.recv(1024))
        print(curr)
        if curr < 20 :
          pyautogui.press('right')
    except KeyboardInterrupt :
        print ('Transmission stopped')
        c.close()
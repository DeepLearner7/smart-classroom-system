#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Mar 30 14:24:03 2018

@author: saurabh
"""

import numpy as np
import cv2
import ledBlink


ledBlink.setup()
ledBlink.turnOn()

cap = cv2.VideoCapture(0)


fgbg = cv2.createBackgroundSubtractorMOG2()
cnt = 0

while(1):
    ret, frame = cap.read()
    
    grayScale = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    
    fgmask = fgbg.apply(grayScale)
    
#    sub = np.subtract(fgmask)
    fgmask = fgmask[0:480, 0:480]
#    print(np.sum(fgmask/255))
#    print(sub)
    #cv2.imshow('fgmask',frame)
    cv2.imshow('frame',fgmask)
    
    if(cnt%600 == 0):


        if (np.sum(fgmask/255) > 100) :

            print("Keep light on..")
        else:
            ledBlink.turnOff()
            print("Turn off the lights!!!")

    cnt += 1
    

    if cv2.waitKey(25) & 0xFF == ord('q'):
        break
    

cap.release()
cv2.destroyAllWindows()
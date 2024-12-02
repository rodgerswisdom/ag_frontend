#!/usr/bin/env python3
from dataclasses import dataclass

@dataclass
class Number:
    name:str
    num_id:int



class BaseClass:
    def __init__(self,name):
        self.name = name
        print(name)

class IF(BaseClass):
    def evaluate_num(self,num):
        self.num = num
        # self.name = name
        # print("Name:", name)
        print ("Good") if num <= 5 else print ("Bad")

    def loop(self, numlist):
        self.numlist = numlist
        for i in range(0,len(numlist),2):
            print(i, "-" ,numlist[i])


IF = IF("My program")
IF.evaluate_num(5)
IF.loop([3,5,7,2,6,7,8,5])

My_Number = Number("Five", 5)
print(My_Number.name)

def motion():
    print("enter option 1.push \n2.pop\n3.peek\n4.IsEmpty\n5.exit")
    n=int(input(" "))
    return n
class stack1:
    def __init__(self,arr):
        self.arr=arr
    def push(self,ele):
        self.arr.append(ele)
    def pull(self):
        if not self.IsEmpty():
           return self.arr.pop()
    def peek(self):
        return self.arr[-1]
    def IsEmpty(self):
         return len(self.arr)==0
    def exist(self):
        return
s=stack1([])
while True:
    n=motion()
    match n:
        case 1:
            print("enter num value: ")
            ele=int(input())
            s.push(ele)
            print(s.arr)
        case 2:
            print(s.pull())
            print(s.arr)
        case 3:
            print(s.peek())
        case 4:
            if(s.IsEmpty())==True:
                print("empty")
            else:
                print("not empty")
        case 5:
            break
        case _:
            print("bad choice")


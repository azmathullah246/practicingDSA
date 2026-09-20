def quick_sort(arr,start,end):
    if (start<end):
        pivinx=partition(arr,start,end)
        quick_sort(arr,start,pivinx-1)
        quick_sort(arr,pivinx+1,end)
def partition(arr,start,end):
    index=start-1
    pivote=arr[end]
    for j in range(start,end):
        if(arr[j]<=pivote):
            index+=1
            arr[j],arr[index]=arr[index],arr[j]
    arr[index],arr[end]=arr[end],arr[index]
    return index+1
# driver code
arr=[10,7,8,9,1,5]
quick_sort(arr,0,len(arr)-1)
print("sorted array :  ",arr)
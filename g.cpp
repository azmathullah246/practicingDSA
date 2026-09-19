#include<iostream>
#include<vector>
#include<algorithm>

using namespace std;
int CWMW(vector<int>nums){
    int lp=0,rp=nums.size()-1,maxw=0;
    while(lp<rp){
        int w=rp-lp,h=min(nums[lp],nums[rp]),current_water=w*h;
        maxw=max(maxw,current_water);
        nums[lp]<nums[rp]?lp++:rp--;
    }
    return maxw;
}
int main(){
    vector<int>nums={1,8,6,2,5,4,8,3,7};
    cout<<"container in most water: "<<CWMW(nums);
    return 0;
}

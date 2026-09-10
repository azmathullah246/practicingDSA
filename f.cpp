#include<iostream>
#include<vector>
#include<algorithm>
#include<climits>
using namespace std;
int CWMW(vector<int>n,int ans){
    int w,h,a;
    for(int i=0;i<n.size();i++){
        for(int j=i+1;j<n.size();j++){
            w=j-i;
            h=min(n[i],n[j]);
            a=w*h;
            ans=max(ans,a);           
        }

    }
    return ans;
}
int main(){
    vector<int>nums={1,8,6,2,5,4,8,3,7};
    cout<<"the amount of  water in larger container   :   "<<CWMW(nums,INT_MIN);
    return 0;
}

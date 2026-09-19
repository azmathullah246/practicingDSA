#include<iostream>
#include<vector>
using namespace std;
vector<int>nums(vector<int>n1){
    int n=n1.size();
    vector<int>ans(n,1);
    for(int i=1;i<n;i++){
        ans[i]=ans[i-1]*n1[i-1];
    }
    int suffix=1;
    for(int i=n-2;i>=0;i--){
        suffix*=n1[i+1];
        ans[i]*=suffix;
    }
    return ans;
}
int main(){
    vector<int>num={1,2,3,4};
    for(int i:nums(num)){
        cout<<i<<" ";
    }
    return 0;
}


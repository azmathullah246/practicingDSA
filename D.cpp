#include<iostream>
#include<vector>
using namespace std;
int maxprof(vector<int>num){
    int maxi=0,bestbuy=num[0];
    for(int i=1;i<num.size();i++){
        if(num[i]>bestbuy){
            maxi=max(maxi,num[i]-bestbuy);
        }
        bestbuy=min(bestbuy,num[i]);

    }
    return maxi;


}
int main(){
    vector<int>num={7,1,3,2,6,4};
    cout<<maxprof(num);
}
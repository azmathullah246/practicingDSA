#include<iostream>
#include<vector>
#include<algorithm>
using namespace std;
// finding product of array except self by not using division operator
vector<int> poa(vector<int>n1){

    int n=n1.size();

    vector<int>ans(n,1);
    for(int i=0;i<n;i++){

        int product=1;

        for(int j=0;j<n;j++){
            
            if(i!=j){
                ans[i]*=n1[j];

            }

        }
    }
    return ans;
    
}
int main(){
    vector<int>n1={1,2,3,4};
    cout<<"answer : ";
    for(int i:poa(n1)){
        cout<<" "<<i<<" ";
    }
    return 0;

}

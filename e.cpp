#include<iostream>
using namespace std;
int power(double x,int n){
    int Binaryform=n;
    double ans=1;
    
        if(Binaryform<0){
            x=1/x;
            Binaryform=-Binaryform;
        }
        while(Binaryform>0){
            if(Binaryform%2==1){
                ans*=x;
            }
            x*=x;
            Binaryform/=2;
    }
    return ans;
}
int main(){
    int n;
    cout<<"enter n value";
    cin>>n;
    double x;cout<<"enter x value";
    cin>>x;
    cout<<power(x,n);
    return 0;
}
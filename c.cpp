#include<iostream>
using namespace std;
double power(double x,int n){
   int BinaryForm=n;
   if(BinaryForm<0){
    x=1/x;
    BinaryForm=-BinaryForm;
   }
   double ans =1;
   while(BinaryForm>0){
    if(BinaryForm%2==1){
        ans*=x;
    }
    x*=x;
    BinaryForm/=2;
   } 
   return ans;
}
int main(){
    int n;
    cout<<"enter power value";
    cin>>n;
    double x;
    cout<<"enter number value";
    cin>>x;
    cout<<power(x,n);
}
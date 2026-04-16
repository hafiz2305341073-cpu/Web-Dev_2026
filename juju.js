const gaw = [4,7,10,3];
let c=0,d=0;
for(let i =0;i<gaw.length;i++){
    if(gaw[i]%2==0){
        c=c+1;
    }else{
        d=d+1;
    }
}
console.log("Even number = "+c);
console.log("odd number = "+d);
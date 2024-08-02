export const randomString=(len=-1)=>{
	let re="";
	if(len==-1){
		len=Math.floor(Math.random()*20);
	}
	for(let i=0;i<len;i++){
		re+=String.fromCharCode(33+Math.floor(Math.random()*94));
	}
	return re;
};
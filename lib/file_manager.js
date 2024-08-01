import fs from "node:fs";
import path from "path";

export const File=class{
	data=null;
	path=".";
	constructor(path,read=false){
		this.path=path;
		if(read){
			this.read();
		}
	};
	read=(path=this.path)=>{
		this.data=fs.readFileSync(path);
		this.after_read();
	};
	after_read=()=>{
		this.data=this.data.toString();
	};
	before_write=()=>{
		this.data=Buffer.from(this.data);
	};
	write=(wpath=this.path,data=this.data)=>{
		this.before_write();

		let dir=path.dirname(wpath);
		if(!fs.existsSync(dir)){
			fs.mkdirSync(dir,{recursive:true});
		}
		fs.writeFileSync(wpath,data);
		
		this.after_read();
	};
}

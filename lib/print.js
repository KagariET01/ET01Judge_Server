
import chalk from "chalk";
import inquirer from "inquirer";
import {backline} from "./backline.js";
import {File} from "./file_manager.js";

export const Print=class{
	output_line=0;
	clear=()=>{
		backline(this.output_line);
		this.output_line=0;
	}
	debug=(message)=>{
		if(process.env.DEBUG){
			console.debug(message);
			this.output_line+=message.split("\n").length;
		}
	}
	log=(message)=>{
		console.log(chalk.green.bold(">")+message);
		this.output_line+=message.split("\n").length;
	}
	info=(message)=>{
		console.info(chalk.blue.bold("i	")+message);
		this.output_line+=message.split("\n").length;
	}
	warn=(message)=>{
		console.log(chalk.yellow.bold("! ")+message);
		this.output_line+=message.split("\n").length;
	}
	error=(message)=>{
		console.error(chalk.red.bold("X ")+message);
		this.output_line+=message.split("\n").length;
	};
	showq={
		list:async (title = "", lst = []) => {
			let ql = {};
			ql = [
				{
					type: "list",
					name: "sel",
					message: title,
					choices: lst
				}
			];
			let re = await inquirer.prompt(ql);
			this.output_line++;
			return re["sel"];
		},
		input:async (message = "", def = "") => {
			let ql = {};
			ql = [
				{
					type: "input",
					name: "sel",
					message: message,
					default: def
				}
			];
			let re = await inquirer.prompt(ql);
			this.output_line++;
			return re["sel"];
		}
	};
}

export const Log=class{
	p_path="";
	data=new File("",false);
	path=(ph=this.p_path)=>{
		this.p_path=ph;
		this.data.path=ph;
	};

	now=new Date();
	options={
		timeZone:"Asia/Taipei",
		year:"numeric",
		month:"2-digit",
		day:"2-digit",
		hour:"2-digit",
		minute:"2-digit",
		second:"2-digit",
		hour12:false
	};
	formatter=new Intl.DateTimeFormat("zh-TW",this.options);

	nowtime=()=>{
		return this.formatter.format(this.now);
	};

	constructor(path=""){
		this.path(path);
		this.data.before_write=()=>{
			this.data.data=Buffer.from(this.data.data);
		}
		this.data.after_read=()=>{
			this.data.data=this.data.data.toString();
		}
		this.data.data="";
	}
	msg_switch=(message)=>{
		if(typeof(message)=="object"){
			message= (JSON.stringify(message,null,2));
		}

		return message;
	}
	debug=(message)=>{
		message=this.msg_switch(message);
		message=message.replace(/\n/g,"\n"+" ".repeat(32));
		this.data.data+="[ "+this.nowtime()+" ][DEBUG]  "+message+"\n";
	}
	log=(message)=>{
		message=this.msg_switch(message);
		this.data.data+="[ "+this.nowtime()+" ][ LOG ]  "+message+"\n";
	}
	info=(message)=>{
		message=this.msg_switch(message);
		this.data.data+="[ "+this.nowtime()+" ][INFO ]  "+message+"\n";
	}
	warn=(message)=>{
		message=this.msg_switch(message);
		this.data.data+="[ "+this.nowtime()+" ][WARN ]  "+message+"\n";
	}
	error=(message)=>{
		message=this.msg_switch(message);
		this.data.data+="[ "+this.nowtime()+" ][ERROR]  "+message+"\n";
	}
	save=()=>{
		this.data.write();
	}
}

// module.exports=Print;

export default {};

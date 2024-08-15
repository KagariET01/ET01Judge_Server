import express from "express";
import {File} from "./file_manager.js";
import {Print,Log} from "./print.js";
import { randomString } from "./grandom.js";

class discord_oauth{
	name="discord";
	cfg=null;
	log=new Log();
	web=new express();
	session={};
	url=""

	constructor(){

	};
	run=async()=>{
		//setting log sys
		this.log.path(this.cfg.log_path);
		this.log.app_name="OAuth_DC";
		this.log.debug("OAuth server starting...");
		this.log.debug("Config: ");
		this.log.debug(this.cfg);


		//setting web server
		this.web.get(this.cfg.url_path,(req,resp)=>{
			let token=req.query.token;
			if(!token){// new login
				let type=req.query.type;
				// cli
				if(type=="cli"){
					this.log.log("New login request by using cli");
					let newsession=randomString();
					while(1){
						if(this.session[newsession]){
							newsession=randomString();
						}else break;
					}
					this.log.log("New member login, session: "+newsession);
					let gurl=this.cfg.url+`&state=${newsession}`;
					session[this.session]={"status":"waiting"};
					resp.send(gurl);
				}else{
					this.log.log("New login request by using ... IDK.");
					resp.send("Please login with the following link: "+this.cfg.url);
				}

			}else{// login callback
				console.log("Login callback");
				resp.send("Login callback");
			}
			return;
		});


		this.web.listen(this.cfg.port,()=>{
			this.log.log("OAuth server started.");
			this.log.save();
		});

	};
	// new_login=()=>{
	// 	let nwsession=randomString();
	// 	while(1){
	// 		if(this.session[nwsession]){
	// 			nwsession=randomString();
	// 		}else break;
	// 	}
	// 	this.log.log("New member login, session: "+nwsession);
	// 	let gurl=url+`&state=${btoa(randomString)}`;
	// 	let print=new Print();
	// 	print.log("Please login with the following link: ");
	// 	print.log(gurl);
	// 	this.session[nwsession]={
	// 		"status":"waiting"
	// 	};
	// };
};


export class oauth{
	
	cfg=new File("./config/oauth.json");
	log=new Log();

	oauth_list=[
		new discord_oauth()
	];

	constructor(){
		this.cfg.after_read=()=>{
			this.cfg.data=JSON.parse(this.cfg.data.toString());
		};
		this.cfg.before_write=()=>{
			this.cfg.data=JSON.stringify(this.cfg.data);
		};
		this.cfg.read();
		this.log.path(this.cfg.data.log_path);
		this.log.app_name="OAuth";
	};
	run=()=>{
		this.log.log("OAuth server starting...");
		this.log.debug("Config: ");
		this.log.debug(this.cfg.data);
		for(let i of this.oauth_list){
			this.log.debug("Opening OAuth: "+i.name);
			if(this.cfg.data[i.name].enable){
				i.cfg=this.cfg.data[i.name];
				i.run();
			}else{
				this.log.debug("OAuth: "+i.name+" is disabled.");
			}
		}
		this.log.save();
		return
	};

}

// let test=new ooauth;
// test.run();




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
	run=()=>{
		this.web.get(this.cfg.url_path,(req,resp)=>{
			let token=req.query.token;
			if(!token){

				this.log.log("New login request");
			}
			return;
		});
	};
	new_login=()=>{
		let nwsession=randomString();
		while(1){
			if(this.session[nwsession]){
				nwsession=randomString();
			}else break;
		}
		this.log.log("New member login, session: "+nwsession);
		let gurl=url+`&state=${btoa(randomString)}`;
		let print=new Print();
		print.log("Please login with the following link: ");
		print.log(gurl);
		this.session[nwsession]={
			"status":"waiting"
		};
	};
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
	};
	run=()=>{
		this.log.log("OAuth server starting...");
		this.log.debug("Config: ");
		this.log.debug(this.cfg.data);
		for(let i of this.oauth_list){
			this.log.debug("Opening OAuth: "+i.name);
			i.cfg=this.cfg.data[i.name];

		}
		this.log.save();
		return
	};

}

// let test=new ooauth;
// test.run();




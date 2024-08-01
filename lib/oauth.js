import express from "express";
import {File} from "./file_manager.js";
import {Print,Log} from "./print.js";


export class oauth{
	
	cfg=new File("./config/oauth.json");
	web=new express();
	log=new Log();
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
		this.log.save();
		return
	};
}

// let test=new ooauth;
// test.run();




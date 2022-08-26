const express = require("express");
const app = express.Router();
const bodyParser=require('body-parser');
const stuff = require("../model/events");
const stuff_user = require("../model/user");
const ipl_stuff = require("../model/ipl_auction");

var urlencodedParser = bodyParser.urlencoded({ extended : false });

app.post("/post_ipl",async (req,res)=>{

	var counter1 = 0;
	const name = req.body.name;
	const ipl_email = req.body.email;
	const ipl_discord = req.body.discord;
	const campusAmbId = req.body.amb_id;
	const ipl_data =  await stuff_user.model.findOne({ email: ipl_email }).then(
		(ipl_data)=> {
			for(let i=0; i<ipl_data.events_registered.length; i++){
				if(ipl_data.events_registered[i] === "Ipl Auction"){
					counter1++;
				}
			}
			if(counter1 === 0){
				ipl_data.discord = ipl_discord;
				ipl_data.events_registered.push("Ipl Auction");
			}
			ipl_data.save(async function(error, data){
				if(error){
					if(error.code === 11000){
						return res.json({
							status: "error",
							error: `${name} has already registered for this event`,
						});
					}
					else{
						return res.json({
							status: "error",
							error: "Something went wrong. Please contact Spirit team",	
						});
					}	
				}
				const amb1 = await stuff_user.model.findOne({ campusAmbId }).then(
					(amb1)=>{
                        if(amb1){
							let referrals_no = parseInt(amb1.referrals);
							referrals_no++;
							amb1.referrals = referrals_no.toString();
							amb1.save()
						}
					});
				console.log('item saved');
				return res.json({
					status: "ok",
					data: ipl_data,
				});
			})
		}
	)
	.catch(
		(error)=>{
			return res.json({
				status: "error",
				error: `${name} has not registered in this website. Please try again after registering`,
			});
		}
	)	
});

app.post("/post/:event_name/:id", urlencodedParser ,async(req, res) => {

	let email = req.body.email_address;
	let campusAmbId = req.body.amb_id;
	let name_of_event = req.body.event_name;
	var counter = 0;

	if( name_of_event === "shutterbug" || name_of_event === "marathon" || name_of_event === "fitness" || name_of_event === "chess" || name_of_event === "fantasy" || name_of_event === "cricket_workshop" || name_of_event === "treasure_hunt"){

		const data = await stuff_user.model.findOne({ email }).then(
			(data)=>{
				for(let i=0; i<data.events_registered.length; i++){
					if(data.events_registered[i] === req.body.event_name){
						counter++;
					}
				}
				if(counter === 0){
					data.events_registered.push(req.body.event_name);
				}
				data.save()});

		if(counter === 0){	
			var newEntry = await stuff.event.findOne({ event_name: name_of_event }).then(
			(newEntry)=>{
				let j = newEntry.email_address.length;
				if(req.body.contact_number){
					newEntry.contact_number[j] =  req.body.contact_number;
				}
				if(req.body.whatsapp_number){
					newEntry.whatsapp_number[j] =  req.body.whatsapp_number;
				}
				newEntry.email_address[j] = req.body.email_address;
				newEntry.full_name[j] = req.body.full_name;
				newEntry.college[j] = req.body.college;
				newEntry.user_object_id[j] = req.params.id;
				if(req.body.chess_username){
					newEntry.chess_username[j] = req.body.chess_username;
				}
				newEntry.save(async function(error, data){			
					if(error){
						if (error.code === 11000) {
							// duplicate key
							console.log('item not saved');
							return res.json({
								status: "error",
								error: "You've already registered for this event",		
							});
							}
						else{
							console.log('item not saved');
							return res.json({
								status: "error",
								error: "Something went wrong. Please contact Spirit team",		
							});	
						}   
					}
					const amb = await stuff_user.model.findOne({ campusAmbId }).then(
						(amb)=>{
							if(amb){
								let referrals_no = parseInt(amb.referrals);
								referrals_no++;
								amb.referrals = referrals_no.toString();
								amb.save()
							}

						});
					console.log('item saved');
					return res.json({ status: "ok" });
				})
			})		
			.catch((err)=>{
					console.log(err);
			})
		}	
		else{
				console.log(counter);
				return res.json({
				status: "error",
				error: "You've already registered for this event",		
			});	
		}
	}
	else if( name_of_event === "athlos" ){

		const athlos_events = [req.body.cricket, req.body.football, req.body.volleyball, req.body.badminton, req.body.lawn_tennis, req.body.table_tennis, req.body.carrom];

		const data = await stuff_user.model.findOne({ email }).then(
			(data)=>{
				for(let i=0; i<data.events_registered.length; i++){
					if(data.events_registered[i] === 'athlos - cricket' ||
					data.events_registered[i] === 'athlos - football' ||
					data.events_registered[i] === 'athlos - volleyball' ||
					data.events_registered[i] === 'athlos - badminton' ||
					data.events_registered[i] === 'athlos - lawn_tennis' ||
					data.events_registered[i] === 'athlos - table_tennis' ||
					data.events_registered[i] === 'athlos - carrom' ){
						counter++;
					}
				}
				if(counter === 0){
					for(let i=0; i<athlos_events.length; i++){
						if(athlos_events[i] !== 'null'){
							data.events_registered.push('athlos - '+ athlos_events[i]);
						}
					}
				}
				data.save()});
        
		if(counter === 0){	
			var newEntry = await stuff.event.findOne({ event_name: 'athlos' }).then(
			(newEntry)=>{
				let j = newEntry.email_address.length;
				newEntry.contact_number[j] =  req.body.contact_number;
				newEntry.email_address[j] = req.body.email_address;
				newEntry.full_name[j] = req.body.full_name;
				newEntry.college[j] = req.body.college;
				newEntry.user_object_id[j] = req.params.id;
				if(req.body.designation){
					newEntry.designation[j] = req.body.designation;
				}
				else{
					newEntry.designation[j] = 'null';
				}
				let temp_str = '';
				for(let i=0; i<athlos_events.length; i++){
					if(athlos_events[i] !== 'null'){
						temp_str+=athlos_events[i]+' ';
					}                  
				}
				newEntry.athlos_events_registered[j] = temp_str;
				newEntry.save(async function(error, data){			
					if(error){
						if (error.code === 11000) {
							// duplicate key
							console.log('item not saved');
							return res.json({
								status: "error",
								error: "You've already filled this form once",		
							});
							}
						else{
							console.log('item not saved');
							return res.json({
								status: "error",
								error: "Something went wrong. Please contact Spirit team",		
							});	
						}   
					}
					const amb = await stuff_user.model.findOne({ campusAmbId }).then(
						(amb)=>{
							if(amb){
								let referrals_no = parseInt(amb.referrals);
								referrals_no++;
								amb.referrals = referrals_no.toString();
								amb.save()
							}

						});
					console.log('item saved');
					return res.json({ status: "ok" });
				})
			})		
			.catch((err)=>{
					console.log(err);
			})
		}	
		else{
				console.log(counter);
				return res.json({
				status: "error",
				error: "You've already filled this form once",		
			});	
		}
	}
});	

app.get("/success",(req,res)=>{
	res.render("events/event_reg_success");
});

app.get("/athsuccess",(req,res)=>{
	res.render("events/event_reg_success_athlos");
});

module.exports = app;
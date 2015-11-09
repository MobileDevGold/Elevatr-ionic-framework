angular.module('elevatr.services', [])

.constant('API_SERVER', 'http://api.parse.com/v1/remote-api')
.constant('ParseAppId', 'a3knsXm6rSKyManO3j4eKt6HiLI3ZENoqNiD2B8j')
.constant('ParseRestApiKey', 'GqtYUOKHjUMDWlc0iCYvctXZDnbLUoylkG67uXDV')
.factory('userFactory', function($http){
    return {
        signUp: function(email, password) {
            var config = {
                headers: {
                    'X-Parse-Application-Id': ParseAppId,
                    'X-Parse-REST-API-Key': ParseRestApiKey,
                    'Content-Type': 'application/json'
                } 
            }
            return $http.post('https://api.parse.com/1/users', {'username': email, 'password': password}, config);
        },
        logIn: function(email, password) {
            var config = {
             headers: {
               'X-Parse-Application-Id': ParseAppId,
               'X-Parse-REST-API-Key': ParseRestApiKey
             },
             params: { 
                username: email ,
                password: password
              }
            }
            return $http.get('https://api.parse.com/1/login', config);
        }
    };
})
.factory('$elevatrAuth', function($http, $q, API_SERVER) {

    // Return public API.
    return({
        login: login,
        logout: logout
    });

    // login function
    function login(username, password) {
        var deferred = $q.defer();
        var apiUrl = API_SERVER + '?act=login';
        var formData = 'usr=' + encodeURIComponent(username) +
            '&pwd=' + encodeURIComponent(password);

		apiUrl += '&' + formData;

        $http({
            method: "GET",
            url: apiUrl,
            headers: {                   				
            }
        })
        .success(function(data) {

            // Parse json data
            if (data.result == true) {
			
			// Save session id

				
                deferred.resolve(data);
            }
            else {
				
			// Reset session id

				
                deferred.reject(data);
            }
        })
        .error(function(data) {

			// Reset session id

				
            deferred.reject({
                result: false,
                error: 'Network error. Please try again.'
            });
        });

        return deferred.promise;
    }

	// logout function
    function logout() {
        var deferred = $q.defer();
        var apiUrl = API_SERVER + '?act=logout';
        var formData = 'sid=' + encodeURIComponent($sessionStorage['sid']);

		apiUrl += '&' + formData;

        $http({
            method: "GET",
            url: apiUrl,
            headers: {                   				
            }
        })
        .success(function(data) {

				
            // Parse json data
            if (data.result == true) {
                deferred.resolve(data);
            }
            else {
                deferred.reject(data);
            }
        })
        .error(function(data) {
				
            deferred.reject({
                result: false,
                error: 'Network error. Please try again.'
            });
        });

        return deferred.promise;
    }
})

.factory('$elevatrIdeaList', function($http, $q, API_SERVER, $ionicLoading, $rootScope) {

	var service = {};
	
	service.idea_list = [];

	service.resetIdeaList = function(){
		service.idea_list = [];
	}

	service.getIdeaList  = function() {
		return service.idea_list;
	}
	service.getIdeaListById = function(objectId, ideaId, title, name){

      var IdeaData = Parse.Object.extend("IdeaData");
	  var query = new Parse.Query(IdeaData);
	  query.equalTo("ideaId", ideaId);

	  var idea_elevatr_pitch = "";
	  var idea_problem_list = []
	  var idea_solution_list = [];
	  var market_target_list = [];
	  var market_competition_list = [];
	  var market_advantage_list = [];
	  var product_usecase_list = [];
	  var product_feature_list = [];
	  var product_identity_list = [];
	  var business_monetization_list = [];
	  var business_distribution_list = [];
	  var business_financial_list = [];
	  var execution_people_list = [];
	  var execution_milestone_list = [];
	  var execution_step_list = [];

	  query.find({
	  	success: function(res){
	  		for (var i = 0; i < res.length; i++) { 
		      var obj = res[i];
		      var category = obj.get("category");
		      var data = obj.get("data");
		      var type = obj.get("type");
              var imgFile = obj.get("imgFile");
			  
		      var id = obj.id;
			  
		      switch(category){
		      	case "elevatr_pitch":
		      	    idea_elevatr_pitch = data;
		      		break;
		      	case "idea_problem":
					if(type == "image") {
						idea_problem_list.push({id: id, type: type, data: imgFile.url()});
					}else{
						idea_problem_list.push({id: id, type: type, data: data});
					}
		      		break;
		      	case "idea_solution":
					if(type == "image") {
						idea_solution_list.push({id: id, type: type, data: imgFile.url()});
					}else{
						idea_solution_list.push({id: id, type: type, data: data});
					}		      		
		      		break;
		      	case "target_market":
					if(type == "image") {
						market_target_list.push({id: id, type: type, data: imgFile.url()});
					}else{
						market_target_list.push({id: id, type: type, data: data});
					}
		      		break;
		      	case "market_competition":
					if(type == "image") {
						market_competition_list.push({id: id, type: type, data: imgFile.url()});
					}else{
						market_competition_list.push({id: id, type: type, data: data});
					}
					break;
		      	case "competitive_advantage":
					if(type == "image") {
						market_advantage_list.push({id: id, type: type, data: imgFile.url()});
					}else{
						market_advantage_list.push({id: id, type: type, data: data});
					}
		      		break;
		      	case "product_usecases":
					if(type == "image") {
						product_usecase_list.push({id: id, type: type, data: imgFile.url()});
					}else{
						product_usecase_list.push({id: id, type: type, data: data});
					}											
		      		break;
		      	case "product_features":
					if(type == "image") {
						product_feature_list.push({id: id, type: type, data: imgFile.url()});
					}else{
						product_feature_list.push({id: id, type: type, data: data});
					}
		      		break;
		      	case "brand_identity":
					if(type == "image") {
						product_identity_list.push({id: id, type: type, data: imgFile.url()});
					}else{
						product_identity_list.push({id: id, type: type, data: data});
					}
		      		break;
		      	case "business_monetization":
					if(type == "image") {
						business_monetization_list.push({id: id, type: type, data: imgFile.url()});
					}else{
						business_monetization_list.push({id: id, type: type, data: data});
					}
		      		break;
		      	case "business_distribution":
					if(type == "image") {
						business_distribution_list.push({id: id, type: type, data: imgFile.url()});
					}else{
						business_distribution_list.push({id: id, type: type, data: data});
					}
		      		break;
		      	case "bussines_financials":
					if(type == "image") {
						business_financial_list.push({id: id, type: type, data: imgFile.url()});
					}else{
						business_financial_list.push({id: id, type: type, data: data});
					}
		      		break;
		      	case "execution_keypeople":
					if(type == "image") {
						execution_people_list.push({id: id, type: type, data: imgFile.url()});
					}else{
						execution_people_list.push({id: id, type: type, data: data});
					}
		      		break;
		      	case "execution_milestones":
					if(type == "image") {
						execution_milestone_list.push({id: id, type: type, data: imgFile.url()});					
					}else{
						execution_milestone_list.push({id: id, type: type, data: data});					
					}
		      		break;
		      	case "exection_nextsteps":
					if(type == "image") {
						execution_step_list.push({id: id, type: type, data: imgFile.url()});
					}else{
						execution_step_list.push({id: id, type: type, data: data});
					}
		      		break; 
		      }
		     
		    }
			
			//service.idea_list = [];

			service.idea_list.push(
			{
					objectId: objectId,
					id: ideaId,
					title: title,
					name: name,
					created_date: '',
					idea_elevatr_pitch: idea_elevatr_pitch,
					idea_problem_list: idea_problem_list,
					idea_solution_list: idea_solution_list,
					market_target_list: market_target_list,
					market_competition_list: market_competition_list, 
					market_advantage_list: market_advantage_list,
					product_usecase_list: product_usecase_list,
					product_feature_list: product_feature_list,
					product_identity_list: product_identity_list,
					business_monetization_list: business_monetization_list,
					business_distribution_list: business_distribution_list,
					business_financial_list: business_financial_list,
					execution_people_list: execution_people_list,
					execution_milestone_list: execution_milestone_list,
					execution_step_list: execution_step_list
				}
			);
			
			$rootScope.$broadcast('updateIdeaList', service.idea_list); 
	  	},
	  	error: function (error) {
	  		// body...
	  	}
	  });


	}
	
	service.addIdea = function(userId, title, name) {
	
		var id = generateNewId();
				
		var Ideas = Parse.Object.extend("Ideas");
		var idea = new Ideas({
			ACL: new Parse.ACL($rootScope.user)
		});

		 
		idea.set("userId", userId);
		idea.set("name", name);
		idea.set("title", title);
		idea.set("ideaId", id);
		
		idea.save(null, {
		  success: function(idea) {
		    // Execute any logic that should take place after the object is saved.
				$rootScope.id = id;
				
		  },
		  error: function(idea, error) {
		    // Execute any logic that should take place if the save fails.
		    //alert('Failed to create new object, with error code: ' + error.message);
		  }
		});
				
				service.idea_list.push(
					{
						objectId:  idea.id,
						id: id,
						title: title,
						name: name,
						created_date: '',
						idea_problem_list: [],
						idea_solution_list: [],
						market_target_list: [],
						market_competition_list: [],
						market_advantage_list: [],
						product_usecase_list: [],
						product_feature_list: [],
						product_identity_list: [],
						business_monetization_list: [],
						business_distribution_list: [],
						business_financial_list: [],
						execution_people_list: [],
						execution_milestone_list: [],
						execution_step_list: []
					}
				);
		$rootScope.ideaId = id;
		return id;
	}
	
	service.findIdea = function(id) {
		for(var i=0; i<service.idea_list.length; ++i) {
			if (service.idea_list[i].id == id) {
				return service.idea_list[i];
			}
		}
		
		return null;
	}
	
	service.deleteIdea = function(id) {
		for(var i=0; i<service.idea_list.length; ++i) {
			if (service.idea_list[i].id == id) {
				service.idea_list.splice(i, 1);
				return;
			}
		}
	}
	
	service.checkIdeaData = function(res, idea){
		var flag = false;
		for (var i = 0; i < res.length; i++) { 
			var obj = res[i];

		}
		return false;
	}

	service.checkURL = function (url) {
		return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
	}
	
	service.getBase64Image = function(img) {
		// Create an empty canvas element
		var canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;

		// Copy the image contents to the canvas
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);

		// Get the data-URL formatted image
		// Firefox supports PNG and JPEG. You could check img.src to
		// guess the original format, but be aware the using "image/jpg"
		// will re-encode the image.
		var dataURL = canvas.toDataURL("image/png");

		return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
	}

	service.updateIdea = function(idea) {
		for(var i=0; i<service.idea_list.length; ++i) {
			if (service.idea_list[i].id == idea.id) {
				

				var Ideas = Parse.Object.extend("Ideas");
				var query = new Parse.Query(Ideas);
				query.equalTo("ideaId", idea.id);
				query.find({
				  success: function(results) {
				    // Do something with the returned Parse.Object values
				    for (var i = 0; i < results.length; i++) { 
				      var object = results[i];
				      object.set("title", idea.title);
				      object.set("name", idea.name);
				      object.set("createDate", idea.created_date);
				      object.setACL(new Parse.ACL($rootScope.user));
				      object.save();
				    }
				  },
				  error: function(error) {
				    //alert("Error: " + error.code + " " + error.message);
				  }
				});


				var IdeaData = Parse.Object.extend("IdeaData");
				var query = new Parse.Query(IdeaData);
				query.equalTo("ideaId", idea.id);
				query.find({
				  success: function(results) {
				    
				    //Update Elevatr Pitch on Parse
				    for (var j = 0; j < results.length; j++) {
						var obj = results[j];
						if(obj.get("type") == "image")
							continue;
						obj.destroy({
						  success: function(myObject) {
						    // The object was deleted from the Parse Cloud.
						  },
						  error: function(myObject, error) {
						    // The delete failed.
						  }
						});
					}

					//Update Elevatr Pitch on Parse
					var _IdeaData = Parse.Object.extend("IdeaData");
					 
					var _ideaData = new _IdeaData({
						ACL: new Parse.ACL($rootScope.user)
					});
					
					_ideaData.set("ideaId", idea.id);
					_ideaData.set("category", "elevatr_pitch");
					_ideaData.set("type", "text");
					_ideaData.set("data", idea.idea_elevatr_pitch);
					_ideaData.save(null, {
						  success: function(idea) {
						    
						  },
						  error: function(idea, error) {
						    //alert('Failed to create new object, with error code: ' + error.message);
						 }
					});


					//Update Idea Problem List on Parse
                    for(var j = 0; j < idea.idea_problem_list.length; j++){                           
						var obj = idea.idea_problem_list[j];
	
						var _IdeaData = Parse.Object.extend("IdeaData");
						var _ideaData = new _IdeaData({
							ACL: new Parse.ACL($rootScope.user)
						});
                        
						_ideaData.set("ideaId", idea.id);
						_ideaData.set("category", "idea_problem");
						_ideaData.set("type", obj.type);
						
					    if(obj.type == "image" && service.checkURL(obj.data) == false){
                            var parseFile = new Parse.File("myfile.jpeg", { base64: obj.data });						   
						   
                            _ideaData.set("imgFile", parseFile);
                            $ionicLoading.show({
								content: 'Saving...',
								animation: 'fade-in',
								showBackdrop: true,
								maxWidth: 200,
								showDelay: 0
							});  
							
                            _ideaData.save(null, {
							  success: function(idea) {
								$ionicLoading.hide();
							  },
							  error: function(idea, error) {
								$ionicLoading.hide();
							    //alert('Failed to create new object, with error code: ' + error.message);
							  }
							});
                                                  
                           
                         } else if(obj.type == "text"){
                               _ideaData.set("data", obj.data);                           
                               _ideaData.save();
                        }                          
                          
					}

					//Update Idea Solution List on Parse
					for(var j = 0; j < idea.idea_solution_list.length; j++){
						var obj = idea.idea_solution_list[j];
	
						var _IdeaData = Parse.Object.extend("IdeaData");
						var _ideaData = new _IdeaData({
							ACL: new Parse.ACL($rootScope.user)
						});
						 
						 
						_ideaData.set("ideaId", idea.id);
						_ideaData.set("category", "idea_solution");
						_ideaData.set("type", obj.type);
						_ideaData.setACL(new Parse.ACL($rootScope.user));
						
						 if(obj.type == "image" && service.checkURL(obj.data) == false){
                            var parseFile = new Parse.File("myfile.jpeg", { base64: obj.data });						   
						   
                            _ideaData.set("imgFile", parseFile);
                            $ionicLoading.show({
								content: 'Saving...',
								animation: 'fade-in',
								showBackdrop: true,
								maxWidth: 200,
								showDelay: 0
							});         
							
                            _ideaData.save(null, {
							  success: function(idea) {
								$ionicLoading.hide();
							  },
							  error: function(idea, error) {
								$ionicLoading.hide();
							    //alert('Failed to create new object, with error code: ' + error.message);
							  }
							});
                                                  
                           
                         } else if(obj.type == "text"){
                               _ideaData.set("data", obj.data);                           
                               _ideaData.save();							   
                        } 
					}

					//Update Target Market List on Parse
					for(var j = 0; j < idea.market_target_list.length; j++){
						var obj = idea.market_target_list[j];
	
						var _IdeaData = Parse.Object.extend("IdeaData");
						var _ideaData = new _IdeaData();
						
						_ideaData.setACL(new Parse.ACL($rootScope.user));
						_ideaData.set("ideaId", idea.id);
						_ideaData.set("category", "target_market");
						_ideaData.set("type", obj.type);
						
						 if(obj.type == "image" && service.checkURL(obj.data) == false){
                           
                            var parseFile = new Parse.File("myfile.jpeg", { base64: obj.data });						   
						   
                            _ideaData.set("imgFile", parseFile);
                            $ionicLoading.show({
								content: 'Saving...',
								animation: 'fade-in',
								showBackdrop: true,
								maxWidth: 200,
								showDelay: 0
							});         
                            _ideaData.save(null, {
							  success: function(idea) {
								$ionicLoading.hide();
							  },
							  error: function(idea, error) {
								$ionicLoading.hide();
							    //alert('Failed to create new object, with error code: ' + error.message);
							  }
							});
                                                  
                           
                         } else if(obj.type == "text"){
                               _ideaData.set("data", obj.data);  
                               _ideaData.save();
                        } 
					}

					//Update Market Competition List on Parse
					for(var j = 0; j < idea.market_competition_list.length; j++){
						var obj = idea.market_competition_list[j];
	
						var _IdeaData = Parse.Object.extend("IdeaData");
						var _ideaData = new _IdeaData();
						 
						 
						_ideaData.setACL(new Parse.ACL($rootScope.user));
						_ideaData.set("ideaId", idea.id);
						_ideaData.set("category", "market_competition");
						_ideaData.set("type", obj.type);
						 if(obj.type == "image" && service.checkURL(obj.data) == false){
                           
                            var parseFile = new Parse.File("myfile.jpeg", { base64: obj.data });						   
						   
                            _ideaData.set("imgFile", parseFile);
                            $ionicLoading.show({
								content: 'Saving...',
								animation: 'fade-in',
								showBackdrop: true,
								maxWidth: 200,
								showDelay: 0
							}); 
                            _ideaData.save(null, {
							  success: function(idea) {
								$ionicLoading.hide();
								
							  },
							  error: function(idea, error) {
								$ionicLoading.hide();
							    //alert('Failed to create new object, with error code: ' + error.message);
							  }
							});
                                                  
                           
                         } else if(obj.type == "text"){
                               _ideaData.set("data", obj.data);                           
                               _ideaData.save();
                        } 
					}


					//Update Competitive Advantage List on Parse
					for(var j = 0; j < idea.market_advantage_list.length; j++){
						var obj = idea.market_advantage_list[j];
	
						var _IdeaData = Parse.Object.extend("IdeaData");
						var _ideaData = new _IdeaData();

						_ideaData.setACL(new Parse.ACL($rootScope.user));
						_ideaData.set("ideaId", idea.id);
						_ideaData.set("category", "competitive_advantage");
						_ideaData.set("type", obj.type);
						 if(obj.type == "image" && service.checkURL(obj.data) == false){
                           
                            var parseFile = new Parse.File("myfile.jpeg", { base64: obj.data });						   
						   
                            _ideaData.set("imgFile", parseFile);
                            $ionicLoading.show({
								content: 'Saving...',
								animation: 'fade-in',
								showBackdrop: true,
								maxWidth: 200,
								showDelay: 0
							});           
                            _ideaData.save(null, {
							  success: function(idea) {
								$ionicLoading.hide();
							  },
							  error: function(idea, error) {
								$ionicLoading.hide();
							    //alert('Failed to create new object, with error code: ' + error.message);
							  }
							});
                                                  
                           
                         } else if(obj.type == "text"){
                               _ideaData.set("data", obj.data);  
                               _ideaData.save();
                        } 
					}


					//Update Product Usecase List on Parse
					for(var j = 0; j < idea.product_usecase_list.length; j++){
						var obj = idea.product_usecase_list[j];
	
						var _IdeaData = Parse.Object.extend("IdeaData");
						var _ideaData = new _IdeaData();
						 
						 
						_ideaData.setACL(new Parse.ACL($rootScope.user));
						_ideaData.set("ideaId", idea.id);
						_ideaData.set("category", "product_usecases");
						_ideaData.set("type", obj.type);
						 if(obj.type == "image" && service.checkURL(obj.data) == false){
                           
                            var parseFile = new Parse.File("myfile.jpeg", { base64: obj.data });						   
						   
                            _ideaData.set("imgFile", parseFile);
                            $ionicLoading.show({
								content: 'Saving...',
								animation: 'fade-in',
								showBackdrop: true,
								maxWidth: 200,
								showDelay: 0
							});     
                            _ideaData.save(null, {
							  success: function(idea) {
								$ionicLoading.hide();
								//alert('New object created with objectId:');
							  },
							  error: function(idea, error) {
								$ionicLoading.hide();
							    //alert('Failed to create new object, with error code: ' + error.message);
							  }
							});
                                                  
                           
                         } else if(obj.type == "text"){
                               _ideaData.set("data", obj.data);         
                               _ideaData.save();
                        } 
					}


					//Update Product Feature List on Parse
					for(var j = 0; j < idea.product_feature_list.length; j++){
						var obj = idea.product_feature_list[j];
	
						var _IdeaData = Parse.Object.extend("IdeaData");
						var _ideaData = new _IdeaData();
						 
						 
						_ideaData.setACL(new Parse.ACL($rootScope.user));
						_ideaData.set("ideaId", idea.id);
						_ideaData.set("category", "product_features");
						_ideaData.set("type", obj.type);
						 if(obj.type == "image" && service.checkURL(obj.data) == false){
                           
                            var parseFile = new Parse.File("myfile.jpeg", { base64: obj.data });						   
						   
                            _ideaData.set("imgFile", parseFile);
                            $ionicLoading.show({
								content: 'Saving...',
								animation: 'fade-in',
								showBackdrop: true,
								maxWidth: 200,
								showDelay: 0
							});      
                            _ideaData.save(null, {
							  success: function(idea) {
								$ionicLoading.hide();
							  },
							  error: function(idea, error) {
								$ionicLoading.hide();
							    //alert('Failed to create new object, with error code: ' + error.message);
							  }
							});
                                                  
                           
                         } else if(obj.type == "text"){
                               _ideaData.set("data", obj.data);   
                               _ideaData.save();
                        } 
					}


					//Update Brand Identity List on Parse
					for(var j = 0; j < idea.product_identity_list.length; j++){
						var obj = idea.product_identity_list[j];
	
						var _IdeaData = Parse.Object.extend("IdeaData");
						var _ideaData = new _IdeaData();
						 
						 
						_ideaData.setACL(new Parse.ACL($rootScope.user));
						_ideaData.set("ideaId", idea.id);
						_ideaData.set("category", "brand_identity");
						_ideaData.set("type", obj.type);
						 if(obj.type == "image" && service.checkURL(obj.data) == false){
                         
                            var parseFile = new Parse.File("myfile.jpeg", { base64: obj.data });						   
						   
                            _ideaData.set("imgFile", parseFile);
                            $ionicLoading.show({
								content: 'Saving...',
								animation: 'fade-in',
								showBackdrop: true,
								maxWidth: 200,
								showDelay: 0
							});    
                            _ideaData.save(null, {
							  success: function(idea) {
								$ionicLoading.hide();
							  },
							  error: function(idea, error) {
								$ionicLoading.hide();
							    //alert('Failed to create new object, with error code: ' + error.message);
							  }
							});
                                                  
                           
                         } else if(obj.type == "text"){
                               _ideaData.set("data", obj.data);                           
                               _ideaData.save();							   
                        } 
					}
				    

				    //Update Business Monetization List on Parse
					for(var j = 0; j < idea.business_monetization_list.length; j++){
						var obj = idea.business_monetization_list[j];
	
						var _IdeaData = Parse.Object.extend("IdeaData");
						var _ideaData = new _IdeaData();
						 
						_ideaData.setACL(new Parse.ACL($rootScope.user));
						_ideaData.set("ideaId", idea.id);
						_ideaData.set("category", "business_monetization");
						_ideaData.set("type", obj.type);
						 if(obj.type == "image" && service.checkURL(obj.data) == false){
                           
                            var parseFile = new Parse.File("myfile.jpeg", { base64: obj.data });						   
						   
                            _ideaData.set("imgFile", parseFile);
                            $ionicLoading.show({
								content: 'Saving...',
								animation: 'fade-in',
								showBackdrop: true,
								maxWidth: 200,
								showDelay: 0
							}); 
							
                            _ideaData.save(null, {
							  success: function(idea) {
								$ionicLoading.hide();
							  },
							  error: function(idea, error) {
								$ionicLoading.hide();
							    //alert('Failed to create new object, with error code: ' + error.message);
							  }
							});
                                                  
                           
                         } else if(obj.type == "text"){
                               _ideaData.set("data", obj.data);                           
							   _ideaData.save();
                        } 
					}

					//Update Business Distribution List on Parse
					for(var j = 0; j < idea.business_distribution_list.length; j++){
						var obj = idea.business_distribution_list[j];
	
						var _IdeaData = Parse.Object.extend("IdeaData");
						var _ideaData = new _IdeaData();
						 
						 
						_ideaData.setACL(new Parse.ACL($rootScope.user));
						_ideaData.set("ideaId", idea.id);
						_ideaData.set("category", "business_distribution");
						_ideaData.set("type", obj.type);
						 if(obj.type == "image" && service.checkURL(obj.data) == false){
                           
                            var parseFile = new Parse.File("myfile.jpeg", { base64: obj.data });						   
						   
                            _ideaData.set("imgFile", parseFile);
                            $ionicLoading.show({
								content: 'Saving...',
								animation: 'fade-in',
								showBackdrop: true,
								maxWidth: 200,
								showDelay: 0
							});                     
							_ideaData.save(null, {
							  success: function(idea) {
								$ionicLoading.hide();
							  },
							  error: function(idea, error) {
								$ionicLoading.hide();
							    //alert('Failed to create new object, with error code: ' + error.message);
							  }
							});
                                                  
                           
                         } else if(obj.type == "text"){
                               _ideaData.set("data", obj.data);                           
							   _ideaData.save();
                        } 
					}


					//Update Business Financial List on Parse
					for(var j = 0; j < idea.business_financial_list.length; j++){
						var obj = idea.business_financial_list[j];
	
						var _IdeaData = Parse.Object.extend("IdeaData");
						var _ideaData = new _IdeaData();
						 
						 
						_ideaData.setACL(new Parse.ACL($rootScope.user));
						_ideaData.set("ideaId", idea.id);
						_ideaData.set("category", "bussines_financials");
						_ideaData.set("type", obj.type);
						 if(obj.type == "image" && service.checkURL(obj.data) == false){
                           
                            var parseFile = new Parse.File("myfile.jpeg", { base64: obj.data });						   
						   
                            _ideaData.set("imgFile", parseFile);
                            $ionicLoading.show({
								content: 'Saving...',
								animation: 'fade-in',
								showBackdrop: true,
								maxWidth: 200,
								showDelay: 0
							});                     
                            
							_ideaData.save(null, {
							  success: function(idea) {
								$ionicLoading.hide();
							  },
							  error: function(idea, error) {
								$ionicLoading.hide();
							    //alert('Failed to create new object, with error code: ' + error.message);
							  }
							});
                                                  
                           
                         } else if(obj.type == "text"){
                               _ideaData.set("data", obj.data);                           
							   _ideaData.save();
                        } 
					}


					//Update Execution Keypeople List on Parse
					for(var j = 0; j < idea.execution_people_list.length; j++){
						var obj = idea.execution_people_list[j];
	
						var _IdeaData = Parse.Object.extend("IdeaData");
						var _ideaData = new _IdeaData();
						 
						 
						_ideaData.setACL(new Parse.ACL($rootScope.user));
						_ideaData.set("ideaId", idea.id);
						_ideaData.set("category", "execution_keypeople");
						_ideaData.set("type", obj.type);
						 if(obj.type == "image" && service.checkURL(obj.data) == false){
                           
                            var parseFile = new Parse.File("myfile.jpeg", { base64: obj.data });						   
						   
                            _ideaData.set("imgFile", parseFile);
                            $ionicLoading.show({
								content: 'Saving...',
								animation: 'fade-in',
								showBackdrop: true,
								maxWidth: 200,
								showDelay: 0
							});                     
                            
							_ideaData.save(null, {
							  success: function(idea) {
								$ionicLoading.hide();
							  },
							  error: function(idea, error) {
								$ionicLoading.hide();
							    //alert('Failed to create new object, with error code: ' + error.message);
							  }
							});
                                                  
                           
                         } else if(obj.type == "text"){
                               _ideaData.set("data", obj.data);                           
							   _ideaData.save();
                        } 
					}


					//Update Execution Milestone List on Parse
					for(var j = 0; j < idea.execution_milestone_list.length; j++){
						var obj = idea.execution_milestone_list[j];
	
						var _IdeaData = Parse.Object.extend("IdeaData");
						var _ideaData = new _IdeaData();
						 
						_ideaData.setACL(new Parse.ACL($rootScope.user));
						_ideaData.set("ideaId", idea.id);
						_ideaData.set("category", "execution_milestones");
						_ideaData.set("type", obj.type);
						 if(obj.type == "image" && service.checkURL(obj.data) == false){
                           
                            var parseFile = new Parse.File("myfile.jpeg", { base64: obj.data });						   
						   
                            _ideaData.set("imgFile", parseFile);
                            $ionicLoading.show({
								content: 'Saving...',
								animation: 'fade-in',
								showBackdrop: true,
								maxWidth: 200,
								showDelay: 0
							});                     
							_ideaData.save(null, {
							  success: function(idea) {
								$ionicLoading.hide();
							  },
							  error: function(idea, error) {
								$ionicLoading.hide();
							    //alert('Failed to create new object, with error code: ' + error.message);
							  }
							});
                                                  
                           
                         } else if(obj.type == "text"){
                               _ideaData.set("data", obj.data);                           
							   _ideaData.save();
                        } 
					}


					//Update Execution Next Step List on Parse
					for(var j = 0; j < idea.execution_step_list.length; j++){
						var obj = idea.execution_step_list[j];
					
						var _IdeaData = Parse.Object.extend("IdeaData");
						var _ideaData = new _IdeaData();
						 
						_ideaData.setACL(new Parse.ACL($rootScope.user));
						_ideaData.set("ideaId", idea.id);
						_ideaData.set("category", "exection_nextsteps");
						_ideaData.set("type", obj.type);
						 if(obj.type == "image" && service.checkURL(obj.data) == false){
                           
                            var parseFile = new Parse.File("myfile.jpeg", { base64: obj.data });						   
						   
                            _ideaData.set("imgFile", parseFile);
                            $ionicLoading.show({
								content: 'Saving...',
								animation: 'fade-in',
								showBackdrop: true,
								maxWidth: 200,
								showDelay: 0
							});                     
                            
							_ideaData.save(null, {
							  success: function(idea) {
								$ionicLoading.hide();
							  },
							  error: function(idea, error) {
								$ionicLoading.hide();
							    //alert('Failed to create new object, with error code: ' + error.message);
							  }
							});
                                                  
                           
                         } else if(obj.type == "text"){
						   _ideaData.set("data", obj.data);                           
						   _ideaData.save();
                        } 
					}

				  },
				  error: function(error) {
				    alert("Error: " + error.code + " " + error.message);
				  }
				});


				service.idea_list[i]  = idea;

				//Update Problem list on Parse

				$rootScope.$broadcast('updateIdeaList', service.idea_list); 
				
				return;
			}
		}
	}
	
	
	// Random Id generator
	function getRandomInt(min, max) {
		return Math.floor(Math.random()*(max-min+1)) + min;
	}
	
	function generateNewId() {
		var length = 8;
		var timestamp = +new Date;
		
		var ts = timestamp.toString();
		var parts = ts.split("").reverse();
		var id = "";
		
		for(var i=0; i<length; ++i) {
			var index = getRandomInt(0, parts.length-1);
			id += parts[index];
		}
		
		return id;
	}
	return service;
});
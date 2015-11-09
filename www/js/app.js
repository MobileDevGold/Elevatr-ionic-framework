
angular.module('elevatr', ['ionic', 'elevatr.controllers', 'elevatr.services', 'elevatr.directives', 'ngCordova', 'monospaced.elastic'])

.run(function($rootScope, $ionicPlatform, $timeout, $cordovaSplashscreen, $state, $ionicLoading, $elevatrIdeaList, $ionicPopup, $cordovaSQLite, $cordovaFile) {
  $ionicPlatform.ready(function() {
  
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
    	cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    	cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      
      StatusBar.styleDefault();
	  StatusBar.overlaysWebView(false);
    }

    // Hide splash screen
    $timeout(function() {
    	$cordovaSplashscreen.hide();
    }, 500);
	
	$rootScope.version = "";

	cordova.getAppVersion.getVersionNumber(function (version) {
   	 $rootScope.version = version;
	});

	cordova.getAppVersion.getVersionCode(function (code) {
    	
	});

	$rootScope.db = $cordovaSQLite.openDB("Elevatr.sqlite");
  
	  var  bAuto = window.localStorage.getItem("bAuto");
	  if(bAuto == "1"){
		var email = window.localStorage.getItem("email");
		var password = window.localStorage.getItem("password");
		
		$rootScope.user.email = email;
		$rootScope.user.password = password;
		
		$rootScope.login();
		
	  }else{
		$state.go('welcome');   
	  }
	
  });
  
  // operation mode
  $rootScope.operation = 'new'; // new or edit
  
  // operation data
  $rootScope.idea = {
  	title: '',
  	name: ''
  };
  
  $rootScope.init_idea = function() {
  	$rootScope.idea.title = '';
  	$rootScope.idea.name = '';
  }
  $rootScope.objectId = '';
    // alert
  $rootScope.showAlert = function() {
    var alertPopup = $ionicPopup.alert({
      title: $rootScope.popupTitle,
      template: $rootScope.popupContent
    });
    
    alertPopup.then(function(res) {
      
    });
  };

    $rootScope.login = function() {

          $rootScope.loading = $ionicLoading.show({
              content: 'Logging in',
              animation: 'fade-in',
              showBackdrop: true,
              maxWidth: 200,
              showDelay: 0
          });

          var user = $rootScope.user;
          Parse.User.logIn(('' + user.email).toLowerCase(), user.password, {
              success: function(user) {
                  $ionicLoading.hide();
                  window.localStorage.setItem("bAuto", "1");
                  window.localStorage.setItem("email", $rootScope.user.email);
                  window.localStorage.setItem("password", $rootScope.user.password);
                  var email = $rootScope.user.email;
                  $rootScope.user = user;
                  $rootScope.isLoggedIn = true;                
                  $rootScope.userId = user.id;
                                   
                  
                  var Ideas = Parse.Object.extend("Ideas");
                  var query = new Parse.Query(Ideas);
                  query.equalTo("userId", user.id);
                  query.find({
                    success: function(results) {
                       for (var i = 0; i < results.length; i++) { 
                         var object = results[i];
                         var ideaId =   object.get("ideaId");
                         var title = object.get("title");
                         var name = object.get("name");
						 var objectId = object.id;
						 $rootScope.objectId = objectId;
						 $rootScope.ideaId = ideaId;
   
                         $elevatrIdeaList.getIdeaListById(objectId, ideaId, title, name);
                     }
                    },
                    error: function(error) {

                    }
                  });


				  $rootScope.importDatafromSqlite(email);
					
					
                  $state.go('home');
              },
              error: function(user, err) {
                  $ionicLoading.hide();
                  $rootScope.isLoggedIn = false;
                  // The login failed. Check error to see why.
                  if (err.code === 101) {
                      $rootScope.popupContent = 'Invalid login credentials';
                  } else {
                      $rootScope.popupContent = 'An unexpected error has ' +
                          'occurred, please try again.';
                  }
                 $rootScope.popupTitle = "Login failed";
                 $rootScope.showAlert();
                 $rootScope.$apply();
              }
          });
      };

  Parse.initialize('a3knsXm6rSKyManO3j4eKt6HiLI3ZENoqNiD2B8j', 'DoIgO6gi7wbbjxQYYjTfpxaD1Z4a5ThUEQ8ZUE4v');
	var currentUser = Parse.User.current();

  $rootScope.userId = "";
	$rootScope.isLoggedIn = false;

  $rootScope.user = {
    email: "",
    password: ""
  };


 
  $rootScope.importDatafromSqlite = function(email) {
	
	var User = Parse.Object.extend("User");
	var query = new Parse.Query(User);
	query.equalTo("email", email);
	query.find({
	  success: function(results) {
		// Do something with the returned Parse.Object values
		for (var i = 0; i < results.length; i++) { 
		  var object = results[i];
		
		  $rootScope.addIdeaFromSqlite(object.id);
		}
	  },
	  error: function(error) {
		//alert("Error: " + error.code + " " + error.message);
	  }
	});	
  }
  
  
  $rootScope.addIdeaFromSqlite = function(userId) {
		var query = "SELECT * FROM ZIDEA";

		$rootScope.sqliteIdeaList = [];
		
		$cordovaSQLite.execute($rootScope.db, query, []).then(function(res) {	 

		 	 for(i=0;i<res.rows.length;i++) {
		 	 	pk = res.rows.item(i).Z_PK;
		 	 	id = res.rows.item(i).ZIDEAID;
		 	 	title  = res.rows.item(i).ZTITLE;
		 	 	user = res.rows.item(i).ZUSER;

				var ideaId = $elevatrIdeaList.addIdea(userId, title, title);
				$rootScope.sqliteIdeaList.push({
					ideaId: ideaId,
		 	 		pk: pk,
		 	 		id: id,
		 	 		title: title,
		 	 		userId: user
		 	 	});
		 	 } 
			 
		 	 $rootScope.getSqliteIdeaData();

		}, 	
		 function (err) {
		   
		});
	}

	$rootScope.getSqliteIdeaData = function() {
		var query = "SELECT * FROM ZNOTE";
		
		$rootScope.sqliteIdeaDataList = [];
		$cordovaSQLite.execute($rootScope.db, query, []).then(function(res) {	 

		 	 for(i=0;i<res.rows.length;i++) {
		 	 	zidea = res.rows.item(i).ZIDEA;
		 	 	type = res.rows.item(i).ZTYPE;
		 	 	index = res.rows.item(i).ZINDEX;
		 	 	detail  = res.rows.item(i).ZDETAIL;
		 	 	id = res.rows.item(i).ZIDEA_ID;
		 	 	note_id = res.rows.item(i).ZNOTEID;

		 	 	$rootScope.sqliteIdeaDataList.push({
		 	 		zidea: zidea,
		 	 		ideadId: id,
		 	 		type: type,
		 	 		index: index,
		 	 		detail: detail,
		 	 		note_id: note_id
		 	 	});
		 	 	
		 	 } 
			 
		 	 $rootScope.addSqliteIdeaData();	     
		}, 
		 function (err) {
		      
		});
	}

	$rootScope.sqliteIdea = {
		idea_elevatr_pitch: "",
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
	};


	$rootScope.addSqliteIdeaData = function() {

		for(i=0;i<$rootScope.sqliteIdeaList.length; i++){
			var idea_problem_list = [], idea_solution_list = [], market_target_list = [], market_competition_list = [],	market_advantage_list = [], 		product_usecase_list = [], product_feature_list = [], product_identity_list = [], business_monetization_list = [],		business_distribution_list = [], business_financial_list  = [],	execution_people_list = [],	execution_milestone_list = [], execution_step_list = [];

			$rootScope.sqliteIdea = {
				title: "",
				name: "",
				idea_elevatr_pitch: "",
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
			};
			
			var temp = 0;
			var cnt = [];
			
			for(j=0;j<$rootScope.sqliteIdeaDataList.length;j++){
				var sqliteIdeaData = $rootScope.sqliteIdeaDataList[j]; 
				if($rootScope.sqliteIdeaList[i].pk == sqliteIdeaData.zidea){
					var idx = parseInt(sqliteIdeaData.index);
					//alert(idx);
					if(idx  == 1101){
						$rootScope.sqliteIdea.idea_elevatr_pitch = sqliteIdeaData.detail;
					}

					var type = "text";
					var detail = sqliteIdeaData.detail;
					if(sqliteIdeaData.type == "0"){
						type = "text";
						
						if(idx>=1200 && idx<1300){
							idea_problem_list.push({
								type: type,
								data: detail
							});
						}
						if(idx>=1300 && idx<1400){
							idea_solution_list.push({
								type: type,
								data: detail
							});
						}
						if(idx>=2100 && idx<2200){
							market_target_list.push({
								type: type,
								data: detail
							});
						}
						if(idx>=2200 && idx<2300){
							market_competition_list.push({
								type: type,
								data: detail
							});
						}
						if(idx>=2300 && idx<2400){
							market_advantage_list.push({
								type: type,
								data: detail
							});
						}
						if(idx>=3100 && idx<3200){
							product_usecase_list.push({
								type: type,
								data: detail
							});
						}
						if(idx>=3200 && idx<3300){
							product_feature_list.push({
								type: type,
								data: detail
							});
						}
						if(idx>=3300 && idx<3400){
							product_identity_list.push({
								type: type,
								data: detail
							});
						}
						if(idx>=4100 && idx<4200){
							business_monetization_list.push({
								type: type,
								data: detail
							});
						}
						if(idx>=4200 && idx<4300){
							business_distribution_list.push({
								type: type,
								data: detail
							});
						}
						if(idx>=4300 && idx<4400){
							business_financial_list.push({
								type: type,
								data: detail
							});
						}

						if(idx>=5100 && idx<5200){
							execution_people_list.push({
								type: type,
								data: detail
							});
						}
						if(idx>=5200 && idx<5300){
							execution_milestone_list.push({
								type: type,
								data: detail
							});
						}
						if(idx>=5300 && idx<5400){
							execution_step_list.push({
								type: type,
								data: detail
							});
						}
						
					}else{
						type = "image";
					    cnt.push(idx);
						var imageURI = cordova.file.documentsDirectory + detail;		
						
						window.resolveLocalFileSystemURL(imageURI, gotFileEntry, failSystem);
						
						var gotFileEntry = function(fileEntry) {
						    
							//convert all file to base64 formats
							fileEntry.file( function(file) {
								var reader = new FileReader();
								reader.onloadend = function(evt) {
									
									type = "image";
									detail = evt.target.result;
									
									idx  = cnt[temp];
									temp++;
									
									if(idx>=1200 && idx<1300){
										idea_problem_list.push({
											type: type,
											data: detail
										});
									}
									if(idx>=1300 && idx<1400){
										idea_solution_list.push({
											type: type,
											data: detail
										});
									}
									if(idx>=2100 && idx<2200){
										market_target_list.push({
											type: type,
											data: detail
										});
									}
									if(idx>=2200 && idx<2300){
										market_competition_list.push({
											type: type,
											data: detail
										});
									}
									if(idx>=2300 && idx<2400){
										market_advantage_list.push({
											type: type,
											data: detail
										});
									}
									if(idx>=3100 && idx<3200){
										product_usecase_list.push({
											type: type,
											data: detail
										});
									}
									if(idx>=3200 && idx<3300){
										product_feature_list.push({
											type: type,
											data: detail
										});
									}
									if(idx>=3300 && idx<3400){
										product_identity_list.push({
											type: type,
											data: detail
										});
									}
									if(idx>=4100 && idx<4200){
										business_monetization_list.push({
											type: type,
											data: detail
										});
									}
									if(idx>=4200 && idx<4300){
										business_distribution_list.push({
											type: type,
											data: detail
										});
									}
									if(idx>=4300 && idx<4400){
										business_financial_list.push({
											type: type,
											data: detail
										});
									}

									if(idx>=5100 && idx<5200){
										execution_people_list.push({
											type: type,
											data: detail
										});
									}
									if(idx>=5200 && idx<5300){
										execution_milestone_list.push({
											type: type,
											data: detail
										});
									}
									if(idx>=5300 && idx<5400){
										execution_step_list.push({
											type: type,
											data: detail
										});
									}
								};
								reader.readAsDataURL(file);
							}, failFile);
						};
						
						var failSystem=function(){
							

						}
						
						var failFile=function(){
							
							throw "toobig";
						};
					}
				}
			}


			$rootScope.sqliteIdea.id = $rootScope.sqliteIdeaList[i].ideaId;
			$rootScope.sqliteIdea.title = $rootScope.sqliteIdeaList[i].title;
			$rootScope.sqliteIdea.name = $rootScope.sqliteIdeaList[i].title;
			$rootScope.sqliteIdea.idea_problem_list = idea_problem_list;
			$rootScope.sqliteIdea.idea_solution_list = idea_solution_list;
			$rootScope.sqliteIdea.market_target_list = market_target_list;
			$rootScope.sqliteIdea.market_competition_list = market_competition_list;
			$rootScope.sqliteIdea.market_advantage_list = market_advantage_list;
			$rootScope.sqliteIdea.product_usecase_list = product_usecase_list;
			$rootScope.sqliteIdea.product_feature_list = product_feature_list;
			$rootScope.sqliteIdea.product_identity_list = product_identity_list;
			$rootScope.sqliteIdea.business_monetization_list = business_monetization_list;
			$rootScope.sqliteIdea.business_distribution_list = business_distribution_list;
			$rootScope.sqliteIdea.business_financial_list = business_financial_list;
			$rootScope.sqliteIdea.execution_people_list = execution_people_list;
			$rootScope.sqliteIdea.execution_milestone_list = execution_milestone_list;
			$rootScope.sqliteIdea.execution_step_list = execution_step_list;
			
			$elevatrIdeaList.updateIdea($rootScope.sqliteIdea);

			$rootScope.$apply();
			$rootScope.$digest();
		}


		//remove sqlite file.
		$cordovaSQLite.deleteDB("Elevatr.sqlite");
	}
  
 
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  
  .state('home', {
    url: "/home",
    templateUrl: "templates/home.html",
    controller: 'HomeCtrl'
  })

  .state('categorylist', {
  	cache: false,
    url: "/categorylist/:ideaId",
    templateUrl: "templates/categorylist.html",
    controller: 'CategoryListCtrl'
  })
  
  .state('account', {
    url: "/account",
    templateUrl: "templates/account.html",
    controller: 'AccountCtrl'
  })

  .state('welcome', {
    url: "/welcome",
    templateUrl: "templates/welcome.html",
    controller: 'SettingsCtrl'
  })
  
  .state('settings', {
    url: "/settings",
    templateUrl: "templates/settings.html",
    controller: 'SettingsCtrl'
  });
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/welcome');
});

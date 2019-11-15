
var db = require('./db');

//var ldap = require('ldapjs');

exports.RouteGetSomething = function (req, res) {
    res.status(200).json({ "value": "hello world", "params": req.params });
}
exports.RoutePostSomething = function (req, res) {
    res.status(200).json({ "params=": req.params, "body": req.body });
}
exports.getLoginPage = function (req, res) {

    res.render('login.ejs', {
        title: "Welcome to CRM Application"
        , message: ''

    });
};
exports.validateLogin = function (req, res) {


    let psno = req.body.psno;
    let pwd = req.body.pwd;

    /*var ldap = require('ldapjs');
    let usernameQuery = "call procUserAuthentication( '" + psno + "');";

    db.query(usernameQuery, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }

        else {

            let email = result[0][0].EMAIL;

            var client = ldap.createClient({

                url: 'ldap://BRDIESMSDC01.lnties.com/DC=lnties,DC=com'

            });

            var opts = {
                filter: '(objectclass=user)',
                scope: 'sub',
                attributes: ['objectGUID']
            };


            client.bind(email, pwd, function (err) {

                if (err) {
                    message = 'Incorrect Credentials';

                    return res.status(500).send(err);
                }
                else {
                    res.redirect('/home');
                }
            });
        }

    });*/
    let query = "CALL procLoginAuthenticationWithoutLDAP('" +psno + "', '" + pwd + "')";

    db.query(query, (err, result) => {

        if (err) {
            message = 'Incorrect Credentials';

            return res.status(500).send(err);

        }
        res.redirect('/home');

    });

};
exports.getHomePage = function (req, res) {

    res.render('home.ejs', {
        title: "Welcome to CRM Application"


    });

};
exports.getLeadPage = function (req, res) {

    let query = 'CALL procAdminListAllLeads("All")';

    db.query(query, (err, result) => {

        if (err) {
            res.redirect('/');

        }
        res.status(200).json(result);

    });
};
exports.getEmpPage = function (req, res) {


    let query = "CALL procListAllEmployees()"; // query database to get all the employees
//console.log(query);
    db.query(query, (err, result) => {

        if (err) {
            res.redirect('/');

        }
        else {
            res.status(200).json(result);

        }
    });
};
exports.addLead = function (req, res) {

    let message = '';
    let title = req.body.title;
   // console.log(title);
    let companyacc = req.body.company;
    let leadcontid = req.body.leadcontid;
    let owner = req.body.owner;
    let status = req.body.status;
    let qul = req.body.qul;
    let source = req.body.source;
    let category = req.body.category;
    let priority = req.body.priority;
    let leadnotes = req.body.leadnotes;
    let icreatedby = req.body.icreatedby;
  
    let query = "call procInsertLead('" +
        title + "', '" + companyacc + "', '" + leadcontid + "', '" + owner + "','" + status + "','" + qul +
        "',  '" + source + "',  '" + category + "',  '" + priority + "', '" + leadnotes + "','" + icreatedby + "',@output)";
//console.log(query);

    db.query(query, (err, result2) => {
        if (err) {
            //console.log(err)
            return res.status(500).send(err);
        }
        let query1="SELECT @output as leadID";
        db.query(query1, (err, result3) => {
            if (err) {
               // console.log(err)
                return res.status(500).send(err);
            }
            res.status(200).json(result3);
            //console.log(result3);
        });
       
    });
};
exports.addleadcompany = function (req, res) {
  

    let company = req.body.company;

    
    let parentaccountID = req.body.parentaccountID;
    let status = req.body.prospect;
    let website = req.body.website;

    let accountcategory = req.body.accountcategoryID;
    let own = req.body.owner;
    let ownerID= req.body.ownerID;


    let query = "call `procInsertAccount`('" +company + "', '" + parentaccountID + "','" + accountcategory + "','" + status + "', '" + website + "','" + ownerID + "','" + own + "',@output,@output1)";
   // console.log(query);
    db.query(query, (err, result2) => {
        if (err) {
         //   console.log(err)
            return res.status(500).send(err);
        }
        let query1="SELECT @output1 as oAcctID,@output as msg";
        db.query(query1, (err, result3) => {
            if (err) {
             console.log(err)
                return res.status(500).send(err);
            }
            res.status(200).json(result3);
         //   console.log(result3);
        });
       
    });

};


exports.addcontactinfo = function (req, res) {

    let fname = req.body.contfname;
    let lname = req.body.contlname;
    let contjobtit = req.body.contjobtit;
    let contjobfunid = req.body.contjobfunid;
    let ideptID = req.body.ideptID;
    let icreateBy = req.body.icreateBy;
    
    
   
   let query = "call `procInsertContact` ('" +fname + "', '" + lname + "', '" + contjobtit + "', '" + contjobfunid + "','" + ideptID + "', '"
    + icreateBy + "',@output)";

    db.query(query, (err, result2) => {
        if (err) {
         //   console.log(err)
            return res.status(500).send(err);
        }
        let query1="SELECT @output as oContactID";
        db.query(query1, (err, result3) => {
            if (err) {
              //  console.log(err)
                return res.status(500).send(err);
            }
            res.status(200).json(result3);
        //    console.log(result3);
        });
       
    });

};

exports.editLeadPage = function (req, res) {
    let playerId = req.params.id;
    let query = "SELECT * FROM `players` WHERE id = '" + playerId + "' ";

    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.render('edit-player.ejs', {
            title: "Edit Lead"
            , player: result[0]
            , message: ''
        });
    });
},
    exports.editLead = function (req, res) {
        let playerId = req.params.id;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let position = req.body.position;
        let number = req.body.number;

        let query = "UPDATE `players` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name + "', `position` = '" + position + "', `number` = '" + number + "' WHERE `players`.`id` = '" + playerId + "'";

        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/home');
        });
    };
exports.deleteLead = function (req, res) {

    let playerId = req.params.id;
    let deleteUserQuery = 'DELETE FROM players WHERE id = "' + playerId + '"';

    db.query(deleteUserQuery, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.redirect('/home');
    });


};

exports.recorddisplaylead = function (req, res) {


    var Sid = req.params.i;

    let query = "call procDisplayLeadOnLeadMouseHover('" +Sid + "')";

    db.query(query, (err, result) => {
        if (err) {

            return res.status(500).send(err);
        }
        res.status(200).json(result);

    });

};


exports.updateleadrecord = function (req, res) {

    var Sid = req.body.id;
    var titl = req.body.title;
    let compan = req.body.company;
    let firstnam = req.body.firstname;
    let qualle = req.body.qualificationlevel;
    let statu = req.body.status;
    let sourc = req.body.source;
    let categor = req.body.category;
    let owne = req.body.owner;
    let notes = req.body.notes;
    let priorit = req.body.priority;
   let  iUpdatedBy=req.body.iUpdatedBy;
   
    let query = "call procUpdateLead( '" + Sid + "', '" + titl + "', '" + compan + "', '" + firstnam + "','" + qualle + "', '" + statu + "', '" + sourc +
        "','" + categor + "', '" + owne + "','" + notes + "','" + priorit + "','" + iUpdatedBy + "')";
   
    db.query(query, (err, result) => {

        if (err) {
            return res.status(500).send(err);
        }
        res.redirect('/home');
    });
};

exports.deleteleadrecord = function (req, res) {

    let Sid = req.params.i;
    
    let deleteUserQuery = 'DELETE FROM leadcirruswave WHERE id = "' + Sid + '"';
    
    db.query(deleteUserQuery, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);
    });
}

exports.deleteleaddisplay = function (req, res) {


    var Sid = req.params.i;

    let query = 'select * from leadcirruswave where id="' + Sid + '" ';

    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);

    });

};
exports.statusdropdownfun = function (req, res) {

    let query = "CALL procLookUpLeadStatuses()";

    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);

    });

};
exports.qualidropdownfun = function (req, res) {

    let query = "CALL procLookUpLeadQualifications()";

    db.query(query, (err, result) => {
        if (err) {

            return res.status(500).send(err);
        }
        res.status(200).json(result);

    });

};
exports.catdropdownfun = function (req, res) {

    let query = "CALL procLookUpLeadCategories()";

    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);

    });

};
exports.priodropdownfun = function (req, res) {

    let query = "CALL procLookUpPriorities()";

    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);
      });
};
  exports.sourdropdownfun = function (req, res) {
   
    let query="CALL procLookUpLeadSources()"; 
    
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);

    });

};
exports.getBackPage = function (req, res) {
    res.render('login.ejs', {
        title: "Welcome to Crm Application"
        , message: ''
    });
};

exports.addContactPage = function (req, res) {

    let fname = req.body.firstname;
    let lname = req.body.lastname;
    let title = req.body.jobtitle;
    let function1 = req.body.functionname;
    let department = req.body.department;
    let createdby = req.body.createdby;
    let query = "CALL `procInsertContact` ('" +fname + "', '" + lname + "', '" + title + "','" + function1 + "','" +
        department + "','" + createdby + "',@output)";

//console.log(query);
        db.query(query, (err, result2) => {
            if (err) {
               
                return res.status(500).send(err);
            }
        
            let query1="SELECT @output as contaccid";
            db.query(query1, (err, result3) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.status(200).json(result3);
              
            });
           
        });
    
    };

    exports.insertcontactaccount = function (req, res) {
       
        let iAccountID = req.body.iAccountID;
        let iContactID = req.body.iContactID;
        let iCreatedBy = req.body.iCreatedBy;
     
    let query = "CALL `procInsertAccountContact`('" + iAccountID + "', '" + iContactID + "', '" + iCreatedBy + "')"; 
  // console.log(query);
    db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            else {
                res.status(200).json(result);
           // console.log(result);
            }
        });
    };

    exports.contactphone = function (req, res) {
       
        let iSourceID = req.body.iSourceID;
        let iAddressId = req.body.iAddressId;
        let iSourceType = req.body.iSourceType;
        let iCountryID = req.body.iCountryID;
        let iIsMobile = req.body.iIsMobile;
        let iIsFax = req.body.iIsFax;
        let iAreaCode = req.body.iAreaCode;
        let iPhoneNumber = req.body.iPhoneNumber;
        let iCompleteNumber = req.body.iCompleteNumber;
        let iIsDefault = req.body.iIsDefault;
        let createdby = req.body.createdby;
        
    let query = "CALL `procInsertPhone`('" + iSourceID + "', '" + iAddressId + "', '" + iSourceType + "','" +iCountryID + "','"
     + iIsMobile + "','" + iIsFax + "','" + iAreaCode + "','" + iPhoneNumber + "','" + iCompleteNumber + "','" + iIsDefault + "','" + createdby + "')"; // query database to get emails in contactmodal
    // console.log(query);
    db.query(query, (err, result) => {
            if (err) {
               // console.log(err);
                return res.status(500).send(err);
            }
            else {
                res.status(200).json(result);
              //  console.log(result);
            }
        });
    };

    exports.contactemail = function (req, res) {
       
        let iSourceID = req.body.iSourceID;
        let iAddressId = req.body.iAddressId;
        let iSourceType = req.body.iSourceType;
        let iEmail = req.body.iEmail;
        let iIsDefault = req.body.iIsDefault;
        let createdby = req.body.createdby;
        
    let query = "CALL `procInsertEmail`('" + iSourceID + "', '" + iAddressId + "', '" + iSourceType + "','" + iIsDefault + "','" +
    iEmail + "','" + createdby + "')"; // query database to get emails in contactmodal
   
    db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            else {
                res.status(200).json(result);
            
            }
        });
    };
       
exports.ContactPage = function (req, res) {
//console.log("ContactPage");
    var Sid = req.params.i;
    let query = " CALL `procAdminListAllContacts`()";

    db.query(query, (err, result) => {

        if (err) {
          //  console.log(err);
            res.redirect('/');

        }
        res.status(200).json(result);
     // console.log(result);

    });
};

exports.recorddisplaycont = function (req, res) {

    var Sid = req.params.i;

    let query = "CALL `devc4c`.`procEditContact`('" + Sid + "')";

    db.query(query, (err, result) => {

        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);
       // console.log(result);
    });

};

exports.updatereccontact = function (req, res) {

    var Sid = req.body.id;
    let salid = req.body.salutation;
    let actitle = req.body.academicTitle;
    let acc = req.body.accountid;
    let firstname = req.body.firstname;
    let mname = req.body.middleName;
    let lastname = req.body.lastname;  
    let jobtitle = req.body.jobtitle;
    let funct = req.body.functionname;
    let depart = req.body.department;
    let bestreachid = req.body.bestReachedBy;
    let contpermid = req.body.contactPermission;
    let phn = req.body.phone;
    let mob = req.body.mobile;
    let eml = req.body.email;
    let accountcontactId = req.body.accountcontactId;
    let iPhoneID=req.body.phoneid;
    let iEmailID=req.body.emailid;
    let iUpdatedBy = req.body.iUpdatedBy;
     let fa = req.body.fax;

   
    let query = "CALL `procUpdateContact`('" + Sid + "','" + salid + "','" + actitle + "','" + acc + "','" + firstname + "','" + mname + "', '" + lastname + "','"
     + jobtitle + "','" + funct + "','" + depart + "','" + bestreachid + "','" + contpermid + "','" + phn + "','" + mob +
      "','" + eml + "','" + accountcontactId + "','" + iPhoneID + "','" + iEmailID + "','" + iUpdatedBy + "')";
    
  // console.log(query);
     db.query(query, (err, result) => {

        if (err) {
           // console.log(err);
            return res.status(500).send(err);
        }
        res.status(200).json(result);
       // console.log(result);
    });

};

exports.deletecont = function (req, res) {

    let Sid = req.params.i;
    let deleteUserQuery = 'DELETE FROM contactcirruswave WHERE contactid = "' + Sid + '"';
    db.query(deleteUserQuery, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);
    });

}

exports.deletedisplaycont = function (req, res) {

    var Sid = req.params.i;
    let query = 'select * from contactcirruswave where contactid="' + Sid + '" ';
    db.query(query, (err, result) => {

        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);

    });

};

exports.BusinessPage = function (req, res) {

    let query = "CALL `procListAllBusinessPartners`()";

    db.query(query, (err, result) => {

        if (err) {
            res.redirect('/');

        }
        res.status(200).json(result);

    });
};

    exports.RevenueResourcePage = function (req, res) {
    
        let Startrow = req.params.Startrow;
       
        let EndRow = req.params.EndRow;
       
        let iOpportunityCode = req.params.iOpportunityCode;
        
        let iPlanningStatus = req.params.iPlanningStatus;
        
        let iParentAccountCode = req.params.iParentAccountCode;
        
        let iAccountId = req.params.iAccountId;
        
        let iSalesPhaseId = req.params.iSalesPhaseId;

        let iSearch = req.params.iSearch;

        let oldIdSearch = req.params.oldIdSearch;
       
        let query = "CALL `procAdminListO2RSummaryAdvanceFilter`(" + Startrow + "," + EndRow + "," + iOpportunityCode + "," + iPlanningStatus + "," + iParentAccountCode + "," + iAccountId + "," + iSalesPhaseId + "," + iSearch + "," + oldIdSearch + ",@output)";
    
        console.log(query);
      
        db.query(query, (err, result) => {
            if (err) {
            //    console.log(err);
                return res.status(500).send(err);
               
            }
           // res.status(200).json(result);

            let query1 = "SELECT @output as revenuerowid";
            
            db.query(query1, (err, result3) => {
                
                if (err) {
                    
                    return res.status(500).send(err);
               
                }
                
                res.status(200).json(result);
              
                console.log(result);

            });

        });
    };
    

exports.RevenuePlanningStatus = function (req, res) {

    let query = "CALL `procLookUpPlanningStatuses`()";

    db.query(query, (err, result) => {

        if (err) {
            res.redirect('/');

        }
        res.status(200).json(result);

    });
}

exports.RevenueAccountName = function (req, res) {

    let query = 'CALL `procAdminLookUpAccountsByFilter`("Parent")';

    db.query(query, (err, result) => {

        if (err) {
            res.redirect('/');

        }
        res.status(200).json(result);

    });
}

exports.RevenueCustomerName = function (req, res) {

    let query = "CALL `procLookUpCustomers`()";

    db.query(query, (err, result) => {

        if (err) {
            res.redirect('/');

        }
        res.status(200).json(result);

    });
}



exports.addAccountPage = function (req, res) {
    
    let message = '';
    let name = req.body.name;

    let status = req.body.prospect;

    let parentaccount = req.body.parentaccount;
    let parentaccountID = req.body.parentaccountID;
    
    let website = req.body.website;

    let accountcategory = req.body.accountcategory;

    let vertical = req.body.vertical;

    let cont = req.body.country;

    let cit = req.body.city;

    let stat = req.body.state;

    let own = req.body.owner;
    let ownerID= req.body.ownerID;
  
    let query = "call `procInsertAccount`('" +name + "', '" + parentaccountID + "','" + accountcategory + "', '" + status + "','" + website + "','" + ownerID + "','" + own + "',@output,@output1)";
//console.log(query);
        db.query(query, (err, result2) => {
        if (err) {
           
            return res.status(500).send(err);
        }
      // console.log(result2)
        let query1="SELECT @output as msg,@output1 as id";
        db.query(query1, (err, result3) => {
            if (err) {
         
                return res.status(500).send(err);
            }
            res.status(200).json(result3);
           
        });
       
    });

};
exports.accaddress = function (req, res) {
    let sourceid=req.body.iSourceID;
    let source = req.body.iSourceType;
    let addresstype = req.body.iAddressType;
    let addressline1 =req.body.iAddressLine1;
    let addressline2 =req.body.iAddressLine2;
   
    let postalcode = req.body.iPostalCode;
    let country = req.body.accountry;
    let city = req.body.acccity;
    let state = req.body.accstate;
    
     let billto = req.body.iBillTo;
    let shipto =req.body.iShipTo;
    let defaultadd = req.body.iIsDefault;
    let createdby = req.body.iCreatedBy;
     let query = "call procInsertAddress('" +sourceid + "','" +source + "','" +addresstype + "', '" + addressline1 + "','" + addressline2 + "', '" + city + "','" + state + "','" + postalcode + "','" + country + "','" + billto + "','" + shipto + "','" + defaultadd + "','" + createdby + "',@output)";

//console.log(query);
    db.query(query, (err, result2) => {
        if (err) {
           
            return res.status(500).send(err);
        }
        let query1="SELECT @output as accaaddressid";
        db.query(query1, (err, result3) => {
            if (err) {
               // console.log(err);
                return res.status(500).send(err);
            }
            res.status(200).json(result3);
           // console.log(result3);
            
        });
       
    });

};
exports.updateaccaddress = function (req, res) {
    let sourceid=req.body.iSourceID;
    let source = req.body.iSourceType;
    let addresstype = req.body.iAddressType;
    let addressline1 =req.body.iAddressLine1;
    let addressline2 =req.body.iAddressLine2;
   
    let postalcode = req.body.iPostalCode;
    let country = req.body.accountry;
    let city = req.body.acccity;
    let state = req.body.accstate;
    
     let billto = req.body.iBillTo;
    let shipto =req.body.iShipTo;
    let defaultadd = req.body.iIsDefault;
    let createdby = req.body.iCreatedBy;
     let query = "call procUpdateAddress('" +sourceid + "','" +source + "','" +addresstype + "', '" + addressline1 + "','" + addressline2 + "', '" + city + "','" + state + "','" + postalcode + "','" + country + "','" + billto + "','" + shipto + "','" + defaultadd + "','" + createdby + "')";

//console.log(query);
db.query(query, (err, result) => {

    if (err) {
        console.log(err);
        return res.status(500).send(err);
    }
    res.status(200).json(result);
});

};
exports.getAccountPage = function (req, res) {


    let query = 'call `procAdminListAllAccounts`("All")';

    db.query(query, (err, result) => {

        if (err) {

            res.redirect('/');

        }
        res.json(result);

    });
};

exports.updateaccount = function (req, res) {

    var Sid = req.body.id;
    let parentacc = req.body.parentaccount;
    let accountcat = req.body.accountcategory;
    let nam = req.body.name;
    let salesregion = req.body.salesregion;
    let webs = req.body.website;
    let own = req.body.owner;
    let readonly = req.body.readonly;
    let prosp = req.body.prospect;
    let updatedby = req.body.updatedby;
    
    let query = "call procUpdateAccount('" + Sid + "',  '" + parentacc + "','" + accountcat + "',  '" + nam + "','" + salesregion + "','" + webs + "', '" + own +"','" + readonly + "','" + prosp + "', '" + updatedby + "')";
//console.log(query);
    db.query(query, (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        res.status(200).json(result);
        //console.log(result);
    });
};
exports.recorddisplay = function (req, res) {
    var Sid = req.params.i;
    let query = 'call procEditAccount("' + Sid + '")';
    //console.log(query);
    db.query(query, (err, result) => {
        if (err) {
        //    console.log(err)
            return res.status(500).send(err);
        }
        res.status(200).json(result);

    });

};
exports.deletedisplayaccount = function (req, res) {
    var Sid = req.params.i;
    let query = 'select * from accountcirruswave where id="' + Sid + '" ';
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);
    });

};

exports.deleteaccount = function (req, res) {
    let Sid = req.params.i;
    let deleteUserQuery = 'DELETE FROM accountcirruswave WHERE id = "' + Sid + '"';
    db.query(deleteUserQuery, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);
    });
}

exports.getOpportunityPage = function (req, res) {
    let query1 = " call procAdminListAllOpportunities()";
    db.query(query1, (err, result2) => {
        if (err) {
            res.redirect('/');
        }
        res.status(200).json(result2);
    });
},

exports.addOpportunity = function (req, res) {
   // console.log('opportunity');
    let message = '';
    let iLeadID=req.body.leadid;
   // console.log(iLeadID);
    let iTitle = req.body.oppName;
    let iAccountID = req.body.Accountid;
    let iOpportunitySourceID = req.body.Source;
    let iExpectedValue = req.body.Exceptedvalue;
    let iStartDate = req.body.StartDate;
    let iEndD0ate = req.body.ClosingDate;
    let iSalesCycleID = req.body.SalesCycle;
    let iSalesPhaseID = req.body.Salesphase;
    let iProbability = req.body.Probability;       
    let iPublishToForecast = req.body.PublishtoForecast;
    let iOpportunityCategoryID = req.body.convertcategory;
    let iOwnerID = req.body.ownerid;
    let iNote = req.body.opponote;
    let iCreatedBy = req.body.createdby; 
    let query = "call `procConvertLeadToOpportunity`('" + iLeadID + "','" + iTitle + "', '" + iAccountID + "','" + iOpportunitySourceID + "','" 
    + iExpectedValue + "', '" + iStartDate + "', '" + iEndD0ate + "', '" + iSalesCycleID + "', '" 
    + iSalesPhaseID + "','" + iProbability + "','" + iPublishToForecast + "','" + iOpportunityCategoryID + "','"
     + iOwnerID + "','" + iNote + "','" + iCreatedBy + "', @output)";
    //   console.log(query);
        db.query(query, (err, result2) => {
            if (err) {
             //   console.log(err)
                return res.status(500).send(err);
            }
            let query1="SELECT @output as oOpportunityID";
            db.query(query1, (err, result3) => {
                if (err) {
               //     console.log(err)
                    return res.status(500).send(err);
                }
                res.status(200).json(result3);
              //  console.log(result3);
            });
           
        });
    
};

exports.updateOpportunity = function (req, res) {
    var Sid = req.body.iOpportunityID;
    let Account = req.body.account;
    let Name = req.body.name;
    let oppvertical = req.body.vertic;
    let PrimaryContact = req.body.primarycontact;  
    let Exceptedvalue = req.body.exceptedvalue;
    let tcv = req.body.propTCV;
    let alliance = req.body.alliancesdepen;
    let opptype = req.body.opptype;
    let StartDate = req.body.startdate;
    let ClosingDate = req.body.closedate;
    let Salesphase = req.body.salesphase;
    let oppstat = req.body.oppstatus;
    let rstart = req.body.Rstart;
    let rend = req.body.Rend;
    let Category = req.body.category;
    let Owner = req.body.owner;
    let sorg = req.body.sorg;
    let sunit = req.body.sunit;
    let soffice = req.body.soffice;
    let oppcustom = req.body.CUSTOM;
    let oppdate = req.body.wondate;
    let value = req.body.TNvalue;
    let wvalue = req.body.wvalue;
    let admin = req.body.UpdatedBy;
    let SalesCycle = req.body.salescycle;
    let Probability = req.body.probability;
    let ForecastCategory = req.body.forecastcategory;
    let Source = req.body.source;
    let opportunitystat = req.body.Status;
    let rstatus = req.body.Rstatus;
   

    let query = "call `procUpdateOpportunity` ('" + Sid + "','" + Account + "','" + Name + "','" + oppvertical + "','" + PrimaryContact + "','" + Exceptedvalue + "','"
        + tcv + "', '" + alliance + "','" + opptype + "','" + StartDate + "','" + ClosingDate + "','" + Salesphase + "','" + oppstat + "','"
        + rstart + "','" + rend + "','" + Category + "','" + Owner + "','" + sorg + "','"
        + sunit + "','" + soffice + "','" + oppcustom + "','" + oppdate + "','" + value + "','" + wvalue + "','" + admin + "')";
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);
    });
};

exports.opportunitydisplay = function (req, res) {
    var Sid = req.params.i;
    let query = "call `procDisplayOnOpportunityMouseHoover`('" + Sid + "' )";
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);
    });
};


exports.deleteopportunity = function (req, res) {
    let Sid = req.params.i;
    let deleteUserQuery = 'DELETE FROM opportunitiescirruswave WHERE id = "' + Sid + '"';
    db.query(deleteUserQuery, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);
    });
};

exports.deletedisplay = function (req, res) {
    let Sid = req.params.i;
    let deleteUserQuery = 'select * from opportunitiescirruswave where id="' + Sid + '"';

    db.query(deleteUserQuery, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);

    });
};

exports.sourceoppo = function (req, res) {
    let opposourceQuery = "CALL procLookUpOpportunitySources()";
    db.query(opposourceQuery, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);
    });
};

exports.SalesCycle = function (req, res) {
    let opposourceQuery = "CALL procLookUpSalesCycle()";
    db.query(opposourceQuery, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);
    });
};

exports.Salesphase = function (req, res) {
    let opposourceQuery = "CALL procLookUpSalesPhase()";
    db.query(opposourceQuery, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);

    });
};
exports.tiecalender = function (req, res) {
   
    let calenderQuery = "CALL procLookUpCalendarYears()";
    
    db.query(calenderQuery, (err, result) => {
        
        if (err) {
          
            return res.status(500).send(err);
        }
       
        res.status(200).json(result);

    });
};


exports.lookupquarters = function (req, res) {
    
    let query = 'call procLookUpQuarters()'
    //console.log(query);
    
    db.query(query, (err, result) => {
       
        if (err) {
           
            return res.status(500).send(err);
        }
        
        res.status(200).json(result);
    });
}; 
 

exports.Category = function (req, res) {
    let opposourceQuery = "CALL procLookUpOpportunityCategories()";
    db.query(opposourceQuery, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);
    });
};


exports.oppotype = function (req, res) {
    let opposourceQuery = "CALL procLookUpOpportunityTypes()";
    db.query(opposourceQuery, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);
    });
};

exports.oppostatus = function (req, res) {
    let opposourceQuery = "CALL procLookUpOpportunityStatuses()";
    db.query(opposourceQuery, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);
    });
};

exports.salesorg = function (req, res) {
    let opposourceQuery = "CALL procLookUpEmployeeRegions()";
    db.query(opposourceQuery, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);
    });
};

exports.salesuni = function (req, res) {
    let opposourceQuery = "CALL procLookUpSalesUnits()";
    db.query(opposourceQuery, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);
    });
};

exports.salesoff = function (req, res) {
    let opposourceQuery = "CALL procLookUpSalesOffices()";
    db.query(opposourceQuery, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);
    });
};

exports.customcat = function (req, res) {
    let opposourceQuery = "CALL procLookUpCustomCategories()";
    db.query(opposourceQuery, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);
    });
};


exports.Contactfun = function (req, res) {

    let query = 'call procLookUpJobFunctions();';

    db.query(query, (err, result) => {

        if (err) {

            return res.status(500).send(err);
        }
        res.status(200).json(result);


    });

};

exports.Contactdep = function (req, res) {

    let query = 'call procLookUpDepartments();';

    db.query(query, (err, result) => {

        if (err) {

            return res.status(500).send(err);
        }
        res.status(200).json(result);

    });

};

exports.Contactacademictitles = function (req, res) {

    let query = 'call procLookUpAcademicTitles();';

    db.query(query, (err, result) => {

        if (err) {

            return res.status(500).send(err);
        }
        res.status(200).json(result);

    });

};

exports.Contactsalutations = function (req, res) {

    let query = 'call procLookUpSalutations();';

    db.query(query, (err, result) => {

        if (err) {

            return res.status(500).send(err);
        }
        res.status(200).json(result);

    });

};

exports.Contactbestreachedby = function (req, res) {

    let query = 'call procLookUpBestReachedBy();';

    db.query(query, (err, result) => {

        if (err) {

            return res.status(500).send(err);
        }
        res.status(200).json(result);

    });

};

exports.Contactcontpermission = function (req, res) {

    let query = 'call procLookUpContactPermissions();';

    db.query(query, (err, result) => {

        if (err) {

            return res.status(500).send(err);
        }
        res.status(200).json(result);

    });

};

exports.ContactAccounts = function (req, res) {

    let query = "CALL procAdminListAllAccounts('All')"; // query database to get all the accounts in contactmodal

    db.query(query, (err, result) => {

        if (err) {
            res.redirect('/');
            
        }
        else{
            res.status(200).json(result);
        
        }
    });
};


exports.accountcat = function (req, res) {

    let query1 = "call procLookUpAccountCategories()";

    db.query(query1, (err, result) => {
        if (err) {

            return res.status(500).send(err);
        }
        res.status(200).json(result);

    });

};

exports.accountvert = function (req, res) {

    let query1 = "call procLookUpVertical()";

    db.query(query1, (err, result) => {
        if (err) {

            return res.status(500).send(err);
        }
        res.status(200).json(result);

    });

};
exports.accountsalesregion = function (req, res) {

    let query1 = "call procLookUpSalesregions()";

    db.query(query1, (err, result) => {
        if (err) {

            return res.status(500).send(err);
        }
        res.status(200).json(result);

    });

};

exports.accountcont = function (req, res) {

    let query1 = "call procLookUpCountries()";

    db.query(query1, (err, result) => {
        if (err) {

            return res.status(500).send(err);
        }
        res.status(200).json(result);

    });

};

exports.accountstate = function (req, res) {

    let iCountry = req.params.country;

    let query1 = 'call procLookUpStates("' + iCountry + '")';

    db.query(query1, (err, result) => {
        if (err) {

            return res.status(500).send(err);
        }
        res.status(200).json(result);

    });

};

exports.accparent = function (req, res) {

    let query1= 'call procAdminListAllAccounts("Parent")';
   
    db.query(query1, (err, result) => {
   if (err) {
    
       return res.status(500).send(err);
   }
   res.status(200).json(result);
   
   });
   
};

exports.accowner = function (req, res) {

    let query1= 'call procListAllEmployees'
   
    db.query(query1, (err, result) => {
   if (err) {
     
       return res.status(500).send(err);
   }
   res.status(200).json(result);
  
   });
   
   };
   exports.leadcontactdisplay = function (req, res) {

    var Sid = req.params.i;

    let query = 'call procGetPhoneData (leadid)'

    db.query(query, (err, result) => {

        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);

    });

};
exports.getServiceoffering = function (req, res) {
    let query = 'call procListAllServiceOfferings ()'
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);
    });
};

exports.revenueforecast = function (req, res) {

    let iOpportunityID = req.params.iOpportunityID;

    let query = "call `procEditO2RSummary`('" + iOpportunityID + "')";
    db.query(query, (err, result) => {
        console.log(query);

        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);
        
    });
};


exports.forecastoppresource = function (req, res) {

    let iOpportunityID = req.params.iOpportunityID;
	console.log(iOpportunityID);
	let iSaleServiceOfferingID = req.params.iSaleServiceOfferingID;
	console.log(iSaleServiceOfferingID);
    let query ="call procListIRSTransDataForDelivery ('" + iOpportunityID + "','" + iSaleServiceOfferingID + "')";
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);
        console.log(result);
    });
};


exports.serviceOfferingdisplay = function (req, res) {
    
    var Sid = req.params.i;
   
    let query = 'call procDisplayOnServiceOfferingMouseHoover ("' + Sid + '")'
    db.query(query, (err, result) => {
        if (err) {
            console.log("db error");
            return res.status(500).send(err);
        }
        res.status(200).json(result);
    });
};




exports.updatecontphone = function (req, res) {
       
    let iPhoneID = req.body.iPhoneID;
    let iSourceID = req.body.iSourceID;
    let iSourceType = req.body.iSourceType;
    let iCountryID = req.body.iCountryID;
    let iPhoneType = req.body.iPhoneType;
    let iCompleteNumber = req.body.iCompleteNumber;
    let iUpdateBy = req.body.iUpdateBy;
    
    
let query = "CALL `procUpdatePhone`('" + iPhoneID + "', '" + iSourceID + "', '" + iSourceType + "','" +iCountryID + "','"
 + iPhoneType + "','" + iCompleteNumber + "','" + iUpdateBy + "')";
// console.log(query);
db.query(query, (err, result) => {
        if (err) {
           // console.log(err);
            return res.status(500).send(err);
        }
        else {
            res.status(200).json(result);
            
        }
    });
};  


exports.updatecontemail = function (req, res) {
       
    let iEmailID = req.body.iEmailID;
    let iSourceID = req.body.iSourceID;
    let iSourceType = req.body.iSourceType;
    let iEmail = req.body.iEmail;
    let iUpdateBy = req.body.iUpdateBy;
    
    
let query = "CALL `procUpdateEmail`('" + iEmailID + "', '" + iSourceID + "', '" + iSourceType + "','" +iEmail + "','" + iUpdateBy + "')";
// console.log(query);
db.query(query, (err, result) => {
        if (err) {
           // console.log(err);
            return res.status(500).send(err);
        }
        else {
            res.status(200).json(result);
            
        }
    });
};   
   


exports.getbu = function (req, res) {



    let query = 'call procLookUpBusinessUnits()'

    db.query(query, (err, result) => {

        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);

    });

};
exports.getlocation = function (req, res) {



    let query = 'call proclookupdeliverylocationsforresourceplanning()'

    db.query(query, (err, result) => {

        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);

    });

};

exports.getengagmentType = function (req, res) {



    let query = 'call procLookUpEngagementTypes()'

    db.query(query, (err, result) => {

        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);

    });

};

exports.getUOM = function (req, res) {



    let query = 'call procLookUpUOM()'

    db.query(query, (err, result) => {

        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);

    });

};

exports.getVerticalByBu = function (req, res) {

    let ibu = req.params.buid;
    
    let query = 'call procLookUpVerticalByBU("' + ibu + '")'

    db.query(query, (err, result) => {

        if (err) {
           
            return res.status(500).send(err);
        }
        res.status(200).json(result);

    });

};

exports.getPortfolioByBu = function (req, res) {

    let ibu = req.params.buid;

    let query = 'call procLookUpPortfolios("' + ibu + '")'
//console.log(query);
    db.query(query, (err, result) => {

        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);

    });

};

exports.getSo = function (req, res) {

    let ipid = req.params.pid;

    let query = 'call procLookUpOfferings("' + ipid + '")';
//console.log(query);
    db.query(query, (err, result) => {

        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);

    });

};

exports.addServiceoffering = function (req, res) {
 
     let message = '';
     let iBuID=req.body.iBusinessUnitID;
    // console.log(iLeadID);
     let ipid = req.body.iPortfolioID;
     let ioid = req.body.iOfferingID;
     let ivid = req.body.iVerticalID;
     let ilid = req.body.iDeliveryLocationID;
     let ieid = req.body.iEngagementTypeID;
     let iserviceoffering = req.body.iServiceOffering;
     let iUOMid = req.body.iUnitOfMeasureID;
     let inotes = req.body.iNotes;
     let iassign = req.body.iIsAssignmentAllowed;       
     let iCreated = req.body.iCreatedBy;
     
     let query = "call `procInsertServiceOffering`('" + iBuID + "','" + ipid + "', '" + ioid + "','" + ivid + "','" 
     + ilid + "', '" + ieid + "', '" + iserviceoffering + "', '" + iUOMid + "', '" 
     + inotes + "','" + iassign + "','" + iCreated + "', @output , @output2)";
    console.log(query);
         db.query(query, (err, result2) => {
             if (err) {
              //   console.log(err)
                 return res.status(500).send(err);
             }
             let query1="SELECT @output as oServiceOfferingID, @output2 as oServiceOfferingCode";
             db.query(query1, (err, result3) => {
                 if (err) {
                //     console.log(err)
                     return res.status(500).send(err);
                 }
                 res.status(200).json(result3);
               //  console.log(result3);
             });
            
         });
     
 };

 exports.Tieinverticalgroup = function (req, res) {
  
    let query = 'CALL procLookUpBusinessUnitsTieIn();';

    db.query(query, (err, result) => {

        if (err) {

            return res.status(500).send(err);
        }
        res.status(200).json(result);


    });

};

exports.Tieinparaccbybu = function (req, res) {

    let ibu = req.params.buid;

    let query = "call procLookUpParentAccountbyBU('" + ibu + "')";
    
    db.query(query, (err, result) => {
        
        if (err) {
            return res.status(500).send(err);
       
        }
        res.status(200).json(result);
    });

}; 

exports.Tieinverticalunit = function (req, res) {
  
    let query = 'call procLookUpVertical();';

    db.query(query, (err, result) => {

        if (err) {

            return res.status(500).send(err);
        }
        res.status(200).json(result);

    });

};

exports.Tieinparaccbyvertical = function (req, res) {
  
    let ivd = req.params.ivuid;

    let query = 'CALL procLookUpParentAccountbyVertical("' + ivd + '");';

    db.query(query, (err, result) => {

        if (err) {

            return res.status(500).send(err);
        }
        res.status(200).json(result);

    });

};

exports.Tieinregionalmanager = function (req, res) {
 
    let query = 'call procLookUpAllRegionalManagers();';

    db.query(query, (err, result) => {

        if (err) {

            return res.status(500).send(err);
        }
        res.status(200).json(result);


    });

};

exports.Tieinterritorymanager = function (req, res) {

    let irm = req.params.rmid;
    
    let query = 'call procLookUpAllTerritoryManagers("' + irm + '");';

    db.query(query, (err, result) => {

        if (err) {

            return res.status(500).send(err);
        }
        res.status(200).json(result);


    });

};
exports.parentaccountdrop = function (req, res) {

   // let ipad = req.params.buid;

    let query = 'call procLookUpParentAccount()'
    
    db.query(query, (err, result) => {
     
        if (err) {
         
            return res.status(500).send(err);
        }
        res.status(200).json(result);
       
    });

};
 exports.tieinPage = function (req, res) {
    
    let iBusinessunitID = req.params.iBusinessunitID;
   
    let iVerticalD = req.params.iVerticalD;
   
    let iCalendaryearid = req.params.iCalendaryearid;
    
    let iQuarterID = req.params.iQuarterID;
    
    let iRegionaHeadiD = req.params.iRegionaHeadiD;
    
    let iTerritoryHeadiD = req.params.iTerritoryHeadiD;
    
    let iParentAccountID = req.params.iParentAccountID;
   
    let query = "CALL `procTieInLockInListingMain`('" + iBusinessunitID + "','" + iVerticalD + "','" + iCalendaryearid + "','" + iQuarterID + "','" + iRegionaHeadiD + "','" + iTerritoryHeadiD + "','" + iParentAccountID + "')";
//console.log(query);
    db.query(query, (err, result) => {
        if (err) {
  
            return res.status(500).send(err);
        }
        res.status(200).json(result);
      
    });
};

exports.businessunitsforaccount = function (req, res) {

    let iacid = req.params.acid;

    let query = 'call procLookUpBusinessUnitsForAccount("'+iacid+'")'
    
    db.query(query, (err, result) => {
     
        if (err) {
         
            return res.status(500).send(err);
        }
        res.status(200).json(result);
       
    });
};

exports.verticalbyaccount = function (req, res) {

    let ivacid = req.params.vacid;

    let query = 'call procLookUpVerticalByAccount("'+ivacid+'")'
    
    db.query(query, (err, result) => {
     
        if (err) {
         
            return res.status(500).send(err);
        }
        res.status(200).json(result);
       
    });

};

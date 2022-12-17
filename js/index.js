var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml"; 
var stdDBName = "Student-DB"; 
var stdRelationName = "StudentData"; 
var connToken = "90937876|-31949272126618714|90952107"; 

$("#studentid").focus();


function resetForm(){
    $("#studentid").val("");
    $("#studentName").val("");
    $("#studentclass").val("");
    $("#studentbirthdate").val("");
    $("#studentaddress").val("");
    $("#studentenroll").val("");
    $("#studentid").prop("disabled",false);
    $("#save").prop("disabled",true);
    $("#update").prop("disabled",true);
    $("#reset").prop("disabled",true);
    
    $("#studentName").prop("disabled",true);
    $("#studentclass").prop("disabled",true);
    $("#studentbirthdate").prop("disabled",true);
    $("#studentaddress").prop("disabled",true);
    $("#studentenroll").prop("disabled",true);
    $("#studentid").focus();
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj); 
    var record = JSON.parse(jsonObj.data).record; 
    $("#studentName").val(record.name);
    $("#studentclass").val(record.stuClass); 
    $("#studentbirthdate").val(record.dob); 
    $("#studentaddress").val(record.address); 
    $("#studentenroll").val(record.enrollDate);
}
function saveData(){
    var jsonStrObj = validateData();
    if (jsonStrObj === ""){
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, stdDBName, stdRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#studentid").focus();
}

function validateData(){
    var stuId, stuName, stuClass, stuDOB, stuAddress, stuEnrollDate;
    stuId = $("#studentid").val();
    stuName = $("#studentName").val();
    stuClass = $("#studentclass").val();
    stuDOB = $("#studentbirthdate").val();
    stuAddress = $("#studentaddress").val();
    stuEnrollDate = $("#studentenroll").val();
    
    if(stuId === ''){
        alert("Student ID Missing");
        $("#studentid").focus();
        return "";
    }
    
    if(stuName === ''){
        alert("Student Name Missing");
        $("#studentName").focus();
        return "";
    }
    
    if(stuClass === ''){
        alert("Student Class Missing");
        $("#studentclass").focus();
        return "";
    }
    
    if(stuDOB === ''){
        alert("Student DOB Missing");
        $("#studentbirthdate").focus();
        return "";
    }
    
    if(stuAddress === ''){
        alert("Student Address Missing");
        $("#studentaddress").focus();
        return "";
    }
    
    if(stuEnrollDate === ''){
        alert("Student Enrollment Date Missing");
        $("#studentenroll").focus();
        return "";
    }
    
    var jsonStrObj = {
        id: stuId,
        name: stuName,
        stuClass: stuClass,
        dob: stuDOB,
        address: stuAddress,
        enrollDate: stuEnrollDate
    };
    
    return JSON.stringify(jsonStrObj);
}

function updateData(){
    $("#update").prop('disabled',true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, stdDBName, stdRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#studentid").focus();
}


function getStudent(){
    var studentIdJsonObj = getStudentIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, stdDBName, stdRelationName,studentIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if(resJsonObj.status === 400){
        $("#save").prop('disabled', false);
        $("#reset").prop("disabled", false);
        
        $("#studentName").prop("disabled",false);
        $("#studentclass").prop("disabled",false);
        $("#studentbirthdate").prop("disabled",false);
        $("#studentaddress").prop("disabled",false);
        $("#studentenroll").prop("disabled",false);
        
        $("#studentName").focus();
    }else if(resJsonObj.status === 200){
        $("#studentid").prop('disabled', true);
        fillData(resJsonObj);
        $("#update").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#studentName").prop("disabled",false);
        $("#studentclass").prop("disabled",false);
        $("#studentbirthdate").prop("disabled",false);
        $("#studentaddress").prop("disabled",false);
        $("#studentenroll").prop("disabled",false);
        $("#studentName").focus();
    }
}

function getStudentIdAsJsonObj(){
    var stuId = $("#studentid").val();
    var jsonStr = {
      id :stuId  
    };
    return JSON.stringify(jsonStr);
}

function saveRecNo2LS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno",lvData.rec_no);
}
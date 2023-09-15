//const { put } = require("../../server/routes/router")
var userEmail="";
$('#add_user').submit(function(event){
    alert("Data Saved Successfully")
})

$('#update_user').submit(function(event){
   event.preventDefault()
   var unindexed_array = $(this).serializeArray()
   var data = {}
   $.map(unindexed_array,function(n,i){
    data[n['name']] = n['value']
   })
   var  request = {
        "url":`http://localhost:3000/api/users/${data.id}`,
        "method":'PUT',
        "data":data
      }

    $.ajax(request).done(function(response){
        alert("Data Updated Successfully")
    })
})

if(window.location.pathname == '/'){
    $ondelete = $('.table tbody td a.delete')
    $ondelete.click(function(){
        var id =$(this).attr("data-id")
        var  request = {
            "url":`http://localhost:3000/api/users/${id}`,
            "method":'DELETE'
          }     
        if(confirm("Do you really want to delete this record?"))
        {
            $.ajax(request).done(function(response){
                alert("Data Deleted Successfully")
                location.reload()
            })
        }
    })
}

$('#forgot-password').click(function(event){
    event.preventDefault()
    var email= $('input[name="email"]').val();
    if(email == "")
    {
        $('#errMsg').text("Please provide the email id")
        $('input[name="email"]').focus()
    }
    else{
           $.ajax({
            method: "POST",
            url: `http://localhost:3000/forgot-password/${email}`,
            success: function(response){ 
                window.location ="http://localhost:3000/forgot-password?userEmail="+response.email;
            },
            error: function(request,status,errorThrown) {
                $('#errMsg').text("Email not registered!Please Signup")
            }
          });

    }
 })
 

 function loadEmail(){ 
    const urlParams = new URLSearchParams(window.location.search);
    const userEmail = urlParams.get('userEmail');
    $('#typeEmail').val(userEmail);
 }


//  function resendOTP(){
//    const email = $('#typeEmail').val();
//    $('#resend').attr("href","'/user/forgot-password/"+email+"'")
//  }

$('#reset-password').submit(function(event){
    event.preventDefault()
    var email = $('input[name="emailHidden"]').val();
    var pswd = $('input[name="password"]').val();
    var  request = {
         "url":`http://localhost:3000/change-password/${email}/${pswd}`, 
         "method":'POST'
       }
 
     $.ajax(request).done(function(response){
         alert("Password Updated Successfully")
         window.location = "http://localhost:3000/login"
     })
 })

 $('.update-category').click(function(event){
    event.preventDefault()
    var id = $(this).attr( "id" )
    window.location = `http://localhost:3000/admin/update-category/${id}`
 })

 $('#update-category').submit(function(event){  
    event.preventDefault()
    var unindexed_array = $(this).serializeArray()
    var data = {}
    $.map(unindexed_array,function(n,i){
     data[n['name']] = n['value']
    })
    var  request = {
         "url":`http://localhost:3000/admin/update-category/${data.id}`,
         "method":'PUT',
         "data":data
       }
 
     $.ajax(request).done(function(response){
         alert("Data Updated Successfully")
     })
 })

 $('.delete-category').click(function(event){
    event.preventDefault()
    var id = $(this).attr( "data-id" )
    var  request = {
        "url":`http://localhost:3000/admin/delete-category/${id}`,
        "method":'DELETE'
      }     
    if(confirm("Do you really want to delete this record?"))
    {
        $.ajax(request).done(function(response){
            alert("Data Deleted Successfully")
            location.reload()
        })
    }
 })
 

 
 $('.update-product').click(function(event){
    event.preventDefault()
    var id = $(this).attr( "id" )
    window.location = `http://localhost:3000/admin/update-product/${id}`
 })


 
 $('#update-product').submit(function(event){  
    event.preventDefault()
    var unindexed_array = $(this).serializeArray()
    var data = {}
    $.map(unindexed_array,function(n,i){
     data[n['name']] = n['value']
    })
    alert("indexxxxxxxxxxxxxxxxxx" + data)
    var  request = {
         "url":`http://localhost:3000/admin/update-product/${data.id}`,
         "method":'PUT',
         "data":data
       }
 
     $.ajax(request).done(function(response){
         alert("Data Updated Successfully")
     })
 })

 
 $('.delete-product').click(function(event){
    event.preventDefault()
    var id = $(this).attr( "data-id" )
    var  request = {
        "url":`http://localhost:3000/admin/delete-product/${id}`,
        "method":'DELETE'
      }     
    if(confirm("Do you really want to delete this record?"))
    {
        $.ajax(request).done(function(response){
            alert("Data Deleted Successfully")
            location.reload()
        })
    }
 })


 $('.user-blocked').click(function(event){
    var id = $(this).attr( "id" )
    var action = "unblock"
    var  request = {
        "url":`http://localhost:3000/admin/block-unblock-user/${id}/${action}`,
        "method":'PUT'
      }     
        $.ajax(request).done(function(response){
            alert("Status Updated Successfully")
            location.reload()
         })
 })

 $('.user-unblocked').click(function(event){
    var id = $(this).attr( "id" )
    var action = "block"
    var  request = {
        "url":`http://localhost:3000/admin/block-unblock-user/${id}/${action}`,
        "method":'PUT'
      }     
        $.ajax(request).done(function(response){
            alert("Status Updated Successfully")
            location.reload()
         })
 })

 $('.product-card').click(function(event){
  var id = $(this).attr( "id" )
  var  request = {
      "url":`http://localhost:3000/view-product-details/${id}`,
      "method":'GET'
    }     
      $.ajax(request).done(function(response){
       window.location =`http://localhost:3000/view-product-details/${id}`
       })
})
 
$('.add-to-item').click(function(event){ 
  var prodId = $(this).attr( "id" )
  // $(this).hide()
  
   $.ajax({
    url:`http://localhost:3000/add-to-cart/${prodId}`,
    method: 'POST',
    success: (response) => {
       var cart = document.getElementById("toast-cart");
       cart.classList.add("show");
       if(response === true)
         cart.innerHTML = '<i class="fas fa-shopping-cart cart"></i> Product added to cart';
       else
         cart.innerHTML = '<i class="fas fa-shopping-cart cart"></i> Quantity Incremented';
       setTimeout(function(){
       cart.classList.remove("show");
   }, 3000);
  
    }
   }) 
   
})

 function wishList(proId){
  //var heart = $("#heart_"+proId);
  var heart = document.getElementById("heart_"+proId);
  //alert(heart)
  // if(heart.hasClass("heart-active")){
    // heart.classList.remove("heart-active");
  //  }
  //  else{
  //  heart.classList.add("heart-active");
  // }
  //var url = `http://localhost:3000/add-to-wishlist/${proId}`

  var  request = {
    "url":`http://localhost:3000/add-to-wishlist/${proId}`,
    "method":'PUT'
  }

$.ajax(request).done(function(response){
  
     var list = document.getElementById("toast");
    list.classList.add("show");
    if(response === true)
      list.innerHTML = '<i class="far fa-heart wish"></i> Product added to List';
    else
    list.innerHTML = '<i class="far fa-heart wish"></i> "Already added"';

    setTimeout(function(){
      list.classList.remove("show");
    },3000);
 })
}
 

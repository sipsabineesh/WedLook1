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
        "url":`/api/users/${data.id}`,
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
            "url":`/api/users/${id}`,
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
            url: `/forgot-password/${email}`,
            success: function(response){ 
                window.location ="/forgot-password?userEmail="+response.email;
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
         "url":`/change-password/${email}/${pswd}`, 
         "method":'POST'
       }
 
     $.ajax(request).done(function(response){
         alert("Password Updated Successfully")
         window.location = "/login"
     })
 })

 $('.update-category').click(function(event){
    event.preventDefault()
    var id = $(this).attr( "id" )
    window.location = `/admin/update-category/${id}`
 })

 $('#update-category').submit(function(event){  
    event.preventDefault()
    var unindexed_array = $(this).serializeArray()
    var data = {}
    $.map(unindexed_array,function(n,i){
     data[n['name']] = n['value']
    })
    var  request = {
         "url":`/admin/update-category/${data.id}`,
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
        "url":`/admin/delete-category/${id}`,
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
    window.location = `/admin/update-product/${id}`
 })


 
 $('#update-product').submit(function(event){  
    event.preventDefault()
    var unindexed_array = $(this).serializeArray()
    var data = {}
    $.map(unindexed_array,function(n,i){
     data[n['name']] = n['value']
    })
    var  request = {
         "url":`/admin/update-product/${data.id}`,
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
        "url":`/admin/delete-product/${id}`,
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
    var msg = document.getElementById("toast");
    msg.classList.add("show");
    msg.innerHTML = '<i class="fa-solid fa-unlock"></i> Unblocked';
    setTimeout(function(){
      msg.classList.remove("show");
    }, 3000);
    var  request = {
        "url":`/admin/block-unblock-user/${id}/${action}`,
        "method":'PUT'
      }     
        $.ajax(request).done(function(response){
          var msg = document.getElementById("toast");
          msg.classList.add("show");
          msg.innerHTML = '<i class="fa-solid fa-unlock"></i> Unblocked';
          setTimeout(function(){
            msg.classList.remove("show");
          }, 3000);
            location.reload()
         })
 })

 $('.user-unblocked').click(function(event){
    var id = $(this).attr( "id" )
    var action = "block"
    var msg = document.getElementById("toast");
    msg.classList.add("show");
    msg.innerHTML = '<i class="fa-solid fa-lock"></i> Blocked';
    setTimeout(function(){
      msg.classList.remove("show");
    }, 3000);
    var  request = {
        "url":`/admin/block-unblock-user/${id}/${action}`,
        "method":'PUT'
      }     
        $.ajax(request).done(function(response){
          var msg = document.getElementById("toast");
          msg.classList.add("show");
          msg.innerHTML = '<i class="fa-solid fa-lock"></i> Blocked';
          setTimeout(function(){
            msg.classList.remove("show");
          }, 3000);
            location.reload()
         })
 })

 $('.product-card').click(function(event){
  var id = $(this).attr( "id" )
  var  request = {
      "url":`/view-product-details/${id}`,
      "method":'GET'
    }     
      $.ajax(request).done(function(response){
       window.location =`/view-product-details/${id}`
       })
})
 
$('.add-to-item').click(function(event){ 
  var prodId = $(this).attr( "id" )
  // $(this).hide()
  
   $.ajax({
    url:`/add-to-cart/${prodId}`,
    method: 'POST',
    success: (response) => {
       var cart = document.getElementById("toast-cart");
       cart.classList.add("show");
       if(response === true)
         cart.innerHTML = '<i class="fas fa-shopping-cart cart"></i> Product added to cart';
       else if(response === false)
         cart.innerHTML = '<i class="fas fa-shopping-cart cart"></i> Quantity Incremented';
       else
         cart.innerHTML = '<i class="fas fa-shopping-cart cart"></i> Out Of Stock';
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
    "url":`/add-to-wishlist/${proId}`,
    "method":'PUT'
  }

$.ajax(request).done(function(response){
     var list = document.getElementById("toast");
    list.classList.add("show");
    if(response === true) {  
      list.innerHTML = "Added to WishList";
    //  heart.classList.add("heart-active");
    }
    else {
       list.innerHTML = '<i class="far fa-heart wish"></i> "Already Added"';
    }

    setTimeout(function(){
      list.classList.remove("show");
    },3000);
 })
}

$('#address-form').submit(function(event){ 
  event.preventDefault()
  var unindexed_array = $(this).serializeArray()
  var data = {}
  $.map(unindexed_array,function(n,i){
   data[n['name']] = n['value']
  })
 
  var  request = {
       "url":`/add-address/${data.user}`,
       "method":'POST',
       "data":data
     }

   $.ajax(request).done(function(response){
    var address = document.getElementById("toast");
       address.classList.add("show");
       address.innerHTML = '<i class="fa-solid fa-address-book"></i>Address Added';
       setTimeout(function(){
       address.classList.remove("show");
   }, 3000);
   })
	location.reload();

})
 


// $('#add-address').click(function(event){ 
//   $('#address-form ').style.visibility = 'visible'
// })

$('#edit-address').submit(function(event){
  event.preventDefault()
  var unindexed_array = $(this).serializeArray()
  var data = {}
  $.map(unindexed_array,function(n,i){
   data[n['name']] = n['value']
  })
  var  request = {
       "url":`/edit-address/${data.id}`,
       "method":'PUT',
       "data":data
     }

   $.ajax(request).done(function(response){
       var address = document.getElementById("toast");
       address.classList.add("show");
       address.innerHTML = '<i class="fa-solid fa-address-book"></i>Address Updated';
       setTimeout(function(){
       address.classList.remove("show");
   }, 3000);
   })
})


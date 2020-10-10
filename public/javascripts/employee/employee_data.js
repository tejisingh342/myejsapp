$(() => {
  get_records();

   /* start select tag (etype) js */
   const selected = document.querySelector(".employeeModal .selected");
   const optionsContainer = document.querySelector(".employeeModal .options-container");
 
   const optionsList = document.querySelectorAll(".employeeModal .option");
 
   selected.addEventListener("click", () => {
     optionsContainer.classList.toggle("active");
   });
 
   optionsList.forEach((o) => {
     o.addEventListener("click", () => {
       o.querySelector("input").checked = true;
       selected.innerHTML =
         o.querySelector("label").innerHTML +
         '<i class="fas fa-chevron-down"></i>';
       optionsContainer.classList.remove("active");
     });
   });
   /* end select tag (etype) js */

  $(".theading button").click(function () {
    let employeeForm = document.querySelector('.employeeModal .modal-body form');
    employeeForm.reset();
    /* employeeForm.querySelector('#email_err, #name_err, #etype_err, #hourlyRate_err, #totalHour_err')
      .style.display = 'none'; */
    $('#email_err, #name_err, #etype_err, #hourlyRate_err, #totalHour_err').css('display', 'none');
          $('.employeeModal .modal-body form .select-box .selected').html(`
              Select Employee Type <i class="fas fa-chevron-down down_arrow_select"></i>
              <i class="fas fa-exclamation-circle text-danger form_error"
              id="etype_err"
              data-container="body"
              data-placement="left"></i>
          `);
    $('.employeeModal .modal-body form .buttons .submit_button')
          .prop('disabled', false).html(`
            <i class="fas fa-plus-square"></i> Insert Record`).fadeIn()
    $(".employeeModal .modal-header .modal-title").text(
      "Create New Employee Record",
      );
    $(".employeeModal").modal("toggle");
  });

  $(".employeeModal .modal-body form #hourlyRate, .employeeModal .modal-body form #totalHour")
    .keyup(() => {
      if((hourly_rate = $(".employeeModal .modal-body form #hourlyRate").val()) && (total_hour = $(".employeeModal .modal-body form #totalHour").val()) )
        $(".employeeModal .modal-body form #total").val(hourly_rate * total_hour);
      else
        $(".employeeModal .modal-body form #total").val('');
    })
  
  $(".employeeModal .modal-body form").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      url: "/insert_and_update",
      method: "post",
      dataType: "json",
      data: $(".employeeModal .modal-body form").serialize(),

      beforeSend: () => {
        $(this).find('.buttons .submit_button')
          .prop('disabled', true).html(`
            <img src="img/loader/bar_preloader.gif" alt="Loading"/>`).fadeIn();
      },

      success: async data => {
        $(this).find(".form_error").attr('data-original-title', '').hide();
        if (errs = data.errors)
        {
          errs.forEach((err) => {
            if (err.param == "etype")
              $(this).find('.down_arrow_select').animate({ right: "43px" });
            $(this)
              .find(`#${err.param}_err`)
              .attr('data-original-title', err.msg)
              .tooltip()
              .fadeIn();
          });
          $(this).find('.buttons .submit_button')
          .prop('disabled', false).html(`
            <i class="fas fa-plus-square"></i> Insert Record`).fadeIn()
        }
        else {
          $(this).find('.buttons .submit_button').html(`
           <i class="fas fa-check-square"></i> Inserted`).fadeIn()
          await waitFor(500);

          $(".employeeModal").modal("toggle");

          let hr = data.totalHour > 1 ? "Hours" : "Hour";
          $(".employeeTable tbody").prepend(`
            <tr employee_id="${data._id}">
              <td>${data.name}</td>
              <td>${data.email}</td>
              <td>${data.etype}</td>
              <td>Rs. ${data.hourlyRate}/-</td>
              <td>${data.totalHour} ${hr}</td>
              <td>Rs. ${data.total}/-</td>
            </tr>
          `);
          $('.employeeTable tbody tr').css("background","#212529")
          $(`.employeeTable tbody tr[employee_id = ${data._id}] td`)
          .css({ "color": 'limegreen' , "padding-left": "5px" })
          .animate({ "line-height": "2.5rem", opacity: 1 }, 750);
          await waitFor(750);

        }
      }

    });
  });

 
});

/* GET RECORDS */
const get_records = () => {
  $.ajax({
    url: "/employeeData",
    method: "post",
    data: { status: "Oh Yes." },
    dataType: "json",

    success: async data => {
      await asyncForEach(data, async (record) => {
        let hr = record.totalHour > 1 ? "Hours" : "Hour";
        $(".employeeTable tbody").append(`
          <tr employee_id="${record._id}">
            <td>${record.name}</td>
            <td>${record.email}</td>
            <td>${record.etype}</td>
            <td>Rs. ${record.hourlyRate}/-</td>
            <td>${record.totalHour} ${hr}</td>
            <td>Rs. ${record.total}/-</td>
          </tr>
        `);
        
        $(`.employeeTable tbody tr[employee_id = ${record._id}] td`)
          .css({ "padding-left": "5px" })
          .animate({ "line-height": "2.5rem", opacity: 1 }, 200);
        await waitFor(200);
      });
      /* $(".employeeTable tbody tr td")
        .css("border-top", "1px solid #dee2e6")
        .animate({ "line-height": "2.5rem" }, 300); */
    },
  });
};

//wait for
const waitFor = ms => new Promise(r => setTimeout(r, ms));

//ASYNC forEach function
const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

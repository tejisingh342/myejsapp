window.onload = () => {
  get_records();
  let For;
};

$(() => {
  /* start select tag (etype) js */
  const selected = document.querySelector(".employeeModal .selected");
  const optionsContainer = document.querySelector(
    ".employeeModal .options-container",
  );

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
    form_and_errors_reset();
    $(".employeeModal .modal-body form .select-box .selected").html(`
          Select Employee Type <i class="fas fa-chevron-down down_arrow_select"></i>
          <i class="fas fa-exclamation-circle text-danger form_error"
          id="etype_err"
          data-container="body"
          data-placement="left"></i>
      `);
    $(".employeeModal .modal-body form .buttons .submit_button")
      .html(`<i class="fas fa-plus-square"></i> Insert Record`)
      .fadeIn();
    $(".employeeModal .modal-header .modal-title").text(
      "Create New Employee Record",
    );
    For = "insert";
    $(".employeeModal").modal("toggle");
  });

  $(
    ".employeeModal .modal-body form #hourlyRate, .employeeModal .modal-body form #totalHour",
  ).keyup(() => {
    const hourly_rate = $(".employeeModal .modal-body form #hourlyRate").val();
    const total_hour = $(".employeeModal .modal-body form #totalHour").val();
    if (hourly_rate && total_hour)
      $(".employeeModal .modal-body form #total").val(hourly_rate * total_hour);
    else $(".employeeModal .modal-body form #total").val("");
  });

  // INSERT AND UPDATE RECORD
  $(".employeeModal .modal-body form").on("submit", function (e) {
    e.preventDefault();
    let btn_status;
    let data = $(".employeeModal .modal-body form").serialize();
    if (For !== "insert") {
      data += `&${$.param({ _id: For })}`;
      btn_status = '<i class="fas fa-save"></i> Save Record';
    } else btn_status = '<i class="fas fa-plus-square"></i> Insert Record';
    $.ajax({
      url: "/insert_and_update",
      method: "post",
      dataType: "json",
      data: data,

      beforeSend: () => {
        $(this)
          .find(".buttons .submit_button")
          .prop("disabled", true)
          .html(`<img src="img/loader/bar_preloader.gif" alt="Loading"/>`)
          .fadeIn();
      },

      statusCode: {
        // Insert and Update Record Success Status
        201: async (record) => {
          const btn_status = For === "insert" ? "Inserted" : "Updated";
          $(this)
            .find(".buttons .submit_button")
            .html(`<i class="fas fa-check-square"></i> ${btn_status}`)
            .prop("disabled", false)
            .fadeIn();
          await waitFor(500);
          $(".employeeModal").modal("toggle");

          $(".employeeTable tbody tr td").css("color", "#212529");

          const hr = record.totalHour > 1 ? "Hours" : "Hour";
          const Etype = record.etype.toUpperCase();

          if (For === "insert") {
            $(".employeeTable tbody").prepend(`
              <tr employee_id="${record._id}">
                <td>${record.name}</td>
                <td>${record.email}</td>
                <td>${Etype}</td>
                <td>Rs. ${record.hourlyRate}/-</td>
                <td>${record.totalHour} ${hr}</td>
                <td>Rs. ${record.total}/-</td>
                <td>
                  <button class="view text-primary" onclick = view_record("${record._id}")><i class="fas fa-list-alt"></i></button>
                  <button class="edit text-warning" onclick = edit_record("${record._id}")><i class="fas fa-edit"></i></button>
                  <button class="delete text-danger" onclick = delete_record("${record._id}")><i class="fas fa-trash-alt"></i></button>
                </td>
              </tr>
            `);
            $(`.employeeTable tbody tr[employee_id = ${record._id}] td`)
              .css({ color: "limegreen", "padding-left": "5px" })
              .animate({ "line-height": "2.5rem", opacity: 1 }, 500);
            await waitFor(500);
          } else {
            const tbl_row = $(
              `.employeeTable tbody tr[employee_id=${record._id}]`,
            );
            tbl_row.find("td").css("opacity", "0");
            await waitFor(500);
            $(tbl_row).find("td:nth-child(1)").text(record.name);
            $(tbl_row).find("td:nth-child(2)").text(record.email);
            $(tbl_row).find("td:nth-child(3)").text(Etype);
            $(tbl_row)
              .find("td:nth-child(4)")
              .text(`Rs. ${record.hourlyRate}/-`);
            $(tbl_row)
              .find("td:nth-child(5)")
              .text(record.totalHour + " " + hr);
            $(tbl_row).find("td:nth-child(6)").text(`Rs. ${record.total}/-`);

            tbl_row.find("td").css({ color: "limegreen", opacity: 1 });
            await waitFor(500);
          }
        },
        // Bad Request
        400: (err) => alert(err.responseJSON),
      },

      success: (data) => {
        $(this).find(".form_error").attr("data-original-title", "").hide();
        const errs = data.errors;
        if (errs) {
          errs.forEach((err) => {
            if (err.param === "etype")
              $(this).find(".down_arrow_select").animate({ right: "43px" });
            $(this)
              .find(`#${err.param}_err`)
              .attr("data-original-title", err.msg)
              .tooltip()
              .fadeIn();
          });
          $(this)
            .find(".buttons .submit_button")
            .prop("disabled", false)
            .html(btn_status)
            .fadeIn();
        }
      },
    });
  });
});

// GET RECORDS
const get_records = () => {
  $.ajax({
    url: "/employeeData",
    method: "post",
    data: { status: "Oh Yes." },
    dataType: "json",
    statusCode: {
      400: () => alert("Error: Bad Request."),
    },

    success: async (data) => {
      await asyncForEach(data, async (record) => {
        const hr = record.totalHour > 1 ? "Hours" : "Hour";
        const Etype = record.etype.toUpperCase();
        $(".employeeTable tbody").append(`
          <tr employee_id="${record._id}">
            <td>${record.name}</td>
            <td>${record.email}</td>
            <td>${Etype}</td>
            <td>Rs. ${record.hourlyRate}/-</td>
            <td>${record.totalHour} ${hr}</td>
            <td>Rs. ${record.total}/-</td>
            <td>
              <button class="view text-primary" onclick = view_record("${record._id}")><i class="fas fa-list-alt"></i></button>
              <button class="edit text-warning" onclick = edit_record("${record._id}")><i class="fas fa-edit"></i></button>
              <button class="delete text-danger" onclick = delete_record("${record._id}")><i class="fas fa-trash-alt"></i></button>
            </td>
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

// VIEW RECORD
const view_record = (employeeID) => {
  $.ajax({
    url: "/get_record",
    method: "post",
    data: { _id: employeeID },
    dataType: "json",
    statusCode: {
      400: (err) => alert(err.responseJSON),
    },

    success: (record) => {
      const employeeForm = $("#recordViewModal .modal-body form");
      $("#recordViewModal .modal-header .modal-title").text(
        `${record.name}'s Record`,
      );
      employeeForm.find("input#name").val(record.name);
      employeeForm.find("input#email").val(record.email);
      employeeForm.find("input#etype").val(record.etype);
      employeeForm.find("input#hourlyRate").val(record.hourlyRate);
      employeeForm.find("input#totalHour").val(record.totalHour);
      employeeForm.find("input#total").val(record.total);
      $("#recordViewModal").modal("show");
    },
  });
};

// GET RECORD FOR EDIT
const edit_record = (employeeID) => {
  $.ajax({
    url: "/get_record",
    method: "post",
    data: { _id: employeeID },
    dataType: "json",
    statusCode: {
      400: () => alert("Error: Bad Request."),
    },

    success: (record) => {
      form_and_errors_reset();
      const Etype = record.etype.toUpperCase();
      $(".employeeModal .modal-header .modal-title").text(
        `Edit ${record.name}'s Record`,
      );
      const employeeForm = $(".employeeModal .modal-body form");
      employeeForm
        .find(".buttons .submit_button")
        .html(`<i class="fas fa-save"></i> Save Record`);
      employeeForm.find("input#name").val(record.name);
      employeeForm.find("input#email").val(record.email);
      employeeForm
        .find(`.select-box .options-container input#${record.etype}`)
        .prop("checked", true);
      employeeForm
        .find(".select-box .selected")
        .html(`${Etype} <i class="fas fa-chevron-down down_arrow_select"></i>`);
      employeeForm.find("input#hourlyRate").val(record.hourlyRate);
      employeeForm.find("input#totalHour").val(record.totalHour);
      employeeForm.find("input#total").val(record.total);
      $(".employeeModal").modal("show");
      For = record._id;
    },
  });
};

// DELETE RECORD
const delete_record = (employeeID) => {
  $.ajax({
    url: "/delete_record",
    method: "post",
    data: { _id: employeeID },
    dataType: "json",
    statusCode: {
      400: () => alert("Error: Bad Request."),
    },

    success: (data) => {
      alert("stauts ok");
    },
  });
};

//Employee Modal Form and Errors Reset
const form_and_errors_reset = () => {
  const employeeForm = $(".employeeModal .modal-body form");
  employeeForm.trigger("reset");
  $(
    "#email_err, #name_err, #etype_err, #hourlyRate_err, #totalHour_err",
  ).hide();
};

//wait for
const waitFor = (ms) => new Promise((r) => setTimeout(r, ms));

//ASYNC forEach function
const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

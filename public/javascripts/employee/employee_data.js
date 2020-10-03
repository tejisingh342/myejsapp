$(() => {
  get_records();

  $(".theading button").click(function () {
    $(".employeeModal").modal("toggle");
    $(".employeeModal .modal-header .modal-title").text(
      "Create New Employee Record",
    );
  });
  $(".employeeModal .modal-body form").on("submit", function (e) {
    e.preventDefault();
  });
});

/* GET RECORDS */
const get_records = () => {
  $.ajax({
    url: "/employeeData",
    method: "post",
    data: { status: "Oh Yes." },
    dataType: "json",

    success: async function (data) {
      await asyncForEach(data, async (record) => {
        let hr = record.totalHour > 1 ? "Hours" : "Hour";
        $(".employeeTable tbody").append(
          `
          <tr employee_id="${record._id}">
            <td>${record.name}</td>
            <td>${record.email}</td>
            <td>${record.etype}</td>
            <td>Rs. ${record.hourlyRate}/-</td>
            <td>${record.totalHour} ${hr}</td>
            <td>Rs. ${record.total}/-</td>
          </tr>
        `,
        );
        $(`.employeeTable tbody tr[employee_id = ${record._id}] td`)
          .css({ "border-top": "1px solid #dee2e6", "padding-left": "5px" })
          .animate({ "line-height": "2.5rem", opacity: 1 }, 300);
        await waitFor(300);
      });
      /* $(".employeeTable tbody tr td")
        .css("border-top", "1px solid #dee2e6")
        .animate({ "line-height": "2.5rem" }, 300); */
    },
  });
};

//wait for
const waitFor = (ms) => new Promise((r) => setTimeout(r, ms));

//ASYNC forEach function
const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

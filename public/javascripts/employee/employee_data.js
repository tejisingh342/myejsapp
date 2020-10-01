$(() => {
  get_records();
});

/* GET RECORDS */
const get_records = () => {
  $.ajax({
    url: "/employeeData",
    method: "post",
    data: { status: "Oh Yes." },
    dataType: "json",

    success: function (data) {
      asyncForEach(data, async (record) => {
        $(".employeeTable tbody")
          .append(
            `
          <tr employee_id="${record._id}">
            <td>${record.name}</td>
            <td>${record.email}</td>
            <td>${record.etype}</td>
            <td>${record.hourlyRate}</td>
            <td>${record.totalHour}</td>
            <td>${record.total}</td>
          </tr>
        `,
          )
          .find("tr:last-child")
          .hide()
          .fadeIn();
        await waitFor(1000);
      });
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
const start = async () => {
  await asyncForEach([1, 2, 3], async (num) => {
    await waitFor(1000);
    console.log(num);
  });
  console.log("Done");
};

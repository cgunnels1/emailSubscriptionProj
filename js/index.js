class Subscriber {
  constructor(email) {
    this.email = email;
  }
}

class SubscriptionUI {
  static displayEmails() {
    var requestOptions = {
      method: "GET",
      withCredentials: true,
    };
    const response = fetch(
      "https://yu0gvua429.execute-api.us-east-1.amazonaws.com/dev",
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => insertEmailToTable(data.body));
  }
  static addEmailToDatabase(subscriber) {
    // instantiate a headers object
    var myHeaders = new Headers();
    // add content type header to object
    myHeaders.append("Content-Type", "application/json");
    // using built in JSON utility package turn object to string and store in a variable
    var raw = JSON.stringify({ email: subscriber.email });
    // create a JSON object with parameters for API call and store in a variable
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    // make API call with parameters and use promises to get response
    fetch(
      "https://yu0gvua429.execute-api.us-east-1.amazonaws.com/dev",
      requestOptions
    );
  }
  static clearField() {
    document.querySelector("#email").value = "";
  }
}

const removeEmailfromDatabase = (rmvEmail) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var raw = JSON.stringify({ email: rmvEmail.innerText });
  var requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  fetch(
    "https://yu0gvua429.execute-api.us-east-1.amazonaws.com/dev/",
    requestOptions
  )
    .then((response) => console.log(response.text()))
    .then((result) => alert(JSON.parse(result).body))
    .catch((error) => console.log("error", error));
};

const insertEmailToTable = (data) => {
  data = JSON.parse(data);
  data = data["Items"];
  const table = document.querySelector("#table-body");
  const row = data.map((email) => addRow([table, `${email.EMAIL.S}`]));
};

document.addEventListener("DOMContentLoaded", SubscriptionUI.displayEmails);

document.querySelector("#email-form").addEventListener("submit", (e) => {
  //e.preventDefault();
  const email = document.querySelector("#email").value;
  if (email === "") {
    alert("Please fill in field before submit");
  } else {
    const subscriber = new Subscriber(email);
    SubscriptionUI.addEmailToDatabase(subscriber);
    SubscriptionUI.clearField();
    alert(`Subscriber email: ${subscriber.email} has been added`);
  }
});

const addRow = (tabledata) => {
  const table = tabledata[0];
  var rowCount = table.rows.length;
  var row = table.insertRow(rowCount);

  var cell1 = row.insertCell(0);
  var element1 = document.createElement("input");
  element1.type = "checkbox";
  element1.name = "chkbox[]";
  cell1.appendChild(element1);

  var cell2 = row.insertCell(1);
  cell2.innerHTML = tabledata[1];
};

const deleteRow = (tableID) => {
  try {
    var table = document.getElementById(tableID);
    var rowCount = table.rows.length;
    if (rowCount === 0) {
      alert(
        "There are no emails to remove. Please add an email and try again."
      );
    }
    for (var i = 0; i < rowCount; i++) {
      var row = table.rows[i];
      var chkbox = row.cells[0].childNodes[0];
      if (null != chkbox && true == chkbox.checked) {
        removeEmailfromDatabase(row.cells[1]);
        table.deleteRow(i);
        rowCount--;
        i--;
      }
    }
  } catch (e) {
    alert(e);
  }
};

document.querySelector("#rbtn").addEventListener("click", (e) => {
  deleteRow("table-body");
});

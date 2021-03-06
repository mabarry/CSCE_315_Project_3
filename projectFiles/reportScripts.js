async function salesReport() {
    console.log("\nRUNNING SALES REPORT");

    const dateInfo = {
        startdate: document.getElementById("startdate").value,
        enddate: document.getElementById("enddate").value
    };
    console.log(dateInfo);

    // Query to get the customerSaleLine database
    const saleResponse = await fetch('/salesWithinDateRange', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dateInfo)
    });
    const saleLineDB = await saleResponse.json();
    console.log(saleLineDB);

    if (saleLineDB == "-1") {
        console.log("Invalid dates");
        // TODO: Add feedback
        return;
    }

    
    // Query to get the foodItems database
    const foodResponse = await fetch('/foodItems', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    const foodItemsDB = await foodResponse.json();

    // Create structues to hold the data
    var foodRevenues;
    var foodQuantities;
    (foodRevenues = []).length = foodItemsDB.length; 
    foodRevenues.fill(0.00);
    (foodQuantities = []).length = foodItemsDB.length; 
    foodQuantities.fill(0.00);

    var totalRevenue = 0.00;

    
    // For each sale line, sum up the quantity and cost sold
    for (var i = 0; i < saleLineDB.length; i++) {
        var saleFoodID = saleLineDB[i].foodid;
        var salePrice = saleLineDB[i].salelineprice;
        var saleQuantity = saleLineDB[i].salelinequantity;

        foodRevenues[saleFoodID - 1] += parseFloat(salePrice);
        foodQuantities[saleFoodID - 1] += parseFloat(saleQuantity);

        totalRevenue += parseFloat(salePrice);

        console.log(salePrice + "\n" + saleQuantity + "\n" + totalRevenue);
    }
    console.log(foodQuantities);
    console.log(foodRevenues);

    
    // Clear the report results table
    var table = document.getElementById("report");
    var tableLen = table.rows.length;
    for (var i = 1; i < tableLen; i++) {
        table.deleteRow(1);
    }

    // Fill the table with the report results
    var table = document.getElementById("report");
    for (var i = 0; i < foodItemsDB.length; i++) {
        // Create the new row
        var tr = document.createElement('tr');

        // Create all columns and fill them with data
        rowText = ' \
        <td>' + (i + 1) + '</td> \
        <td>' + foodItemsDB[i].foodname + '</td> \
        <td>' + foodQuantities[i].toFixed(2) + '</td> \
        <td>' + foodRevenues[i].toFixed(2) + '</td>';

        tr.innerHTML = rowText;
        table.appendChild(tr);
    }

    // Sum up the total revenue
    document.getElementById("revenue").innerHTML = totalRevenue.toFixed(2);
}


async function excessReport() {
    console.log("\nRUNNING EXCESS REPORT");

    const dateInfo = {
        startdate: document.getElementById("startdate").value,
        enddate: document.getElementById("enddate").value
    };
    console.log(dateInfo);

    // Query to get the customerSaleLine database
    const saleResponse = await fetch('/salesWithinDateRange', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dateInfo)
    });
    const saleLineDB = await saleResponse.json();
    console.log("SaleLineDB:");
    console.log(saleLineDB);

    if (saleLineDB == "-1") {
        console.log("Invalid dates");
        // TODO: Add feedback
        return;
    }

    
    // Query to get the foodItems database
    const foodResponse = await fetch('/foodItems', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    const foodItemsDB = await foodResponse.json();

    // Create structues to hold the data
    var foodQuantities;
    (foodQuantities = []).length = foodItemsDB.length; 
    foodQuantities.fill(0.00);

    
    // For each sale line, sum up the quantity sold
    for (var i = 0; i < saleLineDB.length; i++) {
        var saleFoodID = saleLineDB[i].foodid;
        var saleQuantity = saleLineDB[i].salelinequantity;

        foodQuantities[saleFoodID - 1] += parseFloat(saleQuantity);

        console.log("quantity sold: ");
        console.log(saleQuantity);
    }
    console.log(foodQuantities);

    
    // Clear the report results table
    var table = document.getElementById("report");
    var tableLen = table.rows.length;
    for (var i = 1; i < tableLen; i++) {
        table.deleteRow(1);
    }

    // Fill the table with the report results
    var table = document.getElementById("report");
    for (var i = 0; i < foodItemsDB.length; i++) {
        console.log("sold: " + foodQuantities[i] + "\nin inv: " + foodItemsDB[i].foodquantity + "\n10% of inv: " + 0.1 * foodItemsDB[i].foodquantity);
        if (foodQuantities[i] > 0.1 * foodItemsDB[i].foodquantity) {
            continue;
        }
        if (foodItemsDB[i].foodquantity == 0 && foodQuantities[i] == 0) {
            continue;
        }

        // Create the new row
        var tr = document.createElement('tr');

        // Create all columns and fill them with data
        rowText = ' \
        <td>' + (i + 1) + '</td> \
        <td>' + foodItemsDB[i].foodname + '</td> \
        <td>' + foodQuantities[i].toFixed(2) + '</td> \
        <td>' + foodItemsDB[i].foodquantity.toFixed(2) + '</td>';

        tr.innerHTML = rowText;
        table.appendChild(tr);
    }

    if (table.rows.length == 1) {
        //TODO: ADD Feedback
        var tr = document.createElement('tr');

        // Create all columns and fill them with data
        rowText = ' \
        <td></td> \
        <td></td> \
        <td>No Items sold less than 10%</td> \
        <td></td>';

        tr.innerHTML = rowText;
        table.appendChild(tr);
    }
}


async function restockReport() {
    console.log("\nRUNNING RESTOCK REPORT");

    const dateInfo = {
        startdate: document.getElementById("startdate").value,
        enddate: document.getElementById("enddate").value
    };
    console.log(dateInfo);

    // Query to get the customerSaleLine database
    const saleResponse = await fetch('/salesWithinDateRange', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dateInfo)
    });
    const saleLineDB = await saleResponse.json();
    console.log("SaleLineDB:");
    console.log(saleLineDB);

    if (saleLineDB == "-1") {
        console.log("Invalid dates");
        // TODO: Add feedback
        return;
    }

    
    // Query to get the foodItems database
    const foodResponse = await fetch('/foodItems', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    const foodItemsDB = await foodResponse.json();

    // Create structues to hold the data
    var foodQuantities;
    (foodQuantities = []).length = foodItemsDB.length; 
    foodQuantities.fill(0.00);

    
    // For each sale line, sum up the quantity sold
    for (var i = 0; i < saleLineDB.length; i++) {
        var saleFoodID = saleLineDB[i].foodid;
        var saleQuantity = saleLineDB[i].salelinequantity;

        foodQuantities[saleFoodID - 1] += parseFloat(saleQuantity);

        console.log("quantity sold: ");
        console.log(saleQuantity);
    }
    console.log(foodQuantities);

    
    // Clear the report results table
    var table = document.getElementById("report");
    var tableLen = table.rows.length;
    for (var i = 1; i < tableLen; i++) {
        table.deleteRow(1);
    }

    // Fill the table with the report results
    var table = document.getElementById("report");
    for (var i = 0; i < foodItemsDB.length; i++) {
        console.log("sold: " + foodQuantities[i] + "\nin inv: " + foodItemsDB[i].foodquantity + "\n10% of inv: " + 0.1 * foodItemsDB[i].foodquantity);
        if (foodQuantities[i] <= foodItemsDB[i].foodquantity) {
            continue;
        }

        // Create the new row
        var tr = document.createElement('tr');

        // Create all columns and fill them with data
        rowText = ' \
        <td>' + (i + 1) + '</td> \
        <td>' + foodItemsDB[i].foodname + '</td> \
        <td>' + foodQuantities[i].toFixed(2) + '</td> \
        <td>' + foodItemsDB[i].foodquantity.toFixed(2) + '</td>';

        tr.innerHTML = rowText;
        table.appendChild(tr);
    }

    if (table.rows.length == 1) {
        //TODO: ADD Feedback
        var tr = document.createElement('tr');

        // Create all columns and fill them with data
        rowText = ' \
        <td></td> \
        <td></td> \
        <td>No Items sold more than inventory</td> \
        <td></td>';

        tr.innerHTML = rowText;
        table.appendChild(tr);
    }
}
